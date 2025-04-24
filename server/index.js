import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

// Função para gerar resposta do bot
async function generateBotResponse(prompt) {
  const client = new OpenAI({
    baseURL: endpoint,
    apiKey: token,
  });

  const response = await client.chat.completions.create({
    messages: [
      { role: "system", content: "Você é um bot da torcida da FURIA, divertido e estiloso, porém quando te perguntarem algo você pode ser direto." },
      { role: "user", content: prompt.replace("@botFurioso", "").trim() },
    ],
    temperature: 1,
    top_p: 1,
    model: model,
  });

  return response.choices[0].message.content;
}

// Configuração de eventos com o socket.io
io.on("connection", (socket) => {
  console.log("🟢 Usuário conectado");

  socket.on("sendMessage", async (data) => {
    io.emit("receiveMessage", data);

    // Se a mensagem contém o @botFurioso, gera uma resposta do bot
    if (data.message.includes("@botFurioso")) {
      const response = await generateBotResponse(data.message);
      io.emit("receiveMessage", {
        username: "botFurioso",
        message: response,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Usuário desconectado");
  });
});

// Iniciar o servidor na porta 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
