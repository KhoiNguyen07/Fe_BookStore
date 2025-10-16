// Scoped Gemini widget script
// Exports initGemini(root) which sets up the widget inside the provided root element
// and returns a cleanup function to remove event listeners and UI state.

const WAIT_MS = 200;
const apiKeyGemini = import.meta.env.VITE_GEMINI_API_KEY;

function waitForGlobal(name, attempts = 20) {
  return new Promise((resolve) => {
    let i = 0;
    const t = setInterval(() => {
      if (window[name]) {
        clearInterval(t);
        resolve(window[name]);
      }
      i++;
      if (i >= attempts) {
        clearInterval(t);
        resolve(null);
      }
    }, WAIT_MS);
  });
}

export async function initGemini(root) {
  if (!root) return () => {};

  // Scoped selectors inside root
  const chatBody = root.querySelector(".chat-body");
  const messageInput = root.querySelector(".message-input");
  const sendMessageButton = root.querySelector("#send-message");
  const fileInput = root.querySelector("#file-input");
  const fileUploadWrapper = root.querySelector(".file-upload-wrapper");
  const fileCancelButton = root.querySelector("#file-cancel");
  const chatbotToggler = root.querySelector("#chatbot-toggler");
  const closeChatbot = root.querySelector("#close-chatbot");

  // If required elements are missing, do nothing
  if (!messageInput || !chatBody || !sendMessageButton) {
    return () => {};
  }

  // API setup (kept from user's script)
  const API_KEY = apiKeyGemini;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const userData = { message: null, file: { data: null, mime_type: null } };
  const chatHistory = [];
  const initialInputHeight = messageInput.scrollHeight;

  // Initial introductory messages shown when the widget loads
  const initialIntro = [
    "Xin chào! Mình là trợ lý ảo của BookStore. Mình có thể giúp bạn tìm sách, kiểm tra đơn hàng hoặc gợi ý quà tặng."
  ];
  // Render the intro messages with a small stagger so it feels natural
  (function renderInitialIntro() {
    let delay = 180;
    initialIntro.forEach((text) => {
      setTimeout(() => {
        const content = `<div class=\"bot-avatar\">🤖</div><div class=\"message-text\">${text}</div>`;
        const msgEl = createMessageElement(content, "bot-message");
        chatBody.appendChild(msgEl);
        chatBody.scrollTo({ behavior: "smooth", top: chatBody.scrollHeight });
        // also record in chat history so subsequent prompts include context if desired
        chatHistory.push({ role: "model", parts: [{ text }] });
      }, delay);
      delay += 260;
    });
  })();

  // Helpers
  const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
  };

  const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");
    chatHistory.push({
      role: "user",
      parts: [
        { text: userData.message },
        ...(userData.file.data ? [{ inline_data: userData.file }] : [])
      ]
    });

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: chatHistory })
    };

    try {
      const response = await fetch(API_URL, requestOptions);
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          (data && data.error && data.error.message) || "API error"
        );

      const apiResponseText =
        (data.candidates &&
          data.candidates[0] &&
          data.candidates[0].content &&
          data.candidates[0].content.parts &&
          data.candidates[0].content.parts[0] &&
          data.candidates[0].content.parts[0].text) ||
        "";
      const cleaned = apiResponseText.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      messageElement.innerText = cleaned;
      chatHistory.push({ role: "model", parts: [{ text: cleaned }] });
    } catch (error) {
      messageElement.innerText = error.message || String(error);
      messageElement.style.color = "#ff0000";
    } finally {
      userData.file = { data: null, mime_type: null };
      incomingMessageDiv.classList.remove("thinking");
      chatBody.scrollTo({ behavior: "smooth", top: chatBody.scrollHeight });
    }
  };

  // Outgoing message handler
  const handleOutgoingMessage = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    userData.message = messageInput.value.trim();
    if (!userData.message && !userData.file.data) return;
    messageInput.value = "";
    if (fileUploadWrapper) fileUploadWrapper.classList.remove("file-uploaded");
    messageInput.dispatchEvent(new Event("input"));

    const messageContent = `<div class="message-text"></div>${
      userData.file.data
        ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />`
        : ""
    }`;
    const outgoingMessageDiv = createMessageElement(
      messageContent,
      "user-message"
    );
    outgoingMessageDiv.querySelector(".message-text").innerText =
      userData.message || "";
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Simulate thinking
    setTimeout(() => {
      const thinkingContent = `<div class="bot-avatar">🤖</div><div class="message-text"><div class="thinking-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>`;
      const incomingMessageDiv = createMessageElement(
        thinkingContent,
        "bot-message",
        "thinking"
      );
      chatBody.appendChild(incomingMessageDiv);
      chatBody.scrollTo({ behavior: "smooth", top: chatBody.scrollHeight });
      generateBotResponse(incomingMessageDiv);
    }, 600);
  };

  // Key handlers and input resizing
  const onKeyDown = (e) => {
    const userMessage = e.target.value.trim();
    if (
      e.key === "Enter" &&
      userMessage &&
      !e.shiftKey &&
      window.innerWidth > 768
    ) {
      handleOutgoingMessage(e);
    }
  };

  const onInput = (e) => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    const form = root.querySelector(".chat-form");
    if (form)
      form.style.borderRadius =
        messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
  };

  // File handling
  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp"
    ];
    if (!validImageTypes.includes(file.type)) {
      if (window.Swal) {
        window.Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)",
          confirmButtonText: "OK"
        });
      }
      resetFileInput();
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      if (window.Swal) {
        window.Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Kích thước file không được vượt quá 2MB",
          confirmButtonText: "OK"
        });
      }
      resetFileInput();
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = fileUploadWrapper.querySelector("img");
      if (img) img.src = ev.target.result;
      fileUploadWrapper.classList.add("file-uploaded");
      const base64String = ev.target.result.split(",")[1];
      userData.file = { data: base64String, mime_type: file.type };
    };
    reader.readAsDataURL(file);
  };

  const resetFileInput = () => {
    if (fileInput) fileInput.value = "";
    if (fileUploadWrapper) {
      fileUploadWrapper.classList.remove("file-uploaded");
      const img = fileUploadWrapper.querySelector("img");
      if (img) img.src = "#";
    }
    userData.file = { data: null, mime_type: null };
    const form = root.querySelector(".chat-form");
    if (form) form.reset();
  };

  // Emoji picker (if available)
  let picker = null;
  (async () => {
    const EmojiMart = await waitForGlobal("EmojiMart");
    const Swal = await waitForGlobal("Swal");
    // Attach global Swal to window if the loader script used different name
    if (!window.Swal && typeof Swal !== "undefined") window.Swal = Swal;

    if (EmojiMart && root.querySelector(".chat-form")) {
      try {
        picker = new window.EmojiMart.Picker({
          theme: "light",
          showSkinTones: "none",
          previewPosition: "none",
          onEmojiSelect: (emoji) => {
            const { selectionStart: start, selectionEnd: end } = messageInput;
            messageInput.setRangeText(emoji.native, start, end, "end");
            messageInput.focus();
          },
          onClickOutside: (ev) => {
            if (ev.target && ev.target.id === "emoji-picker") {
              root.classList.toggle("show-emoji-picker");
            } else {
              root.classList.remove("show-emoji-picker");
            }
          }
        });
        root.querySelector(".chat-form").appendChild(picker);
      } catch (err) {
        // ignore
      }
    }
  })();

  // Wire up listeners
  messageInput.addEventListener("keydown", onKeyDown);
  messageInput.addEventListener("input", onInput);
  if (fileInput) fileInput.addEventListener("change", onFileChange);
  if (fileCancelButton)
    fileCancelButton.addEventListener("click", resetFileInput);
  if (sendMessageButton)
    sendMessageButton.addEventListener("click", handleOutgoingMessage);
  if (chatbotToggler)
    chatbotToggler.addEventListener("click", () =>
      root.classList.toggle("show-chatbot")
    );
  if (closeChatbot)
    closeChatbot.addEventListener("click", () =>
      root.classList.remove("show-chatbot")
    );
  const fileUploadBtn = root.querySelector("#file-upload");
  if (fileUploadBtn && fileInput)
    fileUploadBtn.addEventListener("click", () => fileInput.click());

  // Emoji picker button (use named handler so we can remove it on cleanup)
  const emojiPickerBtn = root.querySelector("#emoji-picker");
  const toggleEmojiPicker = (e) => {
    // Toggle show-emoji-picker class on root element (same as original script.js)
    root.classList.toggle("show-emoji-picker");
    // Focus input when picker is opened for better UX
    if (root.classList.contains("show-emoji-picker") && messageInput) {
      messageInput.focus();
    }
  };
  if (emojiPickerBtn)
    emojiPickerBtn.addEventListener("click", toggleEmojiPicker);

  // Return cleanup
  return () => {
    messageInput.removeEventListener("keydown", onKeyDown);
    messageInput.removeEventListener("input", onInput);
    if (fileInput) fileInput.removeEventListener("change", onFileChange);
    if (fileCancelButton)
      fileCancelButton.removeEventListener("click", resetFileInput);
    if (sendMessageButton)
      sendMessageButton.removeEventListener("click", handleOutgoingMessage);
    if (chatbotToggler)
      chatbotToggler.removeEventListener("click", () =>
        root.classList.toggle("show-chatbot")
      );
    if (closeChatbot)
      closeChatbot.removeEventListener("click", () =>
        root.classList.remove("show-chatbot")
      );
    if (fileUploadBtn)
      fileUploadBtn.removeEventListener("click", () => fileInput.click());
    const emojiPickerBtn = root.querySelector("#emoji-picker");
    if (emojiPickerBtn)
      emojiPickerBtn.removeEventListener("click", toggleEmojiPicker);
    if (picker && picker.remove)
      try {
        picker.remove();
      } catch (e) {}
  };
}

export default initGemini;
