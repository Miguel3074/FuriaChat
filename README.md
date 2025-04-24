# 🔥 FURIA Chat

Um chat em tempo real para torcedores da FURIA, com suporte a múltiplos usuários e integração com um bot inteligente: o **@botFurioso**!  
Feito com Node.js, Socket.IO e uma interface inspirada na identidade visual da FURIA.

---

## 🚀 Funcionalidades

- Envio e recebimento de mensagens em tempo real
- Identificação visual com nome de usuário colorido
- Detecção e auto-complete ao mencionar `@botFurioso`
- Componente explicativo sobre o funcionamento do bot
- Interface com tema escuro e visual esportivo

---

## 🧠 Como usar o @botFurioso

Para interagir com o bot, mencione-o na sua mensagem.  
Exemplo:

@botFurioso quem joga hoje?

Ele irá responder automaticamente com base em sua inteligência artificial.

---

## 🛠️ Tecnologias utilizadas

- HTML + CSS + JavaScript
- Socket.IO (WebSocket)
- Node.js (backend)
- Express
- OpenAI / IA para respostas do bot (opcional)

---

## ⚙️ Como rodar localmente

1. Clone este repositório:

git clone https://github.com/seu-usuario/furia-chat.git cd furia-chat

2. Instale as dependências do servidor:

cd server npm install

3. Crie um arquivo `.env` dentro da pasta `server/` com a seguinte estrutura:

PORT=3000 OPENAI_API_KEY=sua-chave-aqui

> ⚠️ Esse arquivo está no `.gitignore` e não será enviado ao repositório.

4. Inicie o servidor:

npm start

5. Abra o `index.html` na pasta raiz em um navegador, ou use uma extensão como o **Live Server** no VS Code.

---

## 📦 Estrutura do Projeto

furia-chat/ 

  ├── Client/ # Front-end /
  
    ├── assets/ # Imagens e ícones  
    
    ├── app.js # Script frontend 
    
    ├── styles.css # Estilo principal 
    
    └── index.html # Página principal 
    
  ├── server/ # Backend Node.js │ 
  
      ├── index.js │ 
      
  └── .env 
  
  └── README.md # Este arquivo


---

## 💡 Próximos passos

- [ ] Adicionar autenticação com nome de usuário único
- [ ] Melhorar a IA do bot com base em treinos personalizados
- [ ] Criar suporte a múltiplas salas de chat

---

## 🐾 Feito com orgulho para os torcedores da FURIA
