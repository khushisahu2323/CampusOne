import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyDEIn2c2kgyMwwwSMyQg3DDZrNLoJF_fGw",

    authDomain: "campusone-bd5c5.firebaseapp.com",

    projectId: "campusone-bd5c5",

    storageBucket: "campusone-bd5c5.firebasestorage.app",

    messagingSenderId: "1056457840584",

    appId: "1:1056457840584:web:313eb137ebd5aedab912fd"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider =
    new GoogleAuthProvider();