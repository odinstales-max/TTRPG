import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider, signInWithPopup, signOut as fbSignOut,
  onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from './firebase.js'

const AccountContext = createContext({ user: null, ready: false })
export const useAccount = () => useContext(AccountContext)

export function AccountProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setReady(true) }), [])

  return (
    <AccountContext.Provider value={{ user, ready }}>
      {children}
    </AccountContext.Provider>
  )
}

/** Sign-in controls. Everything works signed out; signing in adds sync. */
export function AccountBar() {
  const { user, ready } = useAccount()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState(null) // null | 'email'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const run = async (fn) => {
    setBusy(true); setError('')
    try { await fn() } catch (err) {
      setError(err?.code === 'auth/popup-closed-by-user' ? '' : (err?.message || String(err)))
    } finally { setBusy(false) }
  }

  if (!ready) return <div className="account"><span className="count">…</span></div>

  if (user) {
    return (
      <div className="account">
        <span className="count" title={user.email || ''}>
          {user.displayName || user.email || 'Signed in'}
        </span>
        <button className="sm" disabled={busy} onClick={() => run(() => fbSignOut(auth))}>
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="account">
      <button className="sm primary" disabled={busy}
              onClick={() => run(() => signInWithPopup(auth, new GoogleAuthProvider()))}>
        Sign in with Google
      </button>
      <button className="sm ghost" onClick={() => setMode(mode ? null : 'email')}>
        {mode ? 'Cancel' : 'Email'}
      </button>
      {mode === 'email' && (
        <div className="account-email">
          <input type="text" placeholder="email" value={email} autoComplete="username"
                 onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="password" value={password}
                 autoComplete="current-password"
                 onChange={(e) => setPassword(e.target.value)} />
          <button className="sm" disabled={busy || !email || !password}
                  onClick={() => run(() => signInWithEmailAndPassword(auth, email, password))}>
            Sign in
          </button>
          <button className="sm ghost" disabled={busy || !email || !password}
                  onClick={() => run(() => createUserWithEmailAndPassword(auth, email, password))}>
            Create account
          </button>
        </div>
      )}
      {error && <span className="warn-text">{error}</span>}
    </div>
  )
}
