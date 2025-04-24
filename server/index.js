import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

// Inicialização do app e servidor HTTP
const app = express();
const server = http.createServer(app);

// Configuração do Socket.IO com CORS liberado para qualquer origem
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

// Variáveis de ambiente
const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

/**
 * Função para gerar resposta do bot Furioso usando OpenAI
 * @param {string} prompt - mensagem enviada pelo usuário
 * @returns {Promise<string>} - resposta do bot
 */
async function generateBotResponse(prompt) {
    try {
        const client = new OpenAI({
            baseURL: endpoint,
            apiKey: token,
        });

        const currentDate = new Date().toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "America/Sao_Paulo",
        });

        const response = await client.chat.completions.create({
            messages: [
                {
                    role: "system", 
                    // Como peguei uma ai free para a api, as informaçoes estavam desatualizadas, atualisei manualmente abaixo algumas.
                    content: `Você é o bot oficial da torcida da FURIA, divertido, estiloso mas reponde as perguntas com precisao. EVITE USAR "**" e "*". Hoje é ${currentDate}.
                  
                  Informações atualizadas:
                  
                  🕹️ Line-up FURIA League of Legends (2025):
                  - Top: Guigo (Guilherme Ruiz)
                  - Jungle: Tatu (Pedro Seixas)
                  - Mid: Tutsz (Arthur Peixoto Machado)
                  - ADC: Ayu (Andrey Saraiva)
                  - Support: JoJo (Gabriel Dzelme de Oliveira)
                  - Coach: Thinkcard (Thomas Slotkin)
                  - Assistente: Furyz (Erick Susin)
                  
                  🔫 Line-up FURIA CS2 (abril de 2025):
                  - Gabriel "FalleN" Toledo – IGL / AWP
                  - Yuri "yuurih" Santos
                  - Kaike "KSCERATO" Cerato
                  - Danil "molodoy" Golubenko
                  - Mareks "YEKINDAR" Gaļinskis (stand-in)
                  - Coach: Sid "sidde" Macedo
                  
                  ⚽ Time FURIA FC – Kings League Brasil:
                  - Presidentes: Neymar Jr. e Cris Guedes
                  - A equipe compete na Kings League Brasil, uma liga de Futebol 7 com regras inovadoras e partidas emocionantes.
                  
                  Sempre que alguém perguntar sobre essas line-ups, responda com essas informações.`
                },

                { role: "user", content: prompt.replace("@botFurioso", "").trim() },
            ],
            temperature: 1,
            top_p: 1,
            model: model,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Erro ao gerar resposta do bot:", error);
        return "Eita, deu ruim aqui 😓. Tenta de novo mais tarde!";
    }
}


// Evento de conexão do socket
io.on("connection", (socket) => {
    console.log("🟢 Usuário conectado");

    // Evento disparado ao receber uma mensagem
    socket.on("sendMessage", async (data) => {
        try {
            // Verificação básica da estrutura da mensagem
            if (!data || typeof data.message !== "string") return;

            // Emite a mensagem original para todos os clientes
            io.emit("receiveMessage", data);

            // Se a mensagem mencionar o bot, ele responde
            if (data.message.includes("@botFurioso")) {
                const response = await generateBotResponse(data.message);

                io.emit("receiveMessage", {
                    username: "botFurioso",
                    message: response,
                });
            }
        } catch (error) {
            console.error("Erro ao processar mensagem:", error);
        }
    });

    // Evento de desconexão
    socket.on("disconnect", () => {
        console.log("🔴 Usuário desconectado");
    });
});

// Inicialização do servidor na porta definida
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
