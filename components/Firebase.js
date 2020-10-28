import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/storage';

var firebaseConfig = {
    apiKey: "AIzaSyBxuBKH-RANijvEFGEgz2D7e-bqP-dToo4",
    authDomain: "snapdrink-7494e.firebaseapp.com",
    databaseURL: "https://snapdrink-7494e.firebaseio.com",
    projectId: "snapdrink-7494e",
    storageBucket: "snapdrink-7494e.appspot.com",
    messagingSenderId: "119449744985",
    appId: "1:119449744985:web:49c96f612dc6d0b0d5e348"
  };
    // Initialize Firebase
      firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
