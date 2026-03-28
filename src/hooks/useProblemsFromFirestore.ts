"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

import { getFirebaseApp, isFirebaseConfigured } from "../lib/firebaseApp";
import { firestoreDocToUrbanProblem } from "../lib/mapFirestoreProblem";
import type { UrbanProblem } from "../types/problem";

export interface UseProblemsFromFirestoreResult {
  problems: UrbanProblem[];
  loading: boolean;
  error: string | null;
}

export function useProblemsFromFirestore(): UseProblemsFromFirestoreResult {
  const [problems, setProblems] = useState<UrbanProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      setError(
        "Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env.local."
      );
      return;
    }

    const app = getFirebaseApp();
    if (!app) {
      setLoading(false);
      setError("Could not initialize Firebase.");
      return;
    }

    const db = getFirestore(app);
    const name =
      process.env.NEXT_PUBLIC_FIRESTORE_COLLECTION?.trim() || "problems";
    const ref = collection(db, name);

    let unsub: Unsubscribe | undefined;
    try {
      unsub = onSnapshot(
        ref,
        (snap) => {
          const list: UrbanProblem[] = [];
          snap.forEach((docSnap) => {
            const p = firestoreDocToUrbanProblem(
              docSnap.id,
              docSnap.data() as Record<string, unknown>
            );
            if (p) list.push(p);
          });
          setProblems(list);
          setError(null);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Firestore subscription failed");
      setLoading(false);
    }

    return () => {
      unsub?.();
    };
  }, []);

  return {
    problems,
    loading,
    error,
  };
}
