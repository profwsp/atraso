import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Title, Card, Paragraph, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { COLORS } from '../constants/colors';
import { saveDelayRecord } from '../utils/storage';

const RegisterDelayScreen = () => {
  const navigation = useNavigation();
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  // Função para solicitar permissão da câmera
  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      setIsScanning(true);
    } else {
      Alert.alert('Permissão negada', 'É necessário permitir o acesso à câmera para ler o QR Code.');
    }
  };

  // Função para buscar aluno pelo ID
  const handleSearchStudent = () => {
    if (!studentId.trim()) {
      Alert.alert('Erro', 'Por favor, informe a matrícula do aluno.');
      return;
    }

    setLoading(true);
    
    // Simulação de busca - em um app real, isso seria uma chamada à API ou banco de dados
    setTimeout(() => {
      setLoading(false);
      
      // Dados do aluno (simulados)
      const studentData = {
        id: studentId,
        name: 'Nome do Aluno', // Em um app real, viria do banco de dados
        class: 'Turma do Aluno', // Em um app real, viria do banco de dados
        course: 'Curso do Aluno', // Em um app real, viria do banco de dados
      };
      
      // Salvar registro de atraso
      saveDelayRecord(studentData).then(success => {
        if (success) {
          // Navegar para a tela de confirmação com os dados do aluno
          navigation.navigate('ConfirmStudentDelay', { student: studentData });
        } else {
          Alert.alert('Erro', 'Não foi possível salvar o registro de atraso.');
        }
      });
    }, 1000);
  };

  // Função para processar o QR Code lido
  const handleBarCodeScanned = ({ type, data }) => {
    setIsScanning(false);
    console.log('QR Code Lido:', data);
    
    // Assumindo que o QR Code contém o ID do aluno
    setStudentId(data);
    
    // Simulação de busca - em um app real, isso seria uma chamada à API ou banco de dados
    setTimeout(() => {
      // Dados do aluno (simulados)
      const studentData = {
        id: data,
        name: 'Nome do Aluno (QR)', // Em um app real, viria do banco de dados
        class: 'Turma do Aluno', // Em um app real, viria do banco de dados
        course: 'Curso do Aluno', // Em um app real, viria do banco de dados
      };
      
      // Salvar registro de atraso
      saveDelayRecord(studentData).then(success => {
        if (success) {
          // Navegar para a tela de confirmação com os dados do aluno
          navigation.navigate('ConfirmStudentDelay', { student: studentData });
        } else {
          Alert.alert('Erro', 'Não foi possível salvar o registro de atraso.');
        }
      });
    }, 500);
  };

  // Renderizar o scanner de QR Code quando estiver ativo
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
          labelStyle={styles.buttonLabel}
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
          <Title style={styles.title}>Registrar Atraso de Aluno</Title>
          <Paragraph style={styles.paragraph}>
            Informe a matrícula do aluno para registrar o atraso.
          </Paragraph>
          
          <Divider style={styles.divider} />
          
          <TextInput
            label="Matrícula do Aluno"
            value={studentId}
            onChangeText={setStudentId}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            autoFocus
          />
          
          <Button
            mode="contained"
            onPress={handleSearchStudent}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Buscar Aluno
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.buttonSecondary}
          >
            Cancelar
          </Button>
        </Card.Content>
      </Card>
      
      <Card style={styles.cardInfo}>
        <Card.Content>
          <Title style={styles.titleInfo}>Leitura de QR Code</Title>
          <Paragraph>
            Você também pode escanear o QR Code do crachá do aluno para registrar o atraso.
          </Paragraph>
          <Button
            mode="contained"
            icon="qrcode-scan"
            onPress={requestCameraPermission}
            style={[styles.button, styles.scanButton]}
          >
            Escanear QR Code
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  cardInfo: {
    borderRadius: 8,
    backgroundColor: COLORS.primary + '15', // Cor primária com 15% de opacidade
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
  },
  titleInfo: {
    fontSize: 18,
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 12,
    paddingVertical: 6,
  },
  buttonSecondary: {
    marginBottom: 8,
  },
  scanButton: {
    marginTop: 8,
    backgroundColor: COLORS.secondary,
  },
  cancelButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: COLORS.danger,
    marginBottom: 20,
  },
  buttonLabel: {
    fontSize: 16,
    paddingVertical: 4,
  },
});

export default RegisterDelayScreen;
