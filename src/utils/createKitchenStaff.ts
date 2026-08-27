import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const createKitchenStaff = async () => {
  const kitchenStaff = [
    {
      email: 'kitchen@themelt9.com',
      password: 'kitchen123',
      name: 'Kitchen Staff',
      phone: '+92 300 1112223'
    },
    {
      email: 'manager@themelt9.com',
      password: 'manager123',
      name: 'Restaurant Manager',
      phone: '+92 300 1112224',
      role: 'admin'
    }
  ];

  for (const staff of kitchenStaff) {
    try {
      // Check if user already exists (optional - you'd need to implement this check)
      
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        staff.email, 
        staff.password
      );
      
      // Create user document with kitchen/admin role
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: staff.email,
        displayName: staff.name,
        phoneNumber: staff.phone,
        role: staff.role || 'kitchen',
        addresses: [],
        createdAt: serverTimestamp()
      });
      
      console.log(`✅ Created: ${staff.name} (${staff.email})`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️  Already exists: ${staff.email}`);
      } else {
        console.error(`❌ Error creating ${staff.email}:`, error);
      }
    }
  }
};

// To run this, create a temporary file or use browser console
// Example: 
// import { createKitchenStaff } from './utils/createKitchenStaff';
// createKitchenStaff();