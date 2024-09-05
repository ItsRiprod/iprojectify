import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string
  email: string
  password: string
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  createdAt: Timestamp
  lastLoginAt: Timestamp
}