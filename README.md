# Aplicativo de Registro de Saída Antecipada e Atraso

Este aplicativo foi desenvolvido para escolas técnicas profissionalizantes, permitindo o gerenciamento de saídas antecipadas e atrasos de alunos com autenticação Firebase.

## Funcionalidades Principais

- **Autenticação de Usuários**: Login seguro com e-mail e senha usando Firebase Authentication
- **Registro de Saída Antecipada**: Identificação do aluno via QR Code ou matrícula
- **Registro de Atraso**: Controle de atrasos dos alunos
- **Relatórios**: Visualização de histórico de movimentações
- **Gerenciamento de Alunos**: Visualização de dados e histórico

## Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile
- **Expo**: Plataforma para simplificar o desenvolvimento React Native
- **Firebase Authentication**: Para autenticação de usuários (JavaScript puro, sem módulos nativos)
- **Material Design**: Interface moderna e profissional

## Configuração do Firebase

Para configurar o Firebase no projeto:

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Adicione um aplicativo Web ao seu projeto Firebase
3. Copie as credenciais de configuração
4. Substitua as credenciais no arquivo `src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "seu-messaging-sender-id",
  appId: "seu-app-id"
};
```

5. Ative o Firebase Authentication com email/senha
6. Crie pelo menos um usuário para teste (ou use a função "Criar conta de teste" no aplicativo)

## Como Executar o Projeto

### Pré-requisitos
- Node.js (versão LTS recomendada)
- Expo CLI (`npm install -g expo-cli`)
- Aplicativo Expo Go instalado no dispositivo móvel

### Passos para Instalação e Execução

1. **Descompacte os arquivos do projeto**

2. **Navegue até o diretório raiz do projeto**

3. **Configure o Firebase conforme instruções acima**

4. **Instale as dependências do projeto:**
   ```bash
   npm install
   ```

5. **Inicie o servidor de desenvolvimento Expo:**
   ```bash
   npx expo start --tunnel
   ```
   O modo túnel é recomendado para garantir conexão com dispositivos físicos.

6. **Conecte seu dispositivo:**
   - Escaneie o QR code exibido no terminal com o aplicativo Expo Go (Android) ou com a câmera (iOS)

## Credenciais de Teste

Para acessar o aplicativo, você pode:

1. **Usar a conta padrão**:
   - Email: admin@escola.com
   - Senha: senha123

2. **Criar uma nova conta**:
   - Use o botão "Criar conta de teste" na tela de login (apenas para demonstração)

## Fluxo de Autenticação

- O aplicativo verifica automaticamente se há um usuário autenticado ao iniciar
- Se não houver usuário autenticado, a tela de login é exibida
- Após o login bem-sucedido, o usuário é redirecionado para o Dashboard
- O logout pode ser feito através do botão flutuante no canto inferior direito do Dashboard

## Solução de Problemas

Se você encontrar erros relacionados a módulos nativos, como:
- "Native module RNFBAppModule not found"
- "main has not been registered"

Isso significa que o ambiente Expo Go não consegue encontrar módulos nativos, o que é esperado, pois este projeto foi desenvolvido para funcionar exclusivamente com JavaScript puro, sem dependências nativas.

Certifique-se de:
1. Usar a versão mais recente do Expo Go
2. Limpar o cache do Expo: `npx expo start --clear`
3. Reinstalar as dependências: `rm -rf node_modules && npm install`

## Suporte

Para dúvidas ou problemas, entre em contato com o desenvolvedor.
