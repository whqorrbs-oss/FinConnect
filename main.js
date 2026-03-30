document.addEventListener('DOMContentLoaded', () => {
  // --- Chat Logic ---
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const chips = document.querySelectorAll('.chip');

  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.textContent = text;
    
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function simulateResponse(userText) {
    let response = "죄송해요, 아직 학습 중인 내용입니다. '금리', '한도', '서류' 등에 대해 물어봐 주시겠어요?";
    
    if (userText.includes('금리')) {
      response = "현재 시중 은행의 평균 금리는 연 3.5% ~ 5.2% 수준입니다. 신용 점수에 따라 차등 적용될 수 있으니 상세 가이드를 확인해 보세요.";
    } else if (userText.includes('한도')) {
      response = "대출 한도는 DSR(총부채원리금상환비율) 규제에 따라 연 소득과 부채 상황에 맞춰 결정됩니다.";
    } else if (userText.includes('서류')) {
      response = "기본적으로 신분증, 재직증명서, 원천징수영수증이 필요합니다. 담보대출의 경우 등기권리증이 추가로 필요할 수 있습니다.";
    } else if (userText.includes('DSR')) {
      response = "DSR은 연간 소득 대비 모든 대출의 원리금 상환액 비율을 말합니다. 현재 대부분 40% 이내로 제한되고 있습니다.";
    }

    setTimeout(() => {
      addMessage(response, 'bot');
    }, 800);
  }

  function handleSend() {
    const text = chatInput.value.trim();
    if (text) {
      addMessage(text, 'user');
      chatInput.value = '';
      simulateResponse(text);
    }
  }

  sendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.textContent;
      addMessage(text, 'user');
      simulateResponse(text);
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

  // --- Navigation Smooth Scroll ---
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });
});
