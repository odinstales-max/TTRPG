import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// These values are public identifiers, not secrets: a web API key identifies the
// project, it does not grant access. Access is controlled by Firebase Auth and the
// Firestore rules in ../../firestore.rules.
const firebaseConfig = {
  apiKey: 'AIzaSyBBCSKctTZ0mT_HpO_cWeSqzIKHSCjENJU',
  authDomain: 'eraofsilence-744cb.firebaseapp.com',
  projectId: 'eraofsilence-744cb',
  storageBucket: 'eraofsilence-744cb.firebasestorage.app',
  messagingSenderId: '440339874398',
  appId: '1:440339874398:web:6443cf880903d665dcaacf',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
