document.addEventListener('DOMContentLoaded', () => {
  // --- View Switching / Navigation Logic ---
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-menu a, .logo a, .hero-btns a, .page-nav-btns a');

  function showPage(targetId) {
    const id = targetId.startsWith('#') ? targetId.substring(1) : targetId;
    const targetPage = document.getElementById(id);
    
    if (targetPage && targetPage.classList.contains('page')) {
      pages.forEach(p => p.classList.remove('active'));
      targetPage.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // If it's a hash on the current page
      if (href.startsWith('#')) {
        e.preventDefault();
        showPage(href);
        history.pushState(null, null, href);
      } else if (href.includes('#')) {
        // If it's a hash on a different page (e.g. index.html#calculator)
        const [path, hash] = href.split('#');
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        if (path === currentPath || (path === 'index.html' && currentPath === '')) {
          e.preventDefault();
          showPage('#' + hash);
          history.pushState(null, null, '#' + hash);
        }
      }
    });
  });

  // Handle initial hash on page load
  if (window.location.hash) {
    showPage(window.location.hash);
  }

  // --- Floating Chatbot Toggle ---
  const chatbotContainer = document.getElementById('chatbot-container');
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotClose = document.getElementById('chatbot-close');

  if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
      chatbotContainer.classList.toggle('closed');
    });
  }

  if (chatbotClose) {
    chatbotClose.addEventListener('click', () => {
      chatbotContainer.classList.add('closed');
    });
  }

  // --- Chat Logic ---
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  
  let messageHistory = [
    { role: "assistant", content: "안녕하세요! BK Loan Assistant AI 스마트 도우미입니다. 무엇을 도와드릴까요?" }
  ];

  function addMessage(text, sender) {
    if (!chatMessages) return;
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.textContent = text;
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    messageHistory.push({ role: sender === 'bot' ? 'assistant' : 'user', content: text });
  }

  function showTypingIndicator() {
    if (!chatMessages) return null;
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
      const WORKER_URL = "https://silent-hat-8bd1.qorrbszz.workers.dev";

      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messageHistory })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.content || "API 요청 실패");
      }

      const data = await response.json();
      const aiText = data.content;

      if (typingIndicator) typingIndicator.remove();
      addMessage(aiText, 'bot');

    } catch (error) {
      if (typingIndicator) typingIndicator.remove();
      console.error("Error:", error);
      addMessage("죄송합니다. 서비스에 일시적인 오류가 발생했습니다: " + error.message, 'bot');
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

  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
  }

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
