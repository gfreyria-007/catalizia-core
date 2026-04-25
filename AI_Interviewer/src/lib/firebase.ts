import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Message, Persona } from '../types';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

export const handleFirestoreError = (error: any, operationType: FirestoreErrorInfo['operationType'], path: string | null = null) => {
  if (error?.code === 'permission-denied') {
    const user = auth.currentUser;
    const errorInfo: FirestoreErrorInfo = {
      error: error.message,
      operationType,
      path,
      authInfo: {
        userId: user?.uid || 'unauthenticated',
        email: user?.email || 'none',
        emailVerified: user?.emailVerified || false,
        isAnonymous: user?.isAnonymous || false,
        providerInfo: user?.providerData.map(p => ({
          providerId: p.providerId,
          displayName: p.displayName || '',
          email: p.email || ''
        })) || []
      }
    };
    throw new Error(JSON.stringify(errorInfo));
  }
  throw error;
};

export const syncUserProfile = async (user: FirebaseUser) => {
  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        passedScenarios: [],
        lastActive: serverTimestamp()
      });
    } else {
      await updateDoc(userRef, { lastActive: serverTimestamp() });
    }
  } catch (err) {
    handleFirestoreError(err, 'write', `users/${user.uid}`);
  }
};

export const saveSession = async (userId: string, scenarioId: string, status: 'active' | 'completed', finalScore?: number) => {
  const sessionRef = doc(collection(db, 'users', userId, 'sessions'));
  const sessionId = sessionRef.id;
  try {
    await setDoc(sessionRef, {
      scenarioId,
      status,
      startedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...(finalScore !== undefined && { finalScore })
    });
    return sessionId;
  } catch (err) {
    handleFirestoreError(err, 'create', `users/${userId}/sessions/${sessionId}`);
    return '';
  }
};

export const addMessageToSession = async (userId: string, sessionId: string, message: Message) => {
  try {
    const messagesRef = collection(db, 'users', userId, 'sessions', sessionId, 'messages');
    await addDoc(messagesRef, {
      sender: message.sender,
      text: message.text,
      timestamp: message.timestamp,
      ...(message.score !== undefined && { score: message.score }),
      ...(message.reasoning !== undefined && { reasoning: message.reasoning }),
      ...(message.personaName !== undefined && { personaName: message.personaName })
    });
  } catch (err) {
    handleFirestoreError(err, 'create', `users/${userId}/sessions/${sessionId}/messages`);
  }
};
