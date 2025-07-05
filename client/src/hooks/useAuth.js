// client/src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Removed getAuth, initializeApp
import { auth } from '../firebase'; // Import auth from your new firebase.js file

/**
 * Custom hook for managing user authentication state.
 * @returns {{isLoggedIn: boolean, user: object|null, isAuthReady: boolean, handleLogout: Function}}
 */
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Monitor authentication state changes
  useEffect(() => {
    if (!auth) {
      console.error("Firebase Auth not initialized. Check client/src/firebase.js");
      setIsAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Function to handle logout
  const handleLogout = async () => {
    if (!auth) {
      console.error("Firebase Auth not initialized, cannot logout.");
      return;
    }
    try {
      await signOut(auth);
      console.log('User logged out successfully.');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return { isLoggedIn, user, isAuthReady, handleLogout };
};

export default useAuth;
