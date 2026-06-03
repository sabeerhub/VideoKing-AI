/**
 * Firebase Service Initialization and Security Utilities
 */

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";
import { UserProfile } from "./types";

// Initialize standard Firebase client
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore explicitly with correct Database ID to avoid cloud environment mismatch
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Standard handleFirestoreError according to the Firebase Integration Skill guidelines
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore System Access Denied: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// -----------------------------------------------------
// DATABASE UTILITY HOOKS
// -----------------------------------------------------

/**
 * Creates or synchronizes a user's minimalist profile metadata securely in Firestore.
 */
export async function saveUserProfile(user: any): Promise<UserProfile> {
  const userRef = doc(db, "users", user.uid);
  const now = new Date().toISOString();
  
  try {
    // Check if profile exists already
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      // Keep existing custom account states (prevent self-elevation of accounts)
      const data = snapshot.data() as UserProfile;
      const updatedProfile: UserProfile = {
        ...data,
        name: user.displayName || user.email?.split("@")[0] || "Creative Creator",
        photoURL: user.photoURL || "",
        lastLogin: now,
      };
      
      await setDoc(userRef, updatedProfile, { merge: true });
      return updatedProfile;
    } else {
      // Register new user on first-sign-in with Default Free privileges (Zero-Trust rules)
      const newProfile: UserProfile = {
        uid: user.uid,
        name: user.displayName || user.email?.split("@")[0] || "Creative Creator",
        email: user.email || "",
        photoURL: user.photoURL || "",
        createdAt: now,
        lastLogin: now,
        accountStatus: "Free Tier",
      };
      
      await setDoc(userRef, newProfile);
      return newProfile;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    // Fallback if rules deny or offline
    return {
      uid: user.uid,
      name: user.displayName || user.email?.split("@")[0] || "Creative Creator",
      email: user.email || "",
      photoURL: user.photoURL || "",
      createdAt: now,
      lastLogin: now,
      accountStatus: "Free Tier"
    };
  }
}

/**
 * Retreives profile settings document synchronously from the server to bypass client-stale states.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", userId);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${userId}`);
    return null;
  }
}
