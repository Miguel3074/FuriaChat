import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Para resolver __dirname em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialização do app e servidor HTTP
const app = express();
const server = http.createServer(app);

// Servir arquivos estáticos da pasta client
app.use(express.static(path.join(__dirname, "client")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"));
});

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
                    Visão Geral da FURIA Esports
                    Fundação: Agosto de 2017, por Jaime Pádua, André Akkari e Cris Guedes.
                    Sede: Brasil
                    Estilo de Jogo: Conhecida por sua abordagem agressiva e tática no cenário competitivo.
                    Participações em Torneios: Mais de 129 torneios disputados.
                    Premiação Acumulada: Mais de US$ 2,28 milhões em prêmios.
                    Recorde de Audiência: 1.428.993 espectadores no IEM Rio Major 2022.
                    👥 Elenco Atual (Abril de 2025)
                    Jogador	Nome Completo	Função	Tempo de Equipe	Rating HLTV
                    yuurih	Yuri Santos	Rifler	7 anos 5 meses	1.17
                    KSCERATO	Kaike Cerato	Rifler	7 anos 2 meses	1.19
                    FalleN	Gabriel Toledo	AWP / IGL	1 ano 9 meses	1.01
                    molodoy	—	Rifler	14 dias	—
                    YEKINDAR	Mareks Gaļinskis	Rifler	3 dias	—
                    Treinador	Nicholas "guerri"	Coach	Desde 2018	—
                    Nota: Chelo e skullz estão atualmente no banco de reservas.
                    Conquistas Relevantes
                    Elisa Masters Espoo 2023: Campeões, consolidando-se como uma potência global no CS2.
                    IEM Rio 2024: 3º lugar, com uma premiação de US$ 250.000.
                    IEM Rio Major 2022: Semifinalistas, melhor resultado da equipe em Majors até então. 
                    📊 Desempenho Recente
                    Nos últimos 12 meses, a FURIA disputou 60 partidas, vencendo 38 delas, resultando em uma taxa de vitória de 64%.
                    EGamersWorld
                    Resultados recentes incluem:
                    Vitória sobre Apogee Esports (2:0) em 06/04/2025
                    Derrotas para The Mongolz, Virtus.pro e Complexity Gaming em abril de 2025 
                    🔄 Evolução do Elenco
                    A FURIA tem demonstrado dinamismo em sua composição:
                    YEKINDAR ingressou recentemente, substituindo skullz, que foi para o banco de reservas.
                    molodoy também é uma adição recente, com apenas 14 dias na equipe.`
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

    socket.on("sendMessage", async (data) => {
        try {
            if (!data || typeof data.message !== "string") return;

            io.emit("receiveMessage", data);

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

    socket.on("disconnect", () => {
        console.log("🔴 Usuário desconectado");
    });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
