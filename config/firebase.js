import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyCpCZ_7jxjdpePmasotGJqGcFtmSHwTxPs',
    authDomain: 'food-app-24e34.firebaseapp.com',
    projectId: 'food-app-24e34',
    storageBucket: 'food-app-24e34.appspot.com',
    messagingSenderId: '883430331498',
    appId: '1:883430331498:web:8c83996f134d5b966da613',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const firestore = firebase.firestore();
export default firebase;
