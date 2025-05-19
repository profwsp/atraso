import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, TextInput, Title, Card, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { COLORS } from '../constants/colors';
import { styles as commonStyles } from '../utils/styles';

const IdentifyStudentScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      setIsScanning(true);
    }
  };

  const handleSearchStudent = () => {
    console.log('Buscando aluno:', searchQuery);
    // Simulando encontrar um aluno
    navigation.navigate('ConfirmStudentExit', { studentId: 'mockStudentId' });
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setIsScanning(false);
    console.log('QR Code Lido:', data);
    navigation.navigate('ConfirmStudentExit', { studentId: data });
  };

  if (isScanning) {
    return (
      <View style={styles.container}>
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
            disabled={!searchQuery.trim()}
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
  }
});

export default IdentifyStudentScreen;
