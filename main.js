document.addEventListener('DOMContentLoaded', () => {

  // --- 게시글 데이터 (시뮬레이션) ---
  let posts = [
    { id: 1, author: '김은행', company: 'IBK기업은행', content: '요즘 부동산 PF 관련해서 다들 분위기 어떤가요?', views: 1200 },
    { id: 2, author: '이대리', company: '우리은행', content: '신규 주담대 심사 기준이 까다로워졌네요.', views: 850 },
    { id: 3, author: '박과장', company: '국민은행', content: 'DSR 계산할 때 주의할 점 공유합니다.', views: 600 },
    { id: 4, author: '최사원', company: '하나은행', content: '오늘 금리 변동 소식 들으셨나요?', views: 450 },
    { id: 5, author: '정팀장', company: '신한은행', content: '전세자금대출 한도 관련 문의가 많네요.', views: 300 },
    { id: 6, author: '한차장', company: '농협은행', content: '대출 상담 시 유용한 팁 공유!', views: 200 }
  ];

  // --- 게시글 목록 렌더링 (최대 5개) ---
  const postList = document.getElementById('post-list');
  function renderPosts() {
    if (!postList) return;
    postList.innerHTML = '';
    posts.slice(0, 5).forEach(post => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="javascript:void(0)">
          <span class="post-author">${post.author}(${post.company})</span>
          <span class="post-title-text">${post.content}</span>
          <span class="post-views-list">${post.views > 999 ? (post.views/1000).toFixed(1) + 'k' : post.views}</span>
        </a>
      `;
      postList.appendChild(li);
    });
  }
  renderPosts();

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

  // --- 네비게이션 게시판 기능 구현 ---
  const navMeeting = document.getElementById('nav-meeting');
  const navQna = document.getElementById('nav-qna');
  const meetingSquare = document.querySelector('.meeting-square');
  const qnaBoard = document.querySelector('.qna-board');
  const newsBoard = document.querySelector('.news-board');

  if (navMeeting) {
    navMeeting.addEventListener('click', () => {
      meetingSquare.scrollIntoView({ behavior: 'smooth' });
      // 강조 효과 등 추가 가능
    });
  }

  if (navQna) {
    navQna.addEventListener('click', () => {
      qnaBoard.scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  // --- 투표 버튼 클릭 시 숫자 카운트 (시뮬레이션) ---
  const voteButtons = document.querySelectorAll('.vote-btn');
  voteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const voteCountSpan = button.querySelector('.vote-count');
      if (voteCountSpan) {
        let currentCount = parseInt(voteCountSpan.textContent.trim().replace(/\(|\)/g, ''));
        const isActive = button.classList.contains('active');
        const buttonGroup = button.closest('.vote-buttons');
        buttonGroup.querySelectorAll('.vote-btn').forEach(btn => {
            if (btn.classList.contains('active')){
                btn.classList.remove('active');
                let countSpan = btn.querySelector('.vote-count');
                let count = parseInt(countSpan.textContent.trim().replace(/\(|\)/g, ''));
                countSpan.textContent = `(${count - 1})`;
            }
        });
        if (!isActive) {
          button.classList.add('active');
          voteCountSpan.textContent = `(${currentCount + 1})`;
        }
      }
    });
  });

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

  // --- 만남의광장 게시글 등록 ---
  const postButton = document.getElementById('post-button');
  if (postButton) {
    postButton.addEventListener('click', () => {
      const nickname = document.getElementById('nickname-input').value;
      const company = document.getElementById('company-input').value;
      const content = document.getElementById('post-content').value;

      if (nickname && content) {
        posts.unshift({
          id: posts.length + 1,
          author: nickname,
          company: company || '익명',
          content: content,
          views: 0
        });
        renderPosts();
        
        // 입력 필드 초기화
        document.getElementById('nickname-input').value = '';
        document.getElementById('company-input').value = '';
        document.getElementById('post-content').value = '';
        
        postFormContainer.style.display = 'none';
        showPostFormBtn.style.display = 'flex';
      } else {
        alert('닉네임과 내용을 입력해 주세요.');
      }
    });
  }

});