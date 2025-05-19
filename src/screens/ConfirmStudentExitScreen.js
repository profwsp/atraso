import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, Alert, Modal, TouchableOpacity } from 'react-native';
import { Button, TextInput, Title, Card, Paragraph, RadioButton, Text, Avatar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { styles as commonStyles } from '../utils/styles';

// Mock student data - replace with actual data fetching
const mockStudentData = {
  id: '12345',
  name: 'João Silva',
  registration: 'MAT12345',
  class: 'Turma A',
  course: 'Ensino Médio',
  photoUrl: 'https://via.placeholder.com/100' // Placeholder image
};

const ConfirmStudentExitScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // const studentId = route.params?.studentId;

  const [student, setStudent] = useState(mockStudentData); // Load student data based on studentId
  const [exitDateTime, setExitDateTime] = useState(new Date());
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [exitReason, setExitReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [requesterType, setRequesterType] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [releaseResponsible, setReleaseResponsible] = useState(''); 
  const [observations, setObservations] = useState('');

  // Função para criar array de datas (para o modal de seleção)
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    // Adiciona hoje e os próximos 7 dias
    for (let i = 0; i < 8; i++) {
      const date = new Date();
      date.setDate(today.getDate() - 7 + i);
      dates.push(date);
    }
    
    return dates;
  };

  // Função para criar array de horários (para o modal de seleção)
  const generateTimeOptions = () => {
    const times = [];
    
    // Horários de 7:00 às 18:00 com intervalos de 30 minutos
    for (let hour = 7; hour <= 18; hour++) {
      for (let minute of [0, 30]) {
        const time = new Date();
        time.setHours(hour, minute, 0);
        times.push(time);
      }
    }
    
    return times;
  };

  const handleDateSelect = (selectedDate) => {
    const newDateTime = new Date(exitDateTime);
    newDateTime.setFullYear(selectedDate.getFullYear());
    newDateTime.setMonth(selectedDate.getMonth());
    newDateTime.setDate(selectedDate.getDate());
    setExitDateTime(newDateTime);
    setShowDateModal(false);
    
    // Em dispositivos Android, abre o seletor de hora após selecionar a data
    if (Platform.OS === 'android') {
      setShowTimeModal(true);
    }
  };

  const handleTimeSelect = (selectedTime) => {
    const newDateTime = new Date(exitDateTime);
    newDateTime.setHours(selectedTime.getHours());
    newDateTime.setMinutes(selectedTime.getMinutes());
    setExitDateTime(newDateTime);
    setShowTimeModal(false);
  };

  const handleRegisterExit = () => {
    if (!exitReason || (exitReason === 'Outro Motivo' && !otherReason.trim()) || !requesterType || ( (requesterType === 'Pais/Responsáveis' || requesterType === 'Outro') && !requesterName.trim()) || !releaseResponsible) {
        Alert.alert("Campos Obrigatórios", "Por favor, preencha todos os campos obrigatórios.");
        return;
    }
    console.log('Registrando Saída:', {
      studentId: student.id,
      exitDateTime,
      exitReason: exitReason === 'Outro Motivo' ? otherReason : exitReason,
      requesterType,
      requesterName,
      releaseResponsible,
      observations
    });
    Alert.alert("Sucesso", "Saída registrada com sucesso!", [
      { text: "OK", onPress: () => navigation.navigate('Dashboard') }
    ]);
  };

  if (!student) {
    return <Paragraph>Carregando dados do aluno...</Paragraph>;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Confirmar Saída do Aluno</Title>
          
          <View style={styles.studentInfoContainer}>
            <Avatar.Image size={80} source={{ uri: student.photoUrl }} style={styles.avatar} />
            <View style={styles.studentTextInfo}>
                <Paragraph style={styles.studentName}>{student.name}</Paragraph>
                <Paragraph>Matrícula: {student.registration}</Paragraph>
                <Paragraph>Turma: {student.class} - Curso: {student.course}</Paragraph>
            </View>
          </View>

          <Button icon="calendar" mode="outlined" onPress={() => setShowDateModal(true)} style={styles.button}>
            Data Saída: {exitDateTime.toLocaleDateString('pt-BR')}
          </Button>
          <Button icon="clock-outline" mode="outlined" onPress={() => setShowTimeModal(true)} style={styles.button}>
            Hora Saída: {exitDateTime.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
          </Button>

          {/* Modal para seleção de data */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showDateModal}
            onRequestClose={() => setShowDateModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Title style={styles.modalTitle}>Selecione a Data</Title>
                <ScrollView>
                  {generateDateOptions().map((date, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.modalOption}
                      onPress={() => handleDateSelect(date)}
                    >
                      <Text style={styles.modalOptionText}>
                        {date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <Button mode="outlined" onPress={() => setShowDateModal(false)} style={styles.modalButton}>
                  Cancelar
                </Button>
              </View>
            </View>
          </Modal>

          {/* Modal para seleção de hora */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showTimeModal}
            onRequestClose={() => setShowTimeModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Title style={styles.modalTitle}>Selecione a Hora</Title>
                <ScrollView>
                  {generateTimeOptions().map((time, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.modalOption}
                      onPress={() => handleTimeSelect(time)}
                    >
                      <Text style={styles.modalOptionText}>
                        {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <Button mode="outlined" onPress={() => setShowTimeModal(false)} style={styles.modalButton}>
                  Cancelar
                </Button>
              </View>
            </View>
          </Modal>

          <Paragraph style={styles.label}>Motivo da Saída*:</Paragraph>
          <RadioButton.Group onValueChange={newValue => setExitReason(newValue)} value={exitReason}>
            <View style={styles.radioItem}><RadioButton value="Solicitação dos Pais/Responsáveis" /><Text>Solicitação dos Pais/Responsáveis</Text></View>
            <View style={styles.radioItem}><RadioButton value="Estar se sentindo doente" /><Text>Estar se sentindo doente</Text></View>
            <View style={styles.radioItem}><RadioButton value="Consulta Médica" /><Text>Consulta Médica</Text></View>
            <View style={styles.radioItem}><RadioButton value="Outro Motivo" /><Text>Outro Motivo</Text></View>
          </RadioButton.Group>
          {exitReason === 'Outro Motivo' && (
            <TextInput
              label="Especificar Outro Motivo*"
              value={otherReason}
              onChangeText={setOtherReason}
              mode="outlined"
              style={styles.input}
            />
          )}

          <Paragraph style={styles.label}>Solicitante da Saída*:</Paragraph>
          <RadioButton.Group onValueChange={newValue => setRequesterType(newValue)} value={requesterType}>
            <View style={styles.radioItem}><RadioButton value="Pais/Responsáveis" /><Text>Pais/Responsáveis</Text></View>
            <View style={styles.radioItem}><RadioButton value="Próprio Aluno" /><Text>Próprio Aluno</Text></View>
            <View style={styles.radioItem}><RadioButton value="Outro" /><Text>Outro</Text></View>
          </RadioButton.Group>
          {(requesterType === 'Pais/Responsáveis' || requesterType === 'Outro') && (
            <TextInput
              label="Nome do Solicitante*"
              value={requesterName}
              onChangeText={setRequesterName}
              mode="outlined"
              style={styles.input}
            />
          )}

          <TextInput
            label="Responsável pela Liberação* (Ex: Professor, Coordenador)"
            value={releaseResponsible}
            onChangeText={setReleaseResponsible}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Observações (Opcional)"
            value={observations}
            onChangeText={setObservations}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
          />

          <Button 
            mode="contained" 
            onPress={handleRegisterExit} 
            style={styles.buttonAction}
            labelStyle={styles.buttonLabel}
          >
            Registrar Saída
          </Button>
          <Button 
            mode="outlined"
            onPress={() => navigation.goBack()} 
            style={styles.buttonAction}
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
  studentInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 10,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grey
  },
  avatar: {
    marginRight: 16,
  },
  studentTextInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark
  },
  buttonAction: {
    marginVertical: 10,
    paddingVertical: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 15,
    color: COLORS.primary,
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 15,
  },
});

export default ConfirmStudentExitScreen;
