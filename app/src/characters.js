import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDocs,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase.js'

// Characters live in one of two places. Signed out, the working character sits in
// localStorage exactly as it always has. Signed in, saved characters live at
// users/{uid}/characters and follow you between devices. The working draft stays
// local either way, so nothing is lost by signing out mid-build.

export const DRAFT_KEY = 'gamename-v4-character'

export function loadDraft(fallback) {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

export function saveDraft(character) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(character)) } catch { /* private mode */ }
}

const charactersRef = (uid) => collection(db, 'users', uid, 'characters')

/** Shape a builder character into the document the security rules expect. */
function toDocument(character, { includeCreated }) {
  const payload = {
    name: String(character.name || 'Unnamed').slice(0, 80),
    level: Number(character.level) || 1,
    sheet: character,
    updatedAt: serverTimestamp(),
  }
  if (includeCreated) payload.createdAt = serverTimestamp()
  return payload
}

export async function listCharacters(uid) {
  const snap = await getDocs(query(charactersRef(uid), orderBy('updatedAt', 'desc')))
  return snap.docs.map((d) => ({
    id: d.id,
    name: d.data().name,
    level: d.data().level,
    updatedAt: d.data().updatedAt?.toDate?.() ?? null,
    sheet: d.data().sheet,
  }))
}

export async function createCharacter(uid, character) {
  const ref = await addDoc(charactersRef(uid), toDocument(character, { includeCreated: true }))
  return ref.id
}

/**
 * updateDoc merges, so createdAt is never part of the write and the rules'
 * immutability check on it passes without the client having to echo it back.
 */
export async function updateCharacter(uid, id, character) {
  await updateDoc(doc(db, 'users', uid, 'characters', id),
                  toDocument(character, { includeCreated: false }))
}

export async function deleteCharacter(uid, id) {
  await deleteDoc(doc(db, 'users', uid, 'characters', id))
}
