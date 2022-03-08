// Import the functions you need from the SDKs you need

import Axios from "axios";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { Link } from "react-router-dom";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
firebase.initializeApp({
	apiKey: "AIzaSyCCVS6NSm772rFtHZlpHSwe7H8Qu1KjaqM",
	authDomain: "better-68f93.firebaseapp.com",
	projectId: "better-68f93",
	storageBucket: "better-68f93.appspot.com",
	messagingSenderId: "114922145770",
	appId: "1:114922145770:web:779c56177ace1e28c61493",
});

export const auth = firebase.auth();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
