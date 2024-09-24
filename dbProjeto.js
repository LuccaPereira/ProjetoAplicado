
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDs6dBCSuPHem7uxrtQNkmoM2KF-ZSEslE",
  authDomain: "projetoaplicado-2f578.firebaseapp.com",
  projectId: "projetoaplicado-2f578",
  storageBucket: "projetoaplicado-2f578.appspot.com",
  messagingSenderId: "115355511974",
  appId: "1:115355511974:web:5fca38830eb5a49d3a1867",
  measurementId: "G-T9MFZ37QLX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);