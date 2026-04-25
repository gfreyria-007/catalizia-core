# Security Specification - Executive Gauntlet

## Data Invariants
1. A Message cannot be created without a valid Session.
2. A Session must belong to a valid User.
3. Users can only read and write their own data (User profile, Sessions, Messages).
4. `admin` user (gfreyria@gmail.com) can read all data but not modify others' critical progress. (Actually, for this app, the user *is* the admin, but let's stick to strict owner-level access).
5. Terminal State Locking: Once a Session status is 'completed', it cannot be modified.
6. Immutable Fields: `startedAt` and `userId` relations are immutable.

## The Dirty Dozen Payloads

1. **Identity Spoofing**: User A attempts to write to `/users/UserB`.
2. **Privilege Escalation**: User A attempts to add a scenario ID to their `passedScenarios` without a high score. (Wait, rules can't easily verify the "pass" without checking messages, but we can enforce that only the system or owner writes it).
3. **Session Highjacking**: User A attempts to read User B's session history.
4. **Message Poisoning**: User A attempts to inject a 2MB message string.
5. **Session ID Poisoning**: Using a 2KB session ID with junk characters.
6. **Timeline Manipulation**: Creating a message with a `timestamp` in the future.
7. **Score Tampering**: Attempting to set a `score` of 99/10 manually in a Message.
8. **State Shortcut**: Attempting to update a 'completed' session to 'active' again.
9. **Orphaned Message**: Writing a message to a session ID that doesn't exist.
10. **Shadow Field Injection**: Adding an `isAdmin: true` field to the User document.
11. **Email Spoofing**: Trying to claim the admin email `gfreyria@gmail.com` without a verified email token.
12. **Mass Query Scraping**: Attempting to list all users' sessions without a filter.

## Test Runner Logic (Draft)
The `firestore.rules` will be tested against these payloads using the local emulator logic (simulated).
