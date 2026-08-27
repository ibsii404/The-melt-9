import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import toast from 'react-hot-toast';

export type UserRole = 'customer' | 'kitchen' | 'admin';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role: UserRole;
  addresses: Address[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface Address {
  id: string;
  label: string; // 'Home', 'Work', etc.
  street: string;
  area: string;
  city: string;
  instructions?: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateUserData: (data: Partial<UserData>) => Promise<boolean>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const isKitchenStaff = (userData: UserData | null): boolean => {
  return userData?.role === 'kitchen' || userData?.role === 'admin';
};

export const useKitchenAccess = (): boolean => {
  const { userData } = useAuth();
  return isKitchenStaff(userData);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const handleRedirectSignIn = async () => {
      try {
        const redirectResult = await getRedirectResult(auth);
        if (!redirectResult?.user) return;

        const userDoc = await getDoc(doc(db, 'users', redirectResult.user.uid));
        if (!userDoc.exists()) {
          const redirectedUserData: UserData = {
            uid: redirectResult.user.uid,
            email: redirectResult.user.email || '',
            displayName: redirectResult.user.displayName || 'Google User',
            role: 'customer',
            addresses: [],
            createdAt: new Date()
          };

          await setDoc(doc(db, 'users', redirectResult.user.uid), {
            ...redirectedUserData,
            ...(redirectResult.user.phoneNumber ? { phoneNumber: redirectResult.user.phoneNumber } : {}),
            createdAt: serverTimestamp()
          });
          setUserData(redirectedUserData);
        } else {
          setUserData(userDoc.data() as UserData);
        }

        toast.success('Logged in with Google!');
      } catch (error: any) {
        console.error('Google redirect result error:', error);
      }
    };

    handleRedirectSignIn();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserData(result.user.uid);
      toast.success(`Welcome back! ${result.user.email}`);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email format');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many failed attempts. Try again later');
      } else {
        toast.error(error.message || 'Login failed');
      }
      return false;
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    phone: string
  ): Promise<boolean> => {
    try {
      // Create auth user
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      const userData: UserData = {
        uid: result.user.uid,
        email: email,
        displayName: name,
        phoneNumber: phone,
        role: 'customer', // Default role
        addresses: [],
        createdAt: new Date()
      };
      
      await setDoc(doc(db, 'users', result.user.uid), {
        ...userData,
        createdAt: serverTimestamp()
      });
      
      setUserData(userData);
      toast.success('Account created successfully!');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password should be at least 6 characters');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email format');
      } else {
        toast.error(error.message || 'Registration failed');
      }
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists in Firestore, if not create
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        const userData: UserData = {
          uid: result.user.uid,
          email: result.user.email!,
          displayName: result.user.displayName || 'Google User',
          role: 'customer',
          addresses: [],
          createdAt: new Date()
        };
        
        await setDoc(doc(db, 'users', result.user.uid), {
          ...userData,
          ...(result.user.phoneNumber ? { phoneNumber: result.user.phoneNumber } : {}),
          createdAt: serverTimestamp()
        });
        
        setUserData(userData);
      } else {
        setUserData(userDoc.data() as UserData);
      }
      
      toast.success('Logged in with Google!');
      return true;
    } catch (error: any) {
      console.error('Google login error:', error);
      if (
        error.code === 'auth/popup-blocked' ||
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request'
      ) {
        try {
          await signInWithRedirect(auth, provider);
          return true;
        } catch (redirectError: any) {
          console.error('Google redirect login error:', redirectError);
          toast.error(redirectError.message || 'Google login failed');
          return false;
        }
      }

      if (error.code === 'auth/unauthorized-domain') {
        toast.error('This domain is not authorized for Google sign-in in Firebase.');
      } else {
        toast.error(error.message || 'Google login failed');
      }
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUserData(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Logout failed');
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Check your inbox.');
      return true;
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email format');
      } else {
        toast.error(error.message || 'Password reset failed');
      }
      return false;
    }
  };

  const updateUserData = async (data: Partial<UserData>): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in');
      return false;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      await fetchUserData(user.uid);
      toast.success('Profile updated successfully');
      return true;
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || 'Update failed');
      return false;
    }
  };

  const addAddress = async (address: Omit<Address, 'id'>): Promise<boolean> => {
    if (!user || !userData) {
      toast.error('You must be logged in');
      return false;
    }

    try {
      const newAddress: Address = {
        ...address,
        id: Date.now().toString()
      };

      const updatedAddresses = [...(userData.addresses || []), newAddress];
      
      // If this is the first address or marked as default, update others
      if (newAddress.isDefault) {
        updatedAddresses.forEach(addr => {
          addr.isDefault = addr.id === newAddress.id;
        });
      }

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        addresses: updatedAddresses,
        updatedAt: serverTimestamp()
      }, { merge: true });

      await fetchUserData(user.uid);
      toast.success('Address added successfully');
      return true;
    } catch (error: any) {
      console.error('Add address error:', error);
      toast.error(error.message || 'Failed to add address');
      return false;
    }
  };

  const value = {
    user,
    userData,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserData,
    addAddress
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
