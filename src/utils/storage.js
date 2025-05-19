import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves para armazenamento
const DELAY_RECORDS_KEY = 'delayRecords';
const EXIT_RECORDS_KEY = 'exitRecords';

/**
 * Salva um registro de atraso no armazenamento local
 * @param {Object} studentData - Dados do aluno
 * @returns {Promise<boolean>} - Sucesso ou falha na operação
 */
export const saveDelayRecord = async (studentData) => {
  try {
    // Obter registros existentes
    const existingRecordsJson = await AsyncStorage.getItem(DELAY_RECORDS_KEY);
    let delayRecords = existingRecordsJson ? JSON.parse(existingRecordsJson) : [];
    
    // Criar novo registro
    const newRecord = {
      id: Date.now().toString(),
      studentId: studentData.id,
      studentName: studentData.name,
      studentClass: studentData.class,
      studentCourse: studentData.course,
      timestamp: new Date().toISOString(),
      type: 'delay'
    };
    
    // Adicionar novo registro à lista
    delayRecords.push(newRecord);
    
    // Salvar lista atualizada
    await AsyncStorage.setItem(DELAY_RECORDS_KEY, JSON.stringify(delayRecords));
    
    console.log('Registro de atraso salvo com sucesso:', newRecord);
    return true;
  } catch (error) {
    console.error('Erro ao salvar registro de atraso:', error);
    return false;
  }
};

/**
 * Salva um registro de saída antecipada no armazenamento local
 * @param {Object} studentData - Dados do aluno
 * @param {string} reason - Motivo da saída antecipada
 * @returns {Promise<boolean>} - Sucesso ou falha na operação
 */
export const saveExitRecord = async (studentData, reason = '') => {
  try {
    // Obter registros existentes
    const existingRecordsJson = await AsyncStorage.getItem(EXIT_RECORDS_KEY);
    let exitRecords = existingRecordsJson ? JSON.parse(existingRecordsJson) : [];
    
    // Criar novo registro
    const newRecord = {
      id: Date.now().toString(),
      studentId: studentData.id,
      studentName: studentData.name,
      studentClass: studentData.class,
      studentCourse: studentData.course,
      reason: reason,
      timestamp: new Date().toISOString(),
      type: 'exit'
    };
    
    // Adicionar novo registro à lista
    exitRecords.push(newRecord);
    
    // Salvar lista atualizada
    await AsyncStorage.setItem(EXIT_RECORDS_KEY, JSON.stringify(exitRecords));
    
    console.log('Registro de saída antecipada salvo com sucesso:', newRecord);
    return true;
  } catch (error) {
    console.error('Erro ao salvar registro de saída antecipada:', error);
    return false;
  }
};

/**
 * Obtém todos os registros de atraso
 * @returns {Promise<Array>} - Lista de registros de atraso
 */
export const getDelayRecords = async () => {
  try {
    const recordsJson = await AsyncStorage.getItem(DELAY_RECORDS_KEY);
    return recordsJson ? JSON.parse(recordsJson) : [];
  } catch (error) {
    console.error('Erro ao obter registros de atraso:', error);
    return [];
  }
};

/**
 * Obtém todos os registros de saída antecipada
 * @returns {Promise<Array>} - Lista de registros de saída antecipada
 */
export const getExitRecords = async () => {
  try {
    const recordsJson = await AsyncStorage.getItem(EXIT_RECORDS_KEY);
    return recordsJson ? JSON.parse(recordsJson) : [];
  } catch (error) {
    console.error('Erro ao obter registros de saída antecipada:', error);
    return [];
  }
};

/**
 * Obtém todos os registros (atrasos e saídas)
 * @returns {Promise<Array>} - Lista combinada de registros
 */
export const getAllRecords = async () => {
  try {
    const delayRecords = await getDelayRecords();
    const exitRecords = await getExitRecords();
    
    // Combinar e ordenar por timestamp (mais recente primeiro)
    const allRecords = [...delayRecords, ...exitRecords];
    allRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return allRecords;
  } catch (error) {
    console.error('Erro ao obter todos os registros:', error);
    return [];
  }
};

/**
 * Obtém registros de um aluno específico
 * @param {string} studentId - ID do aluno
 * @returns {Promise<Array>} - Lista de registros do aluno
 */
export const getStudentRecords = async (studentId) => {
  try {
    const allRecords = await getAllRecords();
    return allRecords.filter(record => record.studentId === studentId);
  } catch (error) {
    console.error(`Erro ao obter registros do aluno ${studentId}:`, error);
    return [];
  }
};

/**
 * Limpa todos os registros (apenas para testes)
 * @returns {Promise<boolean>} - Sucesso ou falha na operação
 */
export const clearAllRecords = async () => {
  try {
    await AsyncStorage.removeItem(DELAY_RECORDS_KEY);
    await AsyncStorage.removeItem(EXIT_RECORDS_KEY);
    return true;
  } catch (error) {
    console.error('Erro ao limpar registros:', error);
    return false;
  }
};
