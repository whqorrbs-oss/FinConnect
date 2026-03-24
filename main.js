document.addEventListener('DOMContentLoaded', () => {
  const calcBtn = document.getElementById('calcBtn');
  const amountInput = document.getElementById('amount');
  const rateInput = document.getElementById('rate');
  const periodInput = document.getElementById('period');
  const resultBox = document.getElementById('result');
  const monthlyPaymentEl = document.getElementById('monthlyPayment');
  const totalInterestEl = document.getElementById('totalInterest');

  calcBtn.addEventListener('click', () => {
    const principal = parseFloat(amountInput.value);
    const annualRate = parseFloat(rateInput.value);
    const months = parseInt(periodInput.value);

    if (isNaN(principal) || isNaN(annualRate) || isNaN(months) || principal <= 0 || annualRate <= 0 || months <= 0) {
      alert('모든 필드에 올바른 숫자를 입력해 주세요.');
      return;
    }

    // 월 이자율
    const monthlyRate = annualRate / 100 / 12;

    // 원리금 균등 상환 공식
    // M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;

    // 결과 표시
    monthlyPaymentEl.textContent = Math.round(monthlyPayment).toLocaleString();
    totalInterestEl.textContent = Math.round(totalInterest).toLocaleString();
    
    resultBox.classList.remove('hidden');
    
    // 결과창으로 스크롤
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Header height offset
          behavior: 'smooth'
        });
      }
    });
  });
});
