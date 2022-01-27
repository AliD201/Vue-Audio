import * as firebase from 'firebase/app';
import * as auth from "firebase/auth";
import * as db from "firebase/firestore";
import * as storageGroup from 'firebase/storage';

// import { getAnalytics } from "firebase/analytics";
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
  };
  
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const database = db.getFirestore();
  const usersCollection = db.collection(database, 'users');
  const audiosCollection = db.collection(database, 'audios');
  const commentsCollection = db.collection(database, 'comments');

//   const analytics = getAnalytics(app);
//   const authMod = auth.getAuth();
//   console.log(auth1);

const storage = storageGroup.getStorage(firebaseApp);
const storageRef = storageGroup.ref(storage);

export {
    auth,
    db,
    usersCollection,
    database,
    storageGroup,
    storage,
    storageRef,
    audiosCollection,
    commentsCollection,
};
