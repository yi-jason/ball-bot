import dotenv from "dotenv"
dotenv.config();

const { FIREBASE_KEY } = process.env

const firebaseConfig = {
    apiKey: FIREBASE_KEY,
    authDomain: "ball-bot-40285.firebaseapp.com",
    databaseURL: "https://ball-bot-40285-default-rtdb.firebaseio.com",
    projectId: "ball-bot-40285",
    storageBucket: "ball-bot-40285.appspot.com",
    messagingSenderId: "647674860309",
    appId: "1:647674860309:web:85aa39daafb257fd3e0f1c",
    measurementId: "G-74TTYLB6VN"
};

export default firebaseConfig