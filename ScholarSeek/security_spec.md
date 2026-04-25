# Security Specification for ScholarSeek

## Data Invariants
1. Only explicitly authorized UIDs in the `/admins/` collection have administrative access.
2. Admins records are immutable after creation by the system (or another admin).
3. Regular users cannot write to the `/admins/` collection.

## The Dirty Dozen Payloads (Target: /admins/{uid})

1. **Self-Promotion:** User `attacker123` attempts to create `/admins/attacker123` with `{ "email": "attacker@gmail.com" }`. -> DENIED.
2. **Identity Spoofing:** Admin `admin1` tries to create `/admins/attacker123` but sets `email` of a different user. -> DENIED (must match schema).
3. **Ghost Field Injection:** Admin `admin1` tries to update `/admins/uid` with `{ "email": "...", "isSuper": true }`. -> DENIED (strict keys).
4. **Credential Poisoning:** Admin `admin1` tries to set `email` to a 1MB string. -> DENIED (size check).
5. **Timestamp Fraud:** Admin `admin1` sends a client-side `createdAt` timestamp from 2020. -> DENIED (server timestamp check).
6. **Unauthorized Read:** Regular user `user456` tries to read `/admins/uid`. -> DENIED.
7. **Unauthorized List:** Regular user `user456` tries to list `/admins/`. -> DENIED.
8. **Admin Self-Deletion:** Admin `admin1` tries to delete their own record. -> DENIED (unless admin-only).
9. **Admin Overwrite:** Admin `admin1` tries to overwrite a terminal state field. -> DENIED.
10. **Path ID Poisoning:** User tries to access `/admins/INVALID_ID_WITH_SPECIAL_CHARS`. -> DENIED.
11. **Type Mismatch:** User tries to send `email: true` (boolean). -> DENIED.
12. **Unverified Email Auth:** User with unverified email tries to read admin status. -> DENIED.

## Test Strategy
Existing rules must block every attempt above. 
A `firestore.rules.test.ts` would verify these against a simulator.
