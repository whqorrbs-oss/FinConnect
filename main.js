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
    // Chat logic remains the same...
  }

  // --- Loan Calculator Logic V2 (API based) ---
  if (document.getElementById('calculator-section')) {
    const calculateBtn = document.getElementById('calculate-btn');
    const loanAmountInput = document.getElementById('loan-amount');
    
    loanAmountInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^\d]/g, '');
        e.target.value = value ? parseInt(value, 10).toLocaleString('ko-KR') : '';
    });

    const showLoading = (isLoading) => {
        calculateBtn.disabled = isLoading;
        calculateBtn.textContent = isLoading ? '계산 중...' : '계산하기';
    };

    const updateUI = (data) => {
        const { summary, schedule } = data;
        const firstMonthPayment = schedule.length > 0 ? schedule[0].payment : 0;

        document.getElementById('monthly-payment').textContent = `${firstMonthPayment.toLocaleString('ko-KR')} 원`;
        document.getElementById('total-interest').textContent = `${summary.totalInterest.toLocaleString('ko-KR')} 원`;
        document.getElementById('total-repayment').textContent = `${summary.totalRepayment.toLocaleString('ko-KR')} 원`;

        const tableBody = document.querySelector('#repayment-schedule tbody');
        tableBody.innerHTML = schedule.map(row => `
            <tr>
                <td>${row.month}</td>
                <td>${row.payment.toLocaleString('ko-KR')}</td>
                <td>${row.principal.toLocaleString('ko-KR')}</td>
                <td>${row.interest.toLocaleString('ko-KR')}</td>
                <td>${row.balance.toLocaleString('ko-KR')}</td>
            </tr>
        `).join('');
        
        document.getElementById('calc-result-area').style.display = 'block';
    };

    calculateBtn.addEventListener('click', async () => {
      const principal = parseInt(loanAmountInput.value.replace(/[^\d]/g, ''), 10) || 0;
      const termYears = parseInt(document.getElementById('loan-term').value, 10);
      const annualRate = parseFloat(document.getElementById('interest-rate').value);
      const repaymentMethodRadio = document.querySelector('input[name="repayment-method"]:checked').value;
      
      // Convert radio value to API-compatible value
      const repaymentMethodMap = {
        'equal-principal-interest': 'AMORTIZATION',
        'equal-principal': 'EQUAL_PRINCIPAL',
        'bullet': 'INTEREST_ONLY'
      };
      const repaymentMethod = repaymentMethodMap[repaymentMethodRadio];

      if (isNaN(principal) || principal <= 0 || isNaN(termYears) || termYears <= 0 || isNaN(annualRate) || annualRate <= 0) {
        alert('모든 필드에 유효한 값을 입력해주세요.');
        return;
      }

      const apiPayload = {
        principal,
        rate: annualRate,
        term: termYears,
        repaymentMethod
      };

      showLoading(true);

      try {
        const response = await fetch('https://dev.fran.kr/api/loan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(apiPayload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'API 요청에 실패했습니다.');
        }

        const data = await response.json();
        updateUI(data);

      } catch (error) {
        console.error('Calculation Error:', error);
        alert(`계산 중 오류가 발생했습니다: ${error.message}`);
      } finally {
        showLoading(false);
      }
    });
  }
});
