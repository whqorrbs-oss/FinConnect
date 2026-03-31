document.addEventListener('DOMContentLoaded', () => {
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

  // --- Chat Logic (if available on page) ---
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  
  if (chatMessages && chatInput && sendBtn) {
    let messageHistory = [
      { role: "assistant", content: "안녕하세요! BK Loan Assistant AI 스마트 도우미입니다. 무엇을 도와드릴까요?" }
    ];

    const addMessage = (text, sender) => {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message', sender);
      const bubble = document.createElement('div');
      bubble.classList.add('bubble');
      bubble.textContent = text;
      messageDiv.appendChild(bubble);
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      messageHistory.push({ role: sender === 'bot' ? 'assistant' : 'user', content: text });
    };

    const showTypingIndicator = () => {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot', 'typing-indicator');
        typingDiv.innerHTML = `<div class="bubble typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    };

    const askBKAssistant = async (userText) => {
        const typingIndicator = showTypingIndicator();
        try {
            const WORKER_URL = "https://silent-hat-8bd1.qorrbszz.workers.dev";
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: messageHistory })
            });
            if (!response.ok) throw new Error('API 요청 실패');
            const data = await response.json();
            if (typingIndicator) typingIndicator.remove();
            addMessage(data.content, 'bot');
        } catch (error) {
            if (typingIndicator) typingIndicator.remove();
            addMessage("죄송합니다. 서비스에 오류가 발생했습니다.", 'bot');
        }
    };

    const handleSend = () => {
      const text = chatInput.value.trim();
      if (text) {
        addMessage(text, 'user');
        chatInput.value = '';
        askBKAssistant(text);
      }
    };

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
  }

  // --- Loan Calculator Logic (if on calculator page) ---
  if (document.getElementById('calculator-section')) {
    const calculateBtn = document.getElementById('calculate-btn');
    const loanAmountInput = document.getElementById('loan-amount');
    
    // Auto-format loan amount input
    loanAmountInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^\d]/g, '');
        e.target.value = value ? parseInt(value, 10).toLocaleString('ko-KR') : '';
    });

    calculateBtn.addEventListener('click', () => {
      // 1. Get and parse inputs
      const principal = parseInt(loanAmountInput.value.replace(/[^\d]/g, ''), 10) || 0;
      const termYears = parseInt(document.getElementById('loan-term').value, 10);
      const annualRate = parseFloat(document.getElementById('interest-rate').value);
      const repaymentMethod = document.querySelector('input[name="repayment-method"]:checked').value;

      if (isNaN(principal) || principal <= 0 || isNaN(termYears) || termYears <= 0 || isNaN(annualRate) || annualRate <= 0) {
        alert('모든 필드에 유효한 값을 입력해주세요.');
        return;
      }

      const termMonths = termYears * 12;
      const monthlyRate = annualRate / 100 / 12;
      
      let schedule = [];
      let totalInterest = 0;
      let balance = principal;

      // 2. Calculate schedule based on method
      if (repaymentMethod === 'equal-principal-interest') { // 원리금균등
        const monthlyPayment = Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1));
        for (let i = 1; i <= termMonths; i++) {
            const interest = Math.round(balance * monthlyRate);
            const principalPayment = monthlyPayment - interest;
            balance -= principalPayment;
            schedule.push({ i, monthlyPayment, principalPayment, interest, balance });
            totalInterest += interest;
        }
      } else if (repaymentMethod === 'equal-principal') { // 원금균등
        const principalPayment = Math.round(principal / termMonths);
        for (let i = 1; i <= termMonths; i++) {
            const interest = Math.round(balance * monthlyRate);
            const monthlyPayment = principalPayment + interest;
            balance -= (i === termMonths) ? balance : principalPayment;
            schedule.push({ i, monthlyPayment, principalPayment, interest, balance });
            totalInterest += interest;
        }
      } else { // 만기일시
        const interest = Math.round(principal * monthlyRate);
        for (let i = 1; i <= termMonths; i++) {
            const monthlyPayment = i === termMonths ? interest + principal : interest;
            const principalPayment = i === termMonths ? principal : 0;
            const currentBalance = i === termMonths ? 0 : principal;
            schedule.push({ i, monthlyPayment, principalPayment, interest, balance: currentBalance });
            totalInterest += interest;
        }
      }
      
      // 3. Update UI
      const firstMonthPayment = schedule.length > 0 ? schedule[0].monthlyPayment : 0;
      const totalRepayment = principal + totalInterest;

      document.getElementById('monthly-payment').textContent = `${firstMonthPayment.toLocaleString('ko-KR')} 원`;
      document.getElementById('total-interest').textContent = `${totalInterest.toLocaleString('ko-KR')} 원`;
      document.getElementById('total-repayment').textContent = `${totalRepayment.toLocaleString('ko-KR')} 원`;

      const tableBody = document.querySelector('#repayment-schedule tbody');
      tableBody.innerHTML = schedule.map(row => `
        <tr>
          <td>${row.i}</td>
          <td>${row.monthlyPayment.toLocaleString('ko-KR')}</td>
          <td>${row.principalPayment.toLocaleString('ko-KR')}</td>
          <td>${row.interest.toLocaleString('ko-KR')}</td>
          <td>${row.balance > 0 ? row.balance.toLocaleString('ko-KR') : 0}</td>
        </tr>
      `).join('');
      
      document.getElementById('calc-result-area').style.display = 'block';
    });
  }
});
