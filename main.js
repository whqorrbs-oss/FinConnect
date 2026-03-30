document.addEventListener('DOMContentLoaded', () => {
  // --- View Switching Logic ---
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-menu a, .logo a');

  function showPage(targetId) {
    const id = targetId.startsWith('#') ? targetId.substring(1) : targetId;
    let targetPage = document.getElementById(id);
    
    // 네비게이션 매핑
    if (id === 'study' || id === 'study-intro' || id === 'study-practice') {
      targetPage = document.getElementById('study');
    }

    if (targetPage && targetPage.classList.contains('page')) {
      pages.forEach(p => p.classList.remove('active'));
      targetPage.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        showPage(href);
      }
    });
  });

  // Handle initial hash
  if (window.location.hash) {
    showPage(window.location.hash);
  }

  // --- Chat Logic ---
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const chips = document.querySelectorAll('.chip');
  
  // 대화 기록 저장 (ChatGPT API 연동용)
  let messageHistory = [
    { role: "assistant", content: "안녕하세요! BK Loan Assistant AI 스마트 도우미입니다. 무엇을 도와드릴까요?" }
  ];

  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.textContent = text;
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // 기록 업데이트
    messageHistory.push({ role: sender === 'bot' ? 'assistant' : 'user', content: text });
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot', 'typing-indicator');
    typingDiv.innerHTML = `<div class="bubble typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
  }

  async function askBKAssistant(userText) {
    const typingIndicator = showTypingIndicator();
    
    try {
      // 여기에 본인의 실제 Worker URL을 입력하세요. 예: https://bk-loan-assistant.yourname.workers.dev
      const WORKER_URL = "여기에_본인의_워커_주소를_넣으세요";

      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messageHistory })
      });

      if (!response.ok) throw new Error("API 요청 실패");

      const data = await response.json();
      const aiText = data.content;

      typingIndicator.remove();
      addMessage(aiText, 'bot');

    } catch (error) {
      typingIndicator.remove();
      console.error("Error:", error);
      addMessage("죄송합니다. 서비스 연결에 문제가 발생했습니다. Worker URL과 API 설정을 확인해주세요.", 'bot');
    }
  }

  function handleSend() {
    const text = chatInput.value.trim();
    if (text) {
      addMessage(text, 'user');
      chatInput.value = '';
      askBKAssistant(text);
    }
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.textContent;
      addMessage(text, 'user');
      askBKAssistant(text);
    });
  });

  // --- Calculator Logic ---
  const calcBtn = document.getElementById('calcBtn');
  const amountInput = document.getElementById('amount');
  const rateInput = document.getElementById('rate');
  const periodInput = document.getElementById('period');
  const resultBox = document.getElementById('result');
  const monthlyPaymentEl = document.getElementById('monthlyPayment');
  const totalInterestEl = document.getElementById('totalInterest');

  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const principal = parseFloat(amountInput.value);
      const annualRate = parseFloat(rateInput.value);
      const months = parseInt(periodInput.value);

      if (isNaN(principal) || isNaN(annualRate) || isNaN(months) || principal <= 0 || annualRate <= 0 || months <= 0) {
        alert('모든 필드에 올바른 숫자를 입력해 주세요.');
        return;
      }

      const monthlyRate = annualRate / 100 / 12;
      const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      const totalPayment = monthlyPayment * months;
      const totalInterest = totalPayment - principal;

      monthlyPaymentEl.textContent = Math.round(monthlyPayment).toLocaleString();
      totalInterestEl.textContent = Math.round(totalInterest).toLocaleString();
      resultBox.classList.remove('hidden');
    });
  }
});
