import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Button, TextInput, Title, Card, Paragraph, RadioButton, Text, DataTable } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { COLORS } from '../constants/colors';
import { styles as commonStyles } from '../utils/styles';

// Mock data - replace with actual data fetching and filtering logic
const mockAllReportsData = [
  {
    id: '1', 
    studentName: 'Ana Beatriz', 
    studentRegistration: 'MAT67890', 
    exitDateTime: '14/05/2025 10:30', 
    reason: 'Consulta Médica', 
    requester: 'Pais/Responsáveis (Maria Souza)', 
    liberator: 'Prof. Carlos', 
    registrar: 'Portaria (José)', 
    observations: 'Atestado entregue.'
  },
  {
    id: '2', 
    studentName: 'Carlos Eduardo', 
    studentRegistration: 'MAT54321', 
    exitDateTime: '13/05/2025 15:00', 
    reason: 'Estar se sentindo doente', 
    requester: 'Próprio Aluno', 
    liberator: 'Coord. Silva', 
    registrar: 'Secretaria (Ana)', 
    observations: ''
  },
  // Add more mock data for exits and delays if needed for 'Ambos'
];

const ReportsScreen = () => {
  const navigation = useNavigation();
  const [filterTurma, setFilterTurma] = useState('');
  const [filterCurso, setFilterCurso] = useState('');
  const [filterPeriodo, setFilterPeriodo] = useState(''); // e.g., 'DD/MM/YYYY - DD/MM/YYYY'
  const [reportType, setReportType] = useState('Saídas Antecipadas'); // 'Atrasos', 'Saídas Antecipadas', 'Ambos'
  const [generatedReportData, setGeneratedReportData] = useState([]);

  const handleGenerateReport = () => {
    console.log('Gerando Relatório com filtros:', { filterTurma, filterCurso, filterPeriodo, reportType });
    // Implement actual filtering logic based on state
    // For now, just showing all mock data if type is 'Saídas Antecipadas' or 'Ambos'
    if (reportType === 'Saídas Antecipadas' || reportType === 'Ambos') {
      setGeneratedReportData(mockAllReportsData);
    } else {
      setGeneratedReportData([]); // Clear for 'Atrasos' as no mock data for it yet
    }
  };

  const handleExportCSV = async () => {
    if (generatedReportData.length === 0) {
      alert("Sem Dados", "Não há dados para exportar.");
      return;
    }

    try {
      // Create CSV content
      let csvContent = "Nome,Matrícula,Data e Hora,Motivo,Solicitante,Responsável\n";
      
      generatedReportData.forEach(item => {
        csvContent += `${item.studentName},${item.studentRegistration},${item.exitDateTime},${item.reason},${item.requester},${item.liberator}\n`;
      });
      
      // Create a temporary file
      const fileUri = `${FileSystem.documentDirectory}relatorio_saidas.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvContent);
      
      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        alert("Compartilhamento não disponível neste dispositivo");
      }
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      alert("Erro ao exportar o relatório");
    }
  };

  const renderReportItem = ({ item }) => (
    <DataTable.Row>
      <DataTable.Cell style={styles.cellSmall}>{`${item.studentName} (${item.studentRegistration})`}</DataTable.Cell>
      <DataTable.Cell style={styles.cellMedium}>{item.exitDateTime}</DataTable.Cell>
      <DataTable.Cell style={styles.cellMedium}>{item.reason}</DataTable.Cell>
      <DataTable.Cell style={styles.cellMedium}>{item.requester}</DataTable.Cell>
      <DataTable.Cell style={styles.cellSmall}>{item.liberator}</DataTable.Cell>
    </DataTable.Row>
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Relatórios de Movimentação</Title>

          <TextInput
            label="Filtrar por Turma (Opcional)"
            value={filterTurma}
            onChangeText={setFilterTurma}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Filtrar por Curso (Opcional)"
            value={filterCurso}
            onChangeText={setFilterCurso}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Filtrar por Período (Ex: DD/MM - DD/MM) (Opcional)"
            value={filterPeriodo}
            onChangeText={setFilterPeriodo}
            mode="outlined"
            style={styles.input}
          />

          <Paragraph style={styles.label}>Tipo de Relatório*:</Paragraph>
          <RadioButton.Group onValueChange={newValue => setReportType(newValue)} value={reportType}>
            <View style={styles.radioItem}><RadioButton value="Atrasos" /><Text>Atrasos</Text></View>
            <View style={styles.radioItem}><RadioButton value="Saídas Antecipadas" /><Text>Saídas Antecipadas</Text></View>
            <View style={styles.radioItem}><RadioButton value="Ambos" /><Text>Ambos</Text></View>
          </RadioButton.Group>

          <Button 
            mode="contained" 
            onPress={handleGenerateReport} 
            style={styles.buttonAction}
            labelStyle={styles.buttonLabel}
          >
            Gerar Relatório
          </Button>
        </Card.Content>
      </Card>

      {generatedReportData.length > 0 && (
        <Card style={styles.reportCard}>
          <Card.Content>
            <Title>Resultados do Relatório ({reportType})</Title>
            <ScrollView horizontal>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title style={styles.cellSmall}>Aluno (Nome e Matrícula)</DataTable.Title>
                        <DataTable.Title style={styles.cellMedium}>Data e Hora Saída</DataTable.Title>
                        <DataTable.Title style={styles.cellMedium}>Motivo</DataTable.Title>
                        <DataTable.Title style={styles.cellMedium}>Solicitante</DataTable.Title>
                        <DataTable.Title style={styles.cellSmall}>Liberador</DataTable.Title>
                    </DataTable.Header>
                    <FlatList
                        data={generatedReportData}
                        renderItem={renderReportItem}
                        keyExtractor={item => item.id}
                    />
                </DataTable>
            </ScrollView>
            <Button 
              mode="outlined" 
              icon="file-export"
              onPress={handleExportCSV} 
              style={styles.buttonAction}
              textColor={COLORS.success}
            >
              Exportar Relatório
            </Button>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ...commonStyles,
  reportCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  buttonAction: {
    marginVertical: 10,
    paddingVertical: 8,
  },
  cellSmall: { width: 150 },
  cellMedium: { width: 200 },
  cellLarge: { width: 250 },
});

export default ReportsScreen;
