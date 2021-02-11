import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBDwFHkPophY1s8ByUqmxDtpRW8rOyz46s',
  authDomain: 'todos-332e5.firebaseapp.com',
  projectId: 'todos-332e5',
  databaseURL: 'https://todos-332e5-default-rtdb.firebaseio.com',
  storageBucket: 'todos-332e5.appspot.com',
  messagingSenderId: '936870693821',
  appId: '1:936870693821:web:eb6b4e553987740047a0d4',
};

firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
