# HI Storage

https://hi-storage.web.app

## Tech Stack

- frontend
  - Vite, React
  - Tailwind, daisyUI
  - Vitest, MSW, React-Testing-Library
- server
  - Firebase Functions, Storage, Firestore
  - Vitest

## Upload Steps

1. Upload to Firebase Storage.
1. Generate password hash by generateHashedPassword endpoint of Functions.
1. Add file data to Firestore.
