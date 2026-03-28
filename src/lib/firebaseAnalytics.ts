"use client";

import { getFirebaseApp } from "./firebaseApp";

/**
 * Initialize Google Analytics for Firebase once (browser only).
 * Requires NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID and Analytics enabled in the Firebase project.
 */
export async function initFirebaseAnalytics(): Promise<void> {
  if (typeof window === "undefined") return;
  const app = getFirebaseApp();
  if (!app) return;
  if (!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim()) return;

  const { isSupported, getAnalytics } = await import("firebase/analytics");
  const ok = await isSupported();
  if (ok) {
    getAnalytics(app);
  }
}
