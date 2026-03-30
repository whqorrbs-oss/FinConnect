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
    
    // 1. 즉시 응답 가능한 지식 베이스 (API 연결 없이 작동)
    const localAnswers = {
      "금리": "현재 시장 금리는 연 3.5%~5.0% 수준입니다. 신용도에 따라 차등 적용됩니다.",
      "한도": "대출 한도는 소득과 부채(DSR) 비율에 따라 결정됩니다. 상단 '계산기' 메뉴를 이용해보세요!",
      "서류": "기본적으로 신분증, 재직증명서, 원천징수영수증이 필요합니다.",
      "안녕": "안녕하세요! BK Loan Assistant AI입니다. 무엇을 도와드릴까요?",
      "DSR": "DSR은 연 소득 대비 모든 대출의 원리금 상환액 비율을 말하며, 보통 40% 이내로 관리됩니다."
    };

    // 키워드 매칭 확인
    let reply = "";
    for (let key in localAnswers) {
      if (userText.includes(key)) {
        reply = localAnswers[key];
        break;
      }
    }

    try {
      if (reply) {
        // 로컬 답변이 있으면 0.6초 후에 응답 (자연스럽게)
        setTimeout(() => {
          typingIndicator.remove();
          addMessage(reply, 'bot');
        }, 600);
        return;
      }

      // 2. API 연결 (Worker URL이 설정된 경우에만 작동)
      const WORKER_URL = "여기에_본인의_워커_주소를_넣으세요";
      
      // 주소가 설정되지 않았을 경우 시뮬레이션 응답
      if (WORKER_URL.includes("여기에")) {
        setTimeout(() => {
          typingIndicator.remove();
          addMessage("입력하신 '" + userText + "'에 대해 분석 중입니다. 더 구체적인 질문이 있으신가요?", 'bot');
        }, 1000);
        return;
      }

      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messageHistory })
      });

      const data = await response.json();
      typingIndicator.remove();
      addMessage(data.content, 'bot');

    } catch (error) {
      typingIndicator.remove();
      addMessage("죄송합니다. 현재 AI 엔진 점검 중입니다. 잠시 후 다시 시도해주세요.", 'bot');
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
