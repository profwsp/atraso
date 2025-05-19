import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, Text, Card, HelperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { COLORS } from '../constants/colors';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuário já está autenticado, redirecionar para o Dashboard
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      }
    });

    // Limpar o listener quando o componente for desmontado
    return unsubscribe;
  }, [navigation]);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('O e-mail é obrigatório');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Digite um e-mail válido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    if (!password.trim()) {
      setPasswordError('A senha é obrigatória');
      return false;
    } else if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    // Limpar erro anterior
    setError('');
    
    // Validar campos
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Tentar fazer login com Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      
      // Login bem-sucedido, navegação será tratada pelo useEffect
    } catch (error) {
      // Tratar erros de autenticação
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado. Verifique seu e-mail.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta. Tente novamente.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'E-mail inválido.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde.';
          break;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para criar uma conta de teste (apenas para demonstração)
  const handleCreateTestAccount = async () => {
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, 'admin@escola.com', 'senha123');
      Alert.alert('Sucesso', 'Conta de teste criada com sucesso!');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Informação', 'A conta de teste já existe. Você pode fazer login com ela.');
      } else {
        Alert.alert('Erro', 'Não foi possível criar a conta de teste: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.logoContainer}>
              <Title style={styles.title}>Registro de Saída Antecipada</Title>
              <Image 
                source={require('../../assets/icon.png')} 
                style={styles.logo} 
              />
              <Text style={styles.subtitle}>Escola Técnica Profissionalizante</Text>
            </View>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <TextInput
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              onBlur={validateEmail}
              mode="outlined"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              error={!!emailError}
              left={<TextInput.Icon icon="email" />}
            />
            {emailError ? <HelperText type="error">{emailError}</HelperText> : null}
            
            <TextInput
              label="Senha"
              value={password}
              onChangeText={setPassword}
              onBlur={validatePassword}
              secureTextEntry
              mode="outlined"
              style={styles.input}
              error={!!passwordError}
              left={<TextInput.Icon icon="lock" />}
              right={<TextInput.Icon icon="eye" />}
            />
            {passwordError ? <HelperText type="error">{passwordError}</HelperText> : null}
            
            <Button 
              mode="contained" 
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.button}
              icon="login"
            >
              Entrar
            </Button>
            
            <Text style={styles.helpText}>
              Credenciais de teste: admin@escola.com / senha123
            </Text>
            
            <Button 
              mode="text" 
              onPress={handleCreateTestAccount}
              disabled={isLoading}
              style={styles.createAccountButton}
            >
              Criar conta de teste
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    elevation: 4,
    borderRadius: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.grey,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
    backgroundColor: COLORS.white,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: 16,
  },
  helpText: {
    marginTop: 16,
    textAlign: 'center',
    color: COLORS.grey,
    fontSize: 12,
  },
  createAccountButton: {
    marginTop: 8,
  }
});

export default LoginScreen;
