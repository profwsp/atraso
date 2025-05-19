import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Title, Card, Paragraph, Avatar, List, Divider, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { styles as commonStyles } from '../utils/styles';

// Mock student data - replace with actual data fetching
const mockStudentDetails = {
  id: '67890',
  name: 'Ana Beatriz',
  registration: 'MAT67890',
  class: 'Turma B',
  course: 'Ensino Fundamental II',
  photoUrl: 'https://via.placeholder.com/100',
  email: 'ana.beatriz@example.com',
  phone: '(XX) XXXXX-XXXX',
  responsibleName: 'Maria Souza',
  responsibleContact: '(XX) YYYYY-YYYY',
};

// Mock movement history - replace with actual data fetching
const mockMovementHistory = [
  {
    id: 'm1',
    type: 'Saída Antecipada',
    dateTime: '14/05/2025 10:30',
    reason: 'Consulta Médica',
    details: 'Responsável pela Liberação: Prof. Carlos, Solicitante: Pais/Responsáveis (Maria Souza)'
  },
  {
    id: 'm2',
    type: 'Atraso',
    dateTime: '10/05/2025 08:15',
    reason: 'Trânsito',
    details: 'Chegou 15 minutos atrasada.'
  },
  {
    id: 'm3',
    type: 'Saída Antecipada',
    dateTime: '05/04/2025 14:00',
    reason: 'Estar se sentindo doente',
    details: 'Responsável pela Liberação: Coord. Marta, Solicitante: Próprio Aluno'
  },
];

const StudentDetailsScreen = () => {
  const navigation = useNavigation();
  const [student, setStudent] = useState(mockStudentDetails);
  const [history, setHistory] = useState(mockMovementHistory);

  if (!student) {
    return <Paragraph style={styles.loadingText}>Carregando dados do aluno...</Paragraph>;
  }

  const renderHistoryItem = ({ item }) => (
    <List.Item
      title={`${item.type} - ${item.dateTime}`}
      description={`${item.reason}${item.details ? `\n${item.details}` : ''}`}
      descriptionNumberOfLines={3}
      left={props => <List.Icon {...props} icon={item.type === 'Saída Antecipada' ? 'arrow-left-bold-box-outline' : 'clock-alert-outline'} />}
      style={styles.listItem}
      titleStyle={styles.listItemTitle}
    />
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <Avatar.Image size={100} source={{ uri: student.photoUrl }} style={styles.avatar} />
            <Title style={styles.studentName}>{student.name}</Title>
            <Paragraph style={styles.studentRegistration}>Matrícula: {student.registration}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Informações do Aluno</Title>
          <Paragraph><Text style={styles.boldText}>Turma:</Text> {student.class}</Paragraph>
          <Paragraph><Text style={styles.boldText}>Curso:</Text> {student.course}</Paragraph>
          <Paragraph><Text style={styles.boldText}>Email:</Text> {student.email}</Paragraph>
          <Paragraph><Text style={styles.boldText}>Telefone:</Text> {student.phone}</Paragraph>
          <Divider style={styles.divider} />
          <Paragraph><Text style={styles.boldText}>Responsável:</Text> {student.responsibleName}</Paragraph>
          <Paragraph><Text style={styles.boldText}>Contato do Responsável:</Text> {student.responsibleContact}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Histórico de Movimentação</Title>
          {history.length > 0 ? (
            <FlatList
              data={history}
              renderItem={renderHistoryItem}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={() => <Divider />}
            />
          ) : (
            <Paragraph>Nenhum histórico de movimentação encontrado para este aluno.</Paragraph>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ...commonStyles,
  headerContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    marginBottom: 12,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  studentName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  studentRegistration: {
    fontSize: 16,
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.dark,
  },
  boldText: {
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 10,
  },
  listItem: {
    paddingVertical: 8,
  },
  listItemTitle: {
    fontWeight: 'bold',
  },
  loadingText: {
    padding: 20,
    textAlign: 'center',
    fontSize: 16,
  }
});

export default StudentDetailsScreen;
