// firebaseConfig.ts

// ✅ Import Firebase core and necessary services
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: '<YOUR_API_KEY_HERE>',
  authDomain: '<YOUR_PROJECT>.firebaseapp.com',
  projectId: '<YOUR_PROJECT_ID>',
  storageBucket: '<YOUR_PROJECT>.appspot.com',
  messagingSenderId: '<YOUR_SENDER_ID>',
  appId: '<YOUR_APP_ID>'
};

// ✅ Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// ✅ Initialize Auth - persistence is handled automatically in React Native
const auth = getAuth(firebaseApp);

// ✅ Initialize Firestore
const db = getFirestore(firebaseApp);

// ✅ Export the instances
export { auth, db };
export default firebaseApp;
