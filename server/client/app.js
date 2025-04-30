const socket = io(
  location.hostname === "localhost" ? "http://localhost:3000" : window.location.origin
);

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

// Fecha a ajuda
closeHelpBtn.addEventListener("click", () => {
  helpSection.style.display = "none";
  msgInput.disabled = false;
  msgInput.focus();
});

// Define nome de usuário
setUsernameBtn.addEventListener("click", () => {
  if (usernameInput.value.trim() !== "") {
    username = usernameInput.value.trim();
    usernameContainer.style.display = "none";
    socket.emit("sendMessage", {
      username,
      message: `${username} entrou no chat!`,
    });
    msgInput.disabled = false;
    msgInput.focus();
  } else {
    alert("Por favor, insira um nome de usuário válido!");
  }
});

// Sugestões de menção
function showSuggestions() {
  const message = msgInput.value;
  const mentionIndex = message.lastIndexOf('@');

  if (mentionIndex !== -1) {
    const query = message.substring(mentionIndex + 1).toLowerCase();
    const suggestions = ["botFurioso"];
    const filtered = suggestions.filter(s => s.toLowerCase().startsWith(query));

    suggestionsList.innerHTML = '';
    filtered.forEach(s => {
      const li = document.createElement("li");
      li.textContent = `@${s}`;
      li.addEventListener("click", () => {
        msgInput.value = message.substring(0, mentionIndex) + "@" + s + " ";
        suggestionsBox.style.display = "none";
        msgInput.focus();
      });
      suggestionsList.appendChild(li);
    });

    suggestionsBox.style.display = filtered.length > 0 ? "block" : "none";
  } else {
    suggestionsBox.style.display = "none";
  }
}

msgInput.addEventListener("input", showSuggestions);

// Envia mensagem
msgInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && msgInput.value.trim() !== "") {
    if (!username) {
      alert("Por favor, insira seu nome de usuário antes de enviar uma mensagem.");
      return;
    }

    socket.emit("sendMessage", {
      username,
      message: msgInput.value.trim(),
    });
    msgInput.value = "";
    suggestionsBox.style.display = "none";
  }
});

// Recebe e exibe mensagem
socket.on("receiveMessage", (data) => {
  const div = document.createElement("div");
  div.classList.add("message");

  if (data.username === "botFurioso") {
    div.classList.add("bot-message");
  }

  div.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
  
  const shouldScroll = chat.scrollTop + chat.clientHeight === chat.scrollHeight;
  chat.appendChild(div);
  if (shouldScroll) {
    chat.scrollTop = chat.scrollHeight;
  }
});
