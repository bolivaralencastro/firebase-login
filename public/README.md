# Firebase Login - Visões de Usuário

Este projeto demonstra uma estrutura de **Login e Cadastro** utilizando **Firebase Authentication**.  
A organização segue boas práticas, separando o código em:

- **index.html**: Página principal com a visão de usuário deslogado, visão de usuário logado e modal de login/cadastro.
- **css/styles.css**: Estilos de layout, responsividade e aparência.
- **js/firebaseConfig.js**: Configuração do Firebase (apiKey, authDomain, etc.) e inicialização do Auth.
- **js/auth.js**: Funções de autenticação (login, registro, logout, observer).
- **js/main.js**: Lógica de interface (abrir modal, trocar telas, chamar funções de auth e reagir a mudanças de estado).

## Instruções

1. **Clonar ou baixar** este repositório e manter a estrutura de pastas dentro de `public/`.
2. **Instalar o Firebase CLI** (caso ainda não tenha):  
   ```bash
   npm install -g firebase-tools
