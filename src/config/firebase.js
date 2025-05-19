// Configuração do Firebase para Expo
// Usando apenas JavaScript puro, sem dependências nativas

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

// Configuração do Firebase
// NOTA: Em um ambiente de produção, estas informações devem ser armazenadas em variáveis de ambiente
const firebaseConfig = {
  apiKey: "AIzaSyCPs_S_4xodpIIU7v_U48QT4OaiZ4qJiBY",
  authDomain: "pontualidade-2e0f3.firebaseapp.com",
  projectId: "pontualidade-2e0f3",
  storageBucket: "pontualidade-2e0f3.firebasestorage.app",
  messagingSenderId: "28198384899",
  appId: "1:28198384899:web:18e27e22f8cb1b6a2ce536",
  measurementId: "G-HSG3JV6NHY"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth com persistência para React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
