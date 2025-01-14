// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey:"AIzaSyAeyTXiFkudGBC_oZ2e3s3BbCfcg2JNyhM",

  // apiKey:import.meta.env.VITE_FIREBASE_API_KEY,


  authDomain: "final-project-d208a.firebaseapp.com",

  projectId: "final-project-d208a",

  storageBucket: "final-project-d208a.appspot.com",

  messagingSenderId: "521027337607",

  appId: "1:521027337607:web:30446b0db387207952e722"

};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

