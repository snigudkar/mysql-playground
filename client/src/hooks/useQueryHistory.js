// client/src/hooks/useQueryHistory.js
import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Import db from your new firebase.js file

// Global variables provided by the Canvas environment (appId is still used for Firestore paths)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';


/**
 * Custom hook to manage SQL query history (Firestore).
 * It now receives userId and isAuthenticated from a parent component/hook.
 * @param {string|null} userId The current authenticated user's ID.
 * @param {boolean} isAuthenticated Whether the user is currently authenticated.
 * @param {boolean} isAuthReady Whether the authentication state has been determined.
 * @returns {{queryHistory: Array, isHistoryCollapsed: boolean, setIsHistoryCollapsed: Function, addQueryToHistory: Function, clearHistory: Function}}
 */
const useQueryHistory = (userId, isAuthenticated, isAuthReady) => {
  const [queryHistory, setQueryHistory] = useState([]);
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(true);

  // Firestore Listener for Query History: Fetches history ONLY if authenticated and auth is ready
  useEffect(() => {
    // Only fetch history if Firestore is initialized, auth state is known, and a user is authenticated
    if (!db || !isAuthReady || !isAuthenticated || !userId) {
      setQueryHistory([]); // Clear history if not authenticated or not ready
      return;
    }

    // Firestore path for user-specific data
    const historyCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/queryHistory`);
    const q = query(historyCollectionRef, orderBy('timestamp', 'desc'), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const history = snapshot.docs.map(doc => ({
        id: doc.id, // Firestore document ID
        ...doc.data()
      }));
      setQueryHistory(history);
    }, (error) => {
      console.error("Error fetching query history from Firestore:", error);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [db, isAuthReady, isAuthenticated, userId]); // Re-run when these props change

  /**
   * Adds a query to the history in Firestore.
   * @param {string} queryText The SQL query to add.
   */
  const addQueryToHistory = async (queryText) => {
    if (!db || !userId) {
      console.warn("Firestore or User ID not ready, cannot add query to history.");
      return;
    }
    const trimmedQuery = queryText.trim();
    try {
      // Check if the last query is the same to avoid duplicates
      if (queryHistory.length > 0 && queryHistory[0].query.trim() === trimmedQuery) {
        return; // Do not add duplicate
      }

      const historyCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/queryHistory`);
      await addDoc(historyCollectionRef, {
        query: trimmedQuery,
        timestamp: new Date().toISOString(), // Use ISO string for consistent sorting
      });
      console.log("Query added to Firestore history.");
    } catch (e) {
      console.error("Failed to add query to Firestore history:", e);
    }
  };

  /**
   * Clears all query history for the current user from Firestore.
   */
  const clearHistory = async () => {
    if (!db || !userId) {
      console.warn("Firestore or User ID not ready, cannot clear history.");
      return;
    }
    try {
      const historyCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/queryHistory`);
      const q = query(historyCollectionRef); // Get all documents for the user
      const snapshot = await getDocs(q); // Use getDocs for a one-time fetch to delete

      const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, historyCollectionRef.id, d.id)));
      await Promise.all(deletePromises);
      console.log("Query history cleared from Firestore.");
    } catch (e) {
      console.error("Failed to clear query history from Firestore:", e);
    }
  };

  return {
    queryHistory,
    isHistoryCollapsed,
    setIsHistoryCollapsed,
    addQueryToHistory,
    clearHistory,
  };
};

export default useQueryHistory;
