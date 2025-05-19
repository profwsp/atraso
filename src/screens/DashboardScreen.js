import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Button, Text, Title, Card, Paragraph, Avatar, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { COLORS } from '../constants/colors';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(auth.currentUser);

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // A navegação será tratada pelo listener de autenticação no App.js
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
    }
  };

  // Confirmar logout
  const confirmLogout = () => {
    Alert.alert(
      'Sair do aplicativo',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: handleLogout, style: 'destructive' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <Title style={styles.welcomeTitle}>Bem-vindo, {user?.email || 'Usuário'}</Title>
          <Paragraph style={styles.welcomeText}>
            Sistema de Registro de Saídas Antecipadas e Atrasos
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.actionsContainer}>
        <Title style={styles.sectionTitle}>Ações Rápidas</Title>
        
        <View style={styles.actionRow}>
          <Card style={styles.actionCard} onPress={() => navigation.navigate('RegisterDelay')}>
            <Card.Content style={styles.actionCardContent}>
              <Avatar.Icon size={50} icon="clock-alert" style={styles.actionIcon} color={COLORS.white} />
              <Paragraph style={styles.actionText}>Registrar Atraso</Paragraph>
            </Card.Content>
          </Card>
          
          <Card style={styles.actionCard} onPress={() => navigation.navigate('IdentifyStudent')}>
            <Card.Content style={styles.actionCardContent}>
              <Avatar.Icon size={50} icon="exit-run" style={styles.actionIcon} color={COLORS.white} />
              <Paragraph style={styles.actionText}>Registrar Saída</Paragraph>
            </Card.Content>
          </Card>
        </View>
        
        <View style={styles.actionRow}>
          <Card style={styles.actionCard} onPress={() => navigation.navigate('Reports')}>
            <Card.Content style={styles.actionCardContent}>
              <Avatar.Icon size={50} icon="file-chart" style={styles.actionIcon} color={COLORS.white} />
              <Paragraph style={styles.actionText}>Relatórios</Paragraph>
            </Card.Content>
          </Card>
          
          <Card style={styles.actionCard} onPress={() => navigation.navigate('StudentDetails', { studentId: '1' })}>
            <Card.Content style={styles.actionCardContent}>
              <Avatar.Icon size={50} icon="account-group" style={styles.actionIcon} color={COLORS.white} />
              <Paragraph style={styles.actionText}>Gerenciar Alunos</Paragraph>
            </Card.Content>
          </Card>
        </View>
      </View>

      <FAB
        style={styles.fab}
        icon="logout"
        onPress={confirmLogout}
        color={COLORS.white}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  welcomeCard: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  welcomeTitle: {
    color: COLORS.white,
    fontSize: 20,
  },
  welcomeText: {
    color: COLORS.white,
    opacity: 0.8,
  },
  actionsContainer: {
    padding: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: COLORS.dark,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionCard: {
    width: '48%',
    borderRadius: 8,
  },
  actionCardContent: {
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    backgroundColor: COLORS.primary,
    marginBottom: 8,
  },
  actionText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.secondary,
  },
});

export default DashboardScreen;
