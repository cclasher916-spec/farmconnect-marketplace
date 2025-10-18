import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import { auth, db } from '@/services/firebase';
import { AuthContextType, AuthState } from '@/types/auth';
import { UserRole } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};

        setState({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            ...userData,
          },
          loading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          loading: false,
          error: null,
        });
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const register = async (email: string, password: string, userData: {
    name: string;
    role: UserRole;
    phone?: string;
  }) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase Auth profile
      await updateProfile(firebaseUser, {
        displayName: userData.name,
      });

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name: userData.name,
        email,
        role: userData.role,
        phone: userData.phone || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message }));
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw error;
    }
  };

  const updateUserProfile = async (data: any) => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, data);
        
        // Update Firestore document
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          ...data,
          updatedAt: new Date(),
        }, { merge: true });
      }
    } catch (error: any) {
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    resetPassword,
    updateProfile: updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};