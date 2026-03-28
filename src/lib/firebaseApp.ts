import { type FirebaseApp, getApps, initializeApp } from "firebase/app";

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "";

/** Client SDK config; omit secrets — use Firestore rules for access control. */
export function isFirebaseConfigured(): boolean {
  return Boolean(apiKey && projectId);
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  const measurementId =
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim() ?? "";
  const config = {
    apiKey,
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? `${projectId}.appspot.com`,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
    ...(measurementId ? { measurementId } : {}),
  };
  if (!getApps().length) {
    return initializeApp(config);
  }
  return getApps()[0]!;
}
