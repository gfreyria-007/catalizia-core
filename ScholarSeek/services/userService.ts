
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, onSnapshot, orderBy, serverTimestamp, deleteDoc } from 'firebase/firestore';

export type UserStatus = 'pending' | 'approved' | 'banned' | 'unregistered';

export interface UserRecord {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  status: UserStatus;
  requestDate?: any;
  approvalDate?: any;
  reason?: string;
  isAdmin?: boolean;
}

const ADMIN_EMAILS = ['gfreyria@gmail.com', 'gabsvpn@gmail.com'];

/**
 * Checks or initializes the user record in Firestore.
 */
export async function syncUserRecord(user: any): Promise<UserRecord> {
  if (!user) throw new Error("No user provided");

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data() as UserRecord;
    // Ensure admin status is synced if email matches any in the list
    if (ADMIN_EMAILS.includes(user.email || '') && !data.isAdmin) {
      await updateDoc(userRef, { isAdmin: true, status: 'approved' });
      return { ...data, isAdmin: true, status: 'approved' };
    }
    return data;
  } else {
    // New user
    const isAdmin = ADMIN_EMAILS.includes(user.email || '');
    const newRecord: UserRecord = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      status: isAdmin ? 'approved' : 'unregistered',
      isAdmin: isAdmin,
    };
    await setDoc(userRef, newRecord);
    return newRecord;
  }
}

/**
 * Submits an access request.
 */
export async function requestAccess(uid: string, reason: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    status: 'pending',
    reason: reason,
    requestDate: serverTimestamp()
  });
}

/**
 * Admin: Approve a user.
 */
export async function approveUser(uid: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    status: 'approved',
    approvalDate: serverTimestamp()
  });
}

/**
 * Admin: Ban a user.
 */
export async function banUser(uid: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    status: 'banned'
  });
}

/**
 * Admin: Add user manually (by email/UID is harder, so we usually approve existing pending ones, 
 * but we can allow "pre-approving" by creating a doc with 'approved' status if we have the UID).
 */
export async function adminCreateUser(uid: string, email: string, name: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    uid,
    email,
    displayName: name,
    status: 'approved',
    approvalDate: serverTimestamp()
  });
}

/**
 * Admin: Delete a user record.
 */
export async function deleteUserRecord(uid: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await deleteDoc(userRef);
}

/**
 * Real-time listener for user directory (Admin only).
 */
export function listenToUsers(callback: (users: UserRecord[]) => void) {
  const q = query(collection(db, 'users'), orderBy('email'));
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => doc.data() as UserRecord);
    callback(users);
  });
}
