import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Alert } from 'react-native';
import { Button, TextInput, Title, Card, Paragraph, RadioButton, Text, DataTable, ActivityIndicator, Chip } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { COLORS } from '../constants/colors';
import { styles as commonStyles } from '../utils/styles';
import { getAllRecords, getDelayRecords, getExitRecords } from '../utils/storage';

const ReportsScreen = () => {
  const navigation = useNavigation();
  const [filterTurma, setFilterTurma] = useState('');
  const [filterCurso, setFilterCurso] = useState('');
  const [filterPeriodo, setFilterPeriodo] = useState('');
  const [reportType, setReportType] = useState('Ambos'); // 'Atrasos', 'Saídas Antecipadas', 'Ambos'
  const [generatedReportData, setGeneratedReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allRecords, setAllRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);

  // Carregar todos os registros quando a tela receber foco
  useFocusEffect(
    React.useCallback(() => {
      loadAllRecords();
      return () => {}; // Cleanup function
    }, [])
  );

  // Função para carregar todos os registros do armazenamento local
  const loadAllRecords = async () => {
    setLoading(true);
    try {
      const records = await getAllRecords();
      setAllRecords(records);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
      Alert.alert('Erro', 'Não foi possível carregar os registros.');
      setLoading(false);
    }
  };

  // Função para formatar data ISO para exibição
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Função para verificar se uma data está dentro de um período
  const isDateInPeriod = (dateStr, periodStr) => {
    if (!periodStr || periodStr.trim() === '') return true;
    
    try {
      const date = new Date(dateStr);
      
      // Formato esperado: DD/MM - DD/MM
      const periodParts = periodStr.split('-').map(p => p.trim());
      if (periodParts.length !== 2) return true;
      
      const currentYear = new Date().getFullYear();
      
      // Início do período
      const startParts = periodParts[0].split('/').map(p => parseInt(p, 10));
      if (startParts.length !== 2) return true;
      const startDate = new Date(currentYear, startParts[1] - 1, startParts[0]);
      
      // Fim do período
      const endParts = periodParts[1].split('/').map(p => parseInt(p, 10));
      if (endParts.length !== 2) return true;
      const endDate = new Date(currentYear, endParts[1] - 1, endParts[0]);
      endDate.setHours(23, 59, 59, 999); // Fim do dia
      
      return date >= startDate && date <= endDate;
    } catch (error) {
      console.error('Erro ao verificar período:', error);
      return true; // Em caso de erro, não filtra
    }
  };

  // Função para gerar relatório com filtros
  const handleGenerateReport = async () => {
    setLoading(true);
    
    try {
      let records = [];
      
      // Obter registros com base no tipo selecionado
      if (reportType === 'Atrasos') {
        records = await getDelayRecords();
      } else if (reportType === 'Saídas Antecipadas') {
        records = await getExitRecords();
      } else { // 'Ambos'
        records = await getAllRecords();
      }
      
      // Aplicar filtros
      const filtered = records.filter(record => {
        // Filtro por turma
        if (filterTurma && !record.studentClass?.toLowerCase().includes(filterTurma.toLowerCase())) {
          return false;
        }
        
        // Filtro por curso
        if (filterCurso && !record.studentCourse?.toLowerCase().includes(filterCurso.toLowerCase())) {
          return false;
        }
        
        // Filtro por período
        if (filterPeriodo && !isDateInPeriod(record.timestamp, filterPeriodo)) {
          return false;
        }
        
        return true;
      });
      
      setFilteredRecords(filtered);
      setGeneratedReportData(filtered);
      setLoading(false);
      
      if (filtered.length === 0) {
        Alert.alert('Informação', 'Nenhum registro encontrado com os filtros aplicados.');
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      Alert.alert('Erro', 'Não foi possível gerar o relatório.');
      setLoading(false);
    }
  };

  // Função para exportar relatório em CSV
  const handleExportCSV = async () => {
    if (generatedReportData.length === 0) {
      Alert.alert('Sem Dados', 'Não há dados para exportar.');
      return;
    }

    try {
      // Criar conteúdo CSV
      let csvContent = "ID,Nome,Matrícula,Turma,Curso,Data e Hora,Tipo,Motivo\n";
      
      generatedReportData.forEach(item => {
        const formattedDate = formatDate(item.timestamp);
        const recordType = item.type === 'delay' ? 'Atraso' : 'Saída Antecipada';
        csvContent += `${item.id},${item.studentName},${item.studentId},${item.studentClass || ''},${item.studentCourse || ''},${formattedDate},${recordType},${item.reason || ''}\n`;
      });
      
      // Criar arquivo temporário
      const fileUri = `${FileSystem.documentDirectory}relatorio_${Date.now()}.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csvContent);
      
      // Compartilhar arquivo
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Informação', 'Compartilhamento não disponível neste dispositivo');
      }
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      Alert.alert('Erro', 'Não foi possível exportar o relatório.');
    }
  };

  // Função para limpar filtros
  const handleClearFilters = () => {
    setFilterTurma('');
    setFilterCurso('');
    setFilterPeriodo('');
    setReportType('Ambos');
    setGeneratedReportData([]);
  };

  // Renderizar item do relatório
  const renderReportItem = ({ item }) => {
    const formattedDate = formatDate(item.timestamp);
    const recordType = item.type === 'delay' ? 'Atraso' : 'Saída Antecipada';
    
    return (
      <DataTable.Row>
        <DataTable.Cell style={styles.cellSmall}>{item.studentName}</DataTable.Cell>
        <DataTable.Cell style={styles.cellSmall}>{item.studentId}</DataTable.Cell>
        <DataTable.Cell style={styles.cellSmall}>{item.studentClass || '-'}</DataTable.Cell>
        <DataTable.Cell style={styles.cellMedium}>{formattedDate}</DataTable.Cell>
        <DataTable.Cell style={styles.cellSmall}>{recordType}</DataTable.Cell>
        <DataTable.Cell style={styles.cellMedium}>{item.reason || '-'}</DataTable.Cell>
      </DataTable.Row>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Relatórios de Movimentação</Title>
          
          {loading && <ActivityIndicator animating={true} color={COLORS.primary} style={styles.loader} />}
          
          <View style={styles.statsContainer}>
            <Chip icon="information" style={styles.statChip}>Total de Registros: {allRecords.length}</Chip>
            <Chip icon="clock-alert" style={styles.statChip}>Atrasos: {allRecords.filter(r => r.type === 'delay').length}</Chip>
            <Chip icon="exit-run" style={styles.statChip}>Saídas: {allRecords.filter(r => r.type === 'exit').length}</Chip>
          </View>

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
            placeholder="Ex: 01/05 - 19/05"
          />

          <Paragraph style={styles.label}>Tipo de Relatório*:</Paragraph>
          <RadioButton.Group onValueChange={newValue => setReportType(newValue)} value={reportType}>
            <View style={styles.radioContainer}>
              <View style={styles.radioItem}><RadioButton value="Atrasos" /><Text>Atrasos</Text></View>
              <View style={styles.radioItem}><RadioButton value="Saídas Antecipadas" /><Text>Saídas Antecipadas</Text></View>
              <View style={styles.radioItem}><RadioButton value="Ambos" /><Text>Ambos</Text></View>
            </View>
          </RadioButton.Group>

          <View style={styles.buttonContainer}>
            <Button 
              mode="contained" 
              onPress={handleGenerateReport} 
              style={styles.buttonAction}
              labelStyle={styles.buttonLabel}
              disabled={loading}
            >
              Gerar Relatório
            </Button>
            
            <Button 
              mode="outlined" 
              onPress={handleClearFilters} 
              style={styles.buttonAction}
              labelStyle={styles.buttonLabel}
              disabled={loading}
            >
              Limpar Filtros
            </Button>
          </View>
        </Card.Content>
      </Card>

      {generatedReportData.length > 0 && (
        <Card style={styles.reportCard}>
          <Card.Content>
            <Title>Resultados do Relatório ({reportType})</Title>
            <Paragraph>Total de registros encontrados: {generatedReportData.length}</Paragraph>
            
            <ScrollView horizontal style={styles.tableContainer}>
              <DataTable style={styles.dataTable}>
                <DataTable.Header>
                  <DataTable.Title style={styles.cellSmall}>Nome</DataTable.Title>
                  <DataTable.Title style={styles.cellSmall}>Matrícula</DataTable.Title>
                  <DataTable.Title style={styles.cellSmall}>Turma</DataTable.Title>
                  <DataTable.Title style={styles.cellMedium}>Data e Hora</DataTable.Title>
                  <DataTable.Title style={styles.cellSmall}>Tipo</DataTable.Title>
                  <DataTable.Title style={styles.cellMedium}>Motivo</DataTable.Title>
                </DataTable.Header>
                
                <FlatList
                  data={generatedReportData}
                  renderItem={renderReportItem}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                />
              </DataTable>
            </ScrollView>
            
            <Button 
              mode="outlined" 
              icon="file-export"
              onPress={handleExportCSV} 
              style={styles.buttonAction}
              textColor={COLORS.success}
              disabled={loading}
            >
              Exportar Relatório (CSV)
            </Button>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ...commonStyles,
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    margin: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  reportCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  radioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  buttonAction: {
    marginVertical: 10,
    paddingVertical: 6,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonLabel: {
    fontSize: 14,
  },
  tableContainer: {
    marginVertical: 16,
  },
  dataTable: {
    minWidth: '100%',
  },
  cellSmall: { 
    width: 120,
    paddingHorizontal: 8,
  },
  cellMedium: { 
    width: 180,
    paddingHorizontal: 8,
  },
  cellLarge: { 
    width: 250,
    paddingHorizontal: 8,
  },
  loader: {
    marginVertical: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  statChip: {
    marginRight: 8,
    marginBottom: 8,
  },
});

export default ReportsScreen;
