// Configuração do Firebase para Expo
// Usando apenas JavaScript puro, sem dependências nativas

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

// Configuração do Firebase
// NOTA: Em um ambiente de produção, estas informações devem ser armazenadas em variáveis de ambiente
const firebaseConfig = {
 apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth com persistência para React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
