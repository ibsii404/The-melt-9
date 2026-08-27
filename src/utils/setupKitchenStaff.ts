import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const createKitchenStaff = async (
  email: string, 
  password: string, 
  name: string
) => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document with kitchen role
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      displayName: name,
      role: 'kitchen',
      createdAt: new Date(),
      addresses: []
    });
    
    console.log(`Kitchen staff ${name} created successfully!`);
    return user;
  } catch (error) {
    console.error('Error creating kitchen staff:', error);
    throw error;
  }
};

// Usage example:
// createKitchenStaff('kitchen@themelt9.com', 'SecurePass123', 'Kitchen Staff');