import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  Firestore,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  Auth,
  User,
} from 'firebase/auth';
import { EmergencyAlert, UserProfile, UserRole, AppLanguage } from '../types';

// Storage keys
const LOCAL_STORAGE_INCIDENTS_KEY = 'vithai_wari_sos_incidents';
const LOCAL_STORAGE_USER_KEY = 'vithai_wari_user_profile';
const LOCAL_STORAGE_FIREBASE_CONFIG = 'vithai_wari_custom_firebase_config';

// Real-time broadcast channel for multi-tab / instant local sync
const sosBroadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('vithai_wari_sos_sync')
  : null;

// Read config from Environment Variables or Local Storage
export interface FirebaseConfigOptions {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export function getFirebaseConfig(): FirebaseConfigOptions | null {
  try {
    const savedCustom = localStorage.getItem(LOCAL_STORAGE_FIREBASE_CONFIG);
    if (savedCustom) {
      const parsed = JSON.parse(savedCustom);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage parse errors
  }

  const envConfig: FirebaseConfigOptions = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  };

  if (envConfig.apiKey && envConfig.projectId && envConfig.apiKey !== 'MY_FIREBASE_API_KEY') {
    return envConfig;
  }

  return null;
}

export function saveCustomFirebaseConfig(config: FirebaseConfigOptions): boolean {
  try {
    localStorage.setItem(LOCAL_STORAGE_FIREBASE_CONFIG, JSON.stringify(config));
    // Reset cached instances
    firebaseApp = null;
    db = null;
    auth = null;
    return true;
  } catch (err) {
    console.error('Error saving Firebase config:', err);
    return false;
  }
}

// Lazy Singletons
let firebaseApp: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export function getFirebaseAppInstance(): FirebaseApp | null {
  if (firebaseApp) return firebaseApp;
  const config = getFirebaseConfig();
  if (!config) return null;

  try {
    if (getApps().length > 0) {
      firebaseApp = getApp();
    } else {
      firebaseApp = initializeApp(config);
    }
    return firebaseApp;
  } catch (error) {
    console.warn('Firebase initialization notice:', error);
    return null;
  }
}

export function getFirestoreDb(): Firestore | null {
  if (db) return db;
  const app = getFirebaseAppInstance();
  if (!app) return null;
  try {
    db = getFirestore(app);
    return db;
  } catch (error) {
    console.warn('Firestore initialization notice:', error);
    return null;
  }
}

export function getFirebaseAuth(): Auth | null {
  if (auth) return auth;
  const app = getFirebaseAppInstance();
  if (!app) return null;
  try {
    auth = getAuth(app);
    return auth;
  } catch (error) {
    console.warn('Firebase Auth initialization notice:', error);
    return null;
  }
}

export function isFirebaseConnected(): boolean {
  return getFirebaseConfig() !== null;
}

// -------------------------------------------------------------
// LOCAL STORAGE & BROADCAST SYNC FALLBACK
// -------------------------------------------------------------
export function getLocalIncidents(): EmergencyAlert[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_INCIDENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading local incidents:', err);
  }
  return [];
}

export function saveLocalIncidents(incidents: EmergencyAlert[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_INCIDENTS_KEY, JSON.stringify(incidents));
    if (sosBroadcastChannel) {
      sosBroadcastChannel.postMessage({ type: 'SOS_UPDATED', incidents });
    }
  } catch (err) {
    console.error('Error saving local incidents:', err);
  }
}

// -------------------------------------------------------------
// REAL-TIME SOS INCIDENTS CRUD & LISTENERS
// -------------------------------------------------------------

/**
 * Creates a new SOS Incident.
 * Status starts as 'pending' ("On Hold / Pending Volunteer Response").
 */
export async function createSOSIncident(incident: Omit<EmergencyAlert, 'id'> & { id?: string }): Promise<EmergencyAlert> {
  const newId = incident.id || `sos_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const fullIncident: EmergencyAlert = {
    ...incident,
    id: newId,
    status: 'pending', // Explicitly ON HOLD / PENDING until volunteer accepts
    createdAt: new Date().toISOString(),
    timeAgo: 'Just now',
  };

  // Try Firestore First
  const firestore = getFirestoreDb();
  if (firestore) {
    try {
      const docRef = doc(firestore, 'sos_incidents', newId);
      await setDoc(docRef, {
        ...fullIncident,
        serverTimestamp: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore write warning, falling back to local sync:', err);
    }
  }

  // Always write to Local state for immediate responsiveness and offline resilience
  const current = getLocalIncidents();
  const updated = [fullIncident, ...current.filter((item) => item.id !== newId)];
  saveLocalIncidents(updated);

  return fullIncident;
}

/**
 * Subscribes to Real-time SOS Incidents.
 * Listens via Firestore onSnapshot if connected, otherwise via BroadcastChannel + Storage events.
 */
export function subscribeToSOSIncidents(callback: (incidents: EmergencyAlert[]) => void): () => void {
  const firestore = getFirestoreDb();

  // If Firestore is available, use real-time Cloud onSnapshot
  if (firestore) {
    try {
      const sosCollection = collection(firestore, 'sos_incidents');
      const q = query(sosCollection, orderBy('createdAt', 'desc'));

      const unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: EmergencyAlert[] = [];
            snapshot.forEach((d) => {
              list.push({ id: d.id, ...d.data() } as EmergencyAlert);
            });
            // Update local cache
            saveLocalIncidents(list);
            callback(list);
          } else {
            // Check local if empty
            callback(getLocalIncidents());
          }
        },
        (err) => {
          console.warn('Firestore subscription fallback:', err);
          callback(getLocalIncidents());
        }
      );

      return () => {
        unsubscribeFirestore();
      };
    } catch (err) {
      console.warn('Could not attach Firestore onSnapshot, using local sync:', err);
    }
  }

  // Local Storage / Multi-window Broadcast Listener
  callback(getLocalIncidents());

  const handleBroadcast = (event: MessageEvent) => {
    if (event.data?.type === 'SOS_UPDATED') {
      callback(event.data.incidents || getLocalIncidents());
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_INCIDENTS_KEY) {
      callback(getLocalIncidents());
    }
  };

  if (sosBroadcastChannel) {
    sosBroadcastChannel.addEventListener('message', handleBroadcast);
  }
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    if (sosBroadcastChannel) {
      sosBroadcastChannel.removeEventListener('message', handleBroadcast);
    }
    window.removeEventListener('storage', handleStorageEvent);
  };
}

/**
 * Volunteer accepts an SOS Incident.
 * Changes status from 'pending' -> 'accepted' (or 'in_progress').
 */
export async function acceptSOSIncident(
  incidentId: string,
  volunteer: { id: string; name: string; phone: string }
): Promise<boolean> {
  const acceptedAt = new Date().toISOString();

  // Firestore update
  const firestore = getFirestoreDb();
  if (firestore) {
    try {
      const docRef = doc(firestore, 'sos_incidents', incidentId);
      await updateDoc(docRef, {
        status: 'accepted',
        assignedVolunteer: volunteer.name,
        acceptedByVolunteerId: volunteer.id,
        acceptedByVolunteerName: volunteer.name,
        acceptedByVolunteerPhone: volunteer.phone,
        acceptedAt: acceptedAt,
      });
    } catch (err) {
      console.warn('Firestore update warning:', err);
    }
  }

  // Local sync
  const current = getLocalIncidents();
  const updated = current.map((item) => {
    if (item.id === incidentId) {
      return {
        ...item,
        status: 'accepted' as const,
        assignedVolunteer: volunteer.name,
        acceptedByVolunteerId: volunteer.id,
        acceptedByVolunteerName: volunteer.name,
        acceptedByVolunteerPhone: volunteer.phone,
        acceptedAt: acceptedAt,
      };
    }
    return item;
  });
  saveLocalIncidents(updated);

  return true;
}

/**
 * Volunteer or Pilgrim marks the SOS incident as COMPLETED / RESOLVED.
 */
export async function completeSOSIncident(incidentId: string, notes?: string): Promise<boolean> {
  const completedAt = new Date().toISOString();

  // Firestore update
  const firestore = getFirestoreDb();
  if (firestore) {
    try {
      const docRef = doc(firestore, 'sos_incidents', incidentId);
      await updateDoc(docRef, {
        status: 'completed',
        completedAt: completedAt,
        resolutionNotes: notes || 'Assistance successfully provided on ground.',
      });
    } catch (err) {
      console.warn('Firestore update warning:', err);
    }
  }

  // Local sync
  const current = getLocalIncidents();
  const updated = current.map((item) => {
    if (item.id === incidentId) {
      return {
        ...item,
        status: 'completed' as const,
        completedAt: completedAt,
        resolutionNotes: notes || 'Assistance successfully provided on ground.',
      };
    }
    return item;
  });
  saveLocalIncidents(updated);

  return true;
}

/**
 * Pilgrim cancels an SOS request.
 */
export async function cancelSOSIncident(incidentId: string): Promise<boolean> {
  const firestore = getFirestoreDb();
  if (firestore) {
    try {
      const docRef = doc(firestore, 'sos_incidents', incidentId);
      await updateDoc(docRef, {
        status: 'cancelled',
      });
    } catch (err) {
      console.warn('Firestore cancel warning:', err);
    }
  }

  const current = getLocalIncidents();
  const updated = current.map((item) => {
    if (item.id === incidentId) {
      return { ...item, status: 'cancelled' as const };
    }
    return item;
  });
  saveLocalIncidents(updated);

  return true;
}

// -------------------------------------------------------------
// USER PROFILE & AUTHENTICATION
// -------------------------------------------------------------

export function getLocalUserProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.fullName) {
        // Ensure roles array exists
        if (!parsed.roles || !Array.isArray(parsed.roles)) {
          parsed.roles = [parsed.role || 'pilgrim'];
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading local user:', err);
  }
  return null;
}

export const getCurrentUser = getLocalUserProfile;

export function saveLocalUserProfile(profile: UserProfile): void {
  try {
    // Ensure roles array is populated
    if (!profile.roles || profile.roles.length === 0) {
      profile.roles = [profile.role || 'pilgrim'];
    }
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving local user:', err);
  }
}

export function clearLocalUserProfile(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  } catch (err) {
    console.error('Error clearing local user:', err);
  }
}

/**
 * Saves user profile to Firestore (if available) & local storage.
 */
export async function syncUserProfileToBackend(profile: UserProfile): Promise<void> {
  saveLocalUserProfile(profile);

  const firestore = getFirestoreDb();
  if (firestore && profile.uid) {
    try {
      const userDocRef = doc(firestore, 'users', profile.uid);
      await setDoc(userDocRef, {
        ...profile,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore user profile sync notice:', err);
    }
  }
}

/**
 * Sign Out from Firebase and local state.
 */
export async function appLogout(): Promise<void> {
  const firebaseAuth = getFirebaseAuth();
  if (firebaseAuth) {
    try {
      await signOut(firebaseAuth);
    } catch (err) {
      console.warn('Firebase signout warning:', err);
    }
  }
  clearLocalUserProfile();
}
