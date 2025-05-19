import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, TextInput, Title, Card, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { COLORS } from '../constants/colors';
import { styles as commonStyles } from '../utils/styles';
import { saveExitRecord } from '../utils/storage';

const IdentifyStudentScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      setIsScanning(true);
    } else {
      Alert.alert('Permissão negada', 'É necessário permitir o acesso à câmera para ler o QR Code.');
    }
  };

  const handleSearchStudent = () => {
    if (!searchQuery.trim()) {
      Alert.alert('Erro', 'Por favor, informe a matrícula ou nome do aluno.');
      return;
    }

    setLoading(true);
    console.log('Buscando aluno:', searchQuery);
    
    // Simulação de busca - em um app real, isso seria uma chamada à API ou banco de dados
    setTimeout(() => {
      setLoading(false);
      
      // Dados do aluno (simulados)
      const studentData = {
        id: searchQuery,
        name: 'Nome do Aluno', // Em um app real, viria do banco de dados
        class: 'Turma do Aluno', // Em um app real, viria do banco de dados
        course: 'Curso do Aluno', // Em um app real, viria do banco de dados
      };
      
      // Salvar registro de saída antecipada (o motivo será preenchido na tela de confirmação)
      saveExitRecord(studentData).then(success => {
        if (success) {
          // Navegar para a tela de confirmação com os dados do aluno
          navigation.navigate('ConfirmStudentExit', { student: studentData });
        } else {
          Alert.alert('Erro', 'Não foi possível salvar o registro de saída antecipada.');
        }
      });
    }, 1000);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setIsScanning(false);
    console.log('QR Code Lido:', data);
    
    // Simulação de busca - em um app real, isso seria uma chamada à API ou banco de dados
    setTimeout(() => {
      // Dados do aluno (simulados)
      const studentData = {
        id: data,
        name: 'Nome do Aluno (QR)', // Em um app real, viria do banco de dados
        class: 'Turma do Aluno', // Em um app real, viria do banco de dados
        course: 'Curso do Aluno', // Em um app real, viria do banco de dados
      };
      
      // Salvar registro de saída antecipada (o motivo será preenchido na tela de confirmação)
      saveExitRecord(studentData).then(success => {
        if (success) {
          // Navegar para a tela de confirmação com os dados do aluno
          navigation.navigate('ConfirmStudentExit', { student: studentData });
        } else {
          Alert.alert('Erro', 'Não foi possível salvar o registro de saída antecipada.');
        }
      });
    }, 500);
  };

  if (isScanning) {
    return (
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <Button 
          mode="contained" 
          onPress={() => setIsScanning(false)} 
          style={styles.cancelButton}
        >
          Cancelar Leitura
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Identificar Aluno para Saída</Title>
          
          <Button 
            mode="contained" 
            icon="qrcode-scan" 
            onPress={requestCameraPermission} 
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Ler QR Code do Aluno
          </Button>

          <Paragraph style={styles.orText}>OU</Paragraph>

          <TextInput
            label="Buscar Aluno (Nome ou Matrícula)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            mode="outlined"
            style={styles.input}
          />
          <Button 
            mode="contained" 
            onPress={handleSearchStudent} 
            style={styles.button}
            disabled={!searchQuery.trim() || loading}
            loading={loading}
            labelStyle={styles.buttonLabel}
          >
            Buscar Aluno Manualmente
          </Button>

          <Button 
            mode="outlined"
            onPress={() => navigation.goBack()} 
            style={styles.button}
            textColor={COLORS.secondary}
          >
            Cancelar
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ...commonStyles,
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  scannerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 12,
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 16,
    paddingVertical: 4,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
    color: COLORS.grey,
  },
  cancelButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: COLORS.danger,
    marginBottom: 20,
  }
});

export default IdentifyStudentScreen;
