import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from './src/constants/colors';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/config/firebase';
import RegisterDelayScreen from './src/screens/RegisterDelayScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import StudentDetailsScreen from './src/screens/StudentDetailsScreen';
import IdentifyStudentScreen from './src/screens/IdentifyStudentScreen';
import ConfirmStudentExitScreen from './src/screens/ConfirmStudentExitScreen';
import ConfirmStudentDelayScreen from './src/screens/ConfirmStudentDelayScreen';


// Telas
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';

// Placeholder para telas que serão implementadas posteriormente
const PlaceholderScreen = () => null;

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = React.useState(null);
  const [initializing, setInitializing] = React.useState(true);

  // Verificar estado de autenticação
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    // Limpar o listener quando o componente for desmontado
    return unsubscribe;
  }, [initializing]);

  // Tema personalizado para o Material Design
  const theme = {
    colors: {
      primary: COLORS.primary,
      accent: COLORS.secondary,
      background: COLORS.background,
      surface: COLORS.white,
      text: COLORS.dark,
      error: COLORS.danger,
      disabled: COLORS.grey,
      placeholder: COLORS.grey,
      backdrop: 'rgba(0, 0, 0, 0.5)',
    },
    roundness: 8,
  };

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (initializing) {
    return null; // Ou uma tela de splash/loading
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            headerTintColor: COLORS.white,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            cardStyle: { backgroundColor: COLORS.background }
          }}
        >
          {!user ? (
            // Rotas não autenticadas
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }}
            />
          ) : (
            // Rotas autenticadas
            <>
              <Stack.Screen 
                name="Dashboard" 
                component={DashboardScreen} 
                options={{ 
                  title: 'Painel Principal',
                  headerLeft: null // Remover botão de voltar
                }}
              />
              <Stack.Screen 
                name="IdentifyStudent" 
                component={IdentifyStudentScreen} 
                options={{ title: 'Registrar Saída - Identificar Aluno' }}
              />
              <Stack.Screen 
                name="ConfirmStudentExit" 
                component={ConfirmStudentExitScreen} 
                options={{ title: 'Registrar Saída - Confirmar' }}
              />
              <Stack.Screen 
                name="RegisterDelay" 
                component={RegisterDelayScreen} 
                options={{ title: 'Registrar Atraso' }}
              />
              <Stack.Screen 
                name="ConfirmStudentDelay" 
                component={ConfirmStudentDelayScreen} 
                options={{ title: 'Registrar Atraso - Confirmar' }}
              />
              <Stack.Screen 
                name="Reports" 
                component={ReportsScreen} 
                options={{ title: 'Relatórios' }}
              />
              <Stack.Screen 
                name="StudentDetails" 
                component={StudentDetailsScreen} 
                options={{ title: 'Detalhes do Aluno' }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
