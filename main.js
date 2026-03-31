document.addEventListener('DOMContentLoaded', () => {

  // --- 만남의광장 글쓰기 폼 토글 ---
  const showPostFormBtn = document.getElementById('show-post-form-btn');
  const postFormContainer = document.getElementById('post-form-container');
  const cancelPostBtn = document.getElementById('cancel-post-btn');

  if (showPostFormBtn) {
    showPostFormBtn.addEventListener('click', () => {
      postFormContainer.style.display = 'grid';
      showPostFormBtn.style.display = 'none';
    });
  }

  if (cancelPostBtn) {
    cancelPostBtn.addEventListener('click', () => {
      postFormContainer.style.display = 'none';
      showPostFormBtn.style.display = 'flex';
    });
  }
  
  // --- 투표 버튼 클릭 시 숫자 카운트 (시뮬레이션) ---
  const voteButtons = document.querySelectorAll('.vote-btn');
  voteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const voteCountSpan = button.querySelector('.vote-count');
      if (voteCountSpan) {
        let currentCount = parseInt(voteCountSpan.textContent.trim().replace(/\(|\)/g, ''));
        
        // 버튼이 이미 활성화 상태인지 확인
        const isActive = button.classList.contains('active');
        
        // 같은 그룹의 모든 버튼에서 active 클래스 제거
        const buttonGroup = button.closest('.vote-buttons');
        buttonGroup.querySelectorAll('.vote-btn').forEach(btn => {
            if (btn.classList.contains('active')){
                btn.classList.remove('active');
                // 활성화된 버튼의 카운트를 1 감소
                let countSpan = btn.querySelector('.vote-count');
                let count = parseInt(countSpan.textContent.trim().replace(/\(|\)/g, ''));
                countSpan.textContent = `(${count - 1})`;
            }
        });

        // 클릭한 버튼이 이전에 활성화 상태가 아니었다면, 활성화하고 카운트 1 증가
        if (!isActive) {
          button.classList.add('active');
          voteCountSpan.textContent = `(${currentCount + 1})`;
        }
      }
    });
  });

  // --- Floating Chatbot Toggle (Existing code) ---
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

  // --- 만남의광장 게시글 등록 (기존 로직 유지 및 수정) ---
  const postButton = document.getElementById('post-button');
  if (postButton) {
    postButton.addEventListener('click', () => {
      // ... (기존 게시글 등록 로직은 여기에 위치합니다) ...
      // 폼 숨기기 및 버튼 표시 로직 추가
      postFormContainer.style.display = 'none';
      showPostFormBtn.style.display = 'flex';
    });
  }

  // ... (Other existing JS code) ...

});