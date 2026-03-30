document.addEventListener('DOMContentLoaded', () => {
  // --- View Switching Logic ---
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-menu a, .logo a');

  function showPage(targetId) {
    // Remove # if present
    const id = targetId.startsWith('#') ? targetId.substring(1) : targetId;
    
    // Find the actual page section. For sub-sections like #study-intro, we show the parent #study page.
    let targetPage = document.getElementById(id);
    if (id.startsWith('study-')) {
      targetPage = document.getElementById('study');
    }

    if (targetPage && targetPage.classList.contains('page')) {
      pages.forEach(p => p.classList.remove('active'));
      targetPage.classList.add('active');
      
      // If it's a sub-section, scroll to it
      if (id.startsWith('study-')) {
        const subSection = document.getElementById(id);
        if (subSection) {
          window.scrollTo({
            top: subSection.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
      // [참고] 실제 ChatGPT API 연동 시 아래 주석을 해제하고 API Endpoint를 설정하세요.
      /*
      const response = await fetch('/api/chat', { // Cloudflare Workers 등으로 보안 처리된 엔드포인트
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messageHistory })
      });
      const data = await response.json();
      const aiText = data.content;
      */

      // API 연결 전 시뮬레이션 (ChatGPT 느낌의 답변)
      let aiText = "BK Loan Assistant AI가 분석 중입니다...";
      if (userText.includes('금리')) {
        aiText = "현재 대출 금리는 시장 상황에 따라 변동성이 큽니다. 최근 추세는 연 4% 초반대이며, 고객님의 신용도에 따라 달라질 수 있습니다. 더 자세한 분석을 원하시나요?";
      } else if (userText.includes('한도')) {
        aiText = "대출 한도는 DSR 규제와 소득 증빙 서류를 바탕으로 산출됩니다. 대출 계산기를 통해 대략적인 한도를 확인해보시는 건 어떨까요?";
      } else {
        aiText = `입력하신 '${userText}'에 대해 분석한 결과, 대출 업무 관련하여 추가적인 정보가 필요합니다. 구체적인 상황을 말씀해주시면 ChatGPT 엔진이 더 정확히 답변해드릴 수 있습니다.`;
      }

      setTimeout(() => {
        typingIndicator.remove();
        addMessage(aiText, 'bot');
      }, 1000);

    } catch (error) {
      typingIndicator.remove();
      addMessage("죄송합니다. 서비스 연결에 문제가 발생했습니다.", 'bot');
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
