// firebaseConfig.ts

// ✅ Import Firebase core and necessary services
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDtxxr-cM96J4nZMvuFeYdO05LXg813-48",
  authDomain: "city-pulse-d252e.firebaseapp.com",
  projectId: "city-pulse-d252e",
  storageBucket: "city-pulse-d252e.appspot.com",
  messagingSenderId: "38408091933",
  appId: "1:38408091933:web:caf893701a454d86af89f4"
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
