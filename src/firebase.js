import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyAlNB6JFrIQQaxe3P3nKSXLWcqlQmNeqRQ",
    authDomain: "czatozrod.firebaseapp.com",
    databaseURL: "https://czatozrod.firebaseio.com",
    projectId: "czatozrod",
    storageBucket: "czatozrod.appspot.com",
    messagingSenderId: "12032939607"
};
firebase.initializeApp(config);
export default firebase;