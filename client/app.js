const socket = io("http://localhost:3000");
const chat = document.getElementById("chat");
const msgInput = document.getElementById("msg");
const usernameInput = document.getElementById("username-input");
const setUsernameBtn = document.getElementById("set-username");
const helpSection = document.getElementById("help-section");
const closeHelpBtn = document.getElementById("close-help");
const usernameContainer = document.getElementById("username-container");
const suggestionsBox = document.getElementById("suggestions-box");
const suggestionsList = document.getElementById("suggestions-list");

let username = "";

// Função para esconder a seção de ajuda
closeHelpBtn.addEventListener("click", () => {
  helpSection.style.display = "none";
  msgInput.disabled = false;
});

// Definir nome de usuário
setUsernameBtn.addEventListener("click", () => {
  if (usernameInput.value.trim() !== "") {
    username = usernameInput.value.trim();
    usernameContainer.style.display = "none";
    socket.emit("sendMessage", {
      username,
      message: `${username} entrou no chat!`,
    });
    msgInput.disabled = false;
  } else {
    alert("Por favor, insira um nome de usuário válido!");
  }
});

// Função para mostrar sugestões
function showSuggestions() {
  const message = msgInput.value;
  const mentionIndex = message.lastIndexOf('@');
  
  if (mentionIndex !== -1) {
    const query = message.substring(mentionIndex + 1).toLowerCase();
    const suggestions = ["botFurioso"];  // Pode adicionar mais sugestões aqui.

    const filteredSuggestions = suggestions.filter(s => s.toLowerCase().startsWith(query));
    suggestionsList.innerHTML = '';

    filteredSuggestions.forEach(s => {
      const li = document.createElement("li");
      li.textContent = `@${s}`;
      li.addEventListener("click", () => {
        msgInput.value = message.substring(0, mentionIndex) + "@" + s + " ";  // Preenche o nome do bot na mensagem
        suggestionsBox.style.display = "none"; // Oculta a lista de sugestões
        msgInput.focus();  // Volta o foco para o campo de mensagem
      });
      suggestionsList.appendChild(li);
    });

    suggestionsBox.style.display = filteredSuggestions.length > 0 ? "block" : "none";
  } else {
    suggestionsBox.style.display = "none";
  }
}

// Monitorar o campo de mensagem para mostrar sugestões
msgInput.addEventListener("input", showSuggestions);

// Enviar mensagem
msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && msgInput.value.trim() !== "") {
    if (username.trim() === "") {
      alert("Por favor, insira seu nome de usuário antes de enviar uma mensagem.");
      return;
    }

    socket.emit("sendMessage", {
      username,
      message: msgInput.value.trim(),
    });
    msgInput.value = "";
  }
});

socket.on("receiveMessage", (data) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});
