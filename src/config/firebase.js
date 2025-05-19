// Configuração do Firebase para Expo
// Usando apenas JavaScript puro, sem dependências nativas

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

// Configuração do Firebase
// NOTA: Em um ambiente de produção, estas informações devem ser armazenadas em variáveis de ambiente
const firebaseConfig = {
 
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth com persistência para React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
