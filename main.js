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

  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.textContent = text;
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function simulateResponse(userText) {
    let response = "죄송해요, 아직 학습 중인 내용입니다. '공부', '금리', '한도', '입문' 등에 대해 물어봐 주시겠어요?";
    
    if (userText.includes('공부')) {
      response = "대출 공부는 '입문'과 '실무' 과정으로 나뉩니다. 상단 메뉴에서 선택하시거나 궁금한 단계를 말씀해 주세요.";
    } else if (userText.includes('입문')) {
      response = "입문 과정에서는 대출의 기초 용어와 신용 점수 관리법을 배우게 됩니다. 지금 바로 '대출 공부하기 > 입문' 메뉴를 확인해 보세요!";
    } else if (userText.includes('금리')) {
      response = "현재 시장 금리는 변동성이 큽니다. 정확한 금리 정보는 '참고자료' 섹션의 보고서를 참고하시거나 은행 상담을 추천드립니다.";
    } else if (userText.includes('서류')) {
      response = "대출 신청 시 신분증, 소득증빙서류, 재직증명서가 기본입니다. 비대면 대출의 경우 공동인증서로 자동 제출되기도 합니다.";
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

  if (sendBtn) {
    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
  }

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
});
