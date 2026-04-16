import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { Package } from 'lucide-react';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Initializing onAuthStateChanged...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('AuthProvider: Auth state changed. User:', user?.email || 'None');
      setUser(user);
      setLoading(false);
    }, (error) => {
      console.error('AuthProvider: Error onAuthStateChanged:', error);
      setLoading(false);
    });

    // Fallback: If firebase doesn't respond in 5s, stop loading anyway to show something
    const timer = setTimeout(() => {
      setLoading((prev) => {
        if (prev) {
          console.warn('AuthProvider: Auth initialization timed out.');
          return false;
        }
        return prev;
      });
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="p-10 text-center">
          <div className="relative inline-block mb-8">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-primary">
              <Package size={24} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Scanventory</h2>
          <p className="text-slate-500 animate-pulse">Initializing application...</p>
        </div>
      </div>
    );
  }

  const value = {
    user,
    login,
    loginWithGoogle,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
