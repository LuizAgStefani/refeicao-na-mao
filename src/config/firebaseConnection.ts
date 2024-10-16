import {initializeApp, getApps} from 'firebase/app';
import {initializeAuth, getReactNativePersistence} from 'firebase/auth';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDuhJoKIe_Q6ouOBiKlgU4WETW-w2DLnAM',
  authDomain: 'calculadora-alimentos.firebaseapp.com',
  projectId: 'calculadora-alimentos',
  storageBucket: 'calculadora-alimentos.appspot.com',
  messagingSenderId: '837442132171',
  appId: '1:837442132171:web:85c0bfcca75b00a0eaa34e',
};

// Inicializar o Firebase App
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Inicializar o Firebase Auth com persistência usando AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export {auth};
