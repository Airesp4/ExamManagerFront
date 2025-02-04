# ExamManager - Frontend  

Este é o frontend do **ExamManager**, um sistema para gerenciamento de provas, desenvolvido em **Angular** e integrado a um backend em **Spring Boot**.  

## 🚀 Tecnologias Utilizadas  

- **Angular 18.2.6**  
- **TypeScript**  
- **Angular Material**  
- **Bootstrap**  
- **HTTP Client** (para comunicação com a API)  
- **JWT Authentication**  


## 🎯 Funcionalidades  

- **Cadastro e Autenticação de Usuários:**  
  - Login seguro com **JWT**.  
  - Registro de novos usuários.  
  - Controle de acesso baseado em permissões.  

- **Gerenciamento de Provas:**  
  - Criação, edição e exclusão de provas.  
  - Associação de questões às provas.  
  - Listagem de provas cadastradas.  

- **Gerenciamento de Questões:**  
  - Cadastro de questões com múltiplas alternativas.  
  - Edição e remoção de questões.  

- **Interface Responsiva:**  
  - Adaptado para diferentes dispositivos (desktop, tablet, mobile).

- **Geração do Arquivo PDF das provas:**  
  - Disponibilização de arquivo PDF das provas cadastradas para download.


## 📦 Instalação  

### 1️⃣ Clone o repositório  

```sh
git clone https://github.com/Airesp4/ExameManagerFront.git
cd ExameManagerFront
```

### 2️⃣ Instale as dependências  

```sh
npm install
```

### 3️⃣ Inicie o servidor Angular  

```sh
ng serve
```

> O aplicativo estará disponível em `http://localhost:4200/`.

## 🔗 Conexão com o Backend  

Para que o sistema funcione corretamente, o backend (Spring Boot) deve estar em execução.  


## 🔐 Autenticação 

O sistema utiliza **JWT (JSON Web Token)** para autenticação. O token é armazenado no **localStorage** e enviado automaticamente em cada requisição protegida.


## 📜 Geração de PDF  

O sistema conta com um serviço em **Python** para geração de PDFs dentro do próprio projeto.  


### Executando o Servidor Python  

Para garantir que o serviço de PDF esteja disponível, execute:  

```sh
cd python
python server.py
```

## 📝 Conclusão  

O **ExamManager** é uma solução completa para gerenciamento de provas, oferecendo uma interface intuitiva e responsiva para professores e administradores. Com autenticação segura via JWT, integração com um backend robusto e suporte à geração de PDFs, a plataforma visa otimizar o processo de criação e aplicação de exames.
