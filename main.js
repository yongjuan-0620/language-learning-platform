let currentUser = null;
let users = [];
let currentCourse = null;
let currentWordIndex = 0;
let currentGrammarIndex = 0;
let currentListeningIndex = 0;
let selectedGrammarOption = null;
let selectedListeningOption = null;
let recognition = null;
let learningMode = 'general'; // general | business | academic
let deferredPrompt = null;
let learningStats = {
    words: 0,
    grammar: 0,
    speaking: 0,
    listening: 0,
    courses: 0,
    days: 0,
    lastDate: null
};

function init() {
    loadUsers();
    loadLearningStats();
    checkLoginStatus();
    renderCourses();
    renderRecommendedCourses();
    renderCommunity();
    registerServiceWorker();
    setupPWAInstall();
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then((registration) => {
                    console.log('Service Worker 注册成功:', registration.scope);
                })
                .catch((error) => {
                    console.log('Service Worker 注册失败:', error);
                });
        });
    }
}

function setupPWAInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallBanner();
    });
    
    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        hideInstallBanner();
        console.log('PWA 安装成功');
    });
    
    if (window.matchMedia('(display-mode: standalone)').matches) {
        hideInstallBanner();
    }
    
    if (isiOS()) {
        setTimeout(() => {
            showiOSInstallGuide();
        }, 2000);
    }
}

function isiOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function showInstallBanner() {
    if (document.getElementById('installBanner')) return;
    
    const banner = document.createElement('div');
    banner.id = 'installBanner';
    banner.className = 'install-banner';
    banner.innerHTML = `
        <div class="install-icon">📱</div>
        <div class="install-text">
            <h4>安装到主屏幕</h4>
            <p>像APP一样使用，离线也能学</p>
        </div>
        <button class="install-btn" onclick="installPWA()">安装</button>
        <button class="close-btn" onclick="hideInstallBanner()">×</button>
    `;
    document.body.appendChild(banner);
}

function showiOSInstallGuide() {
    if (document.getElementById('iOSInstallGuide')) return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (localStorage.getItem('iosInstallDismissed')) return;
    
    const guide = document.createElement('div');
    guide.id = 'iOSInstallGuide';
    guide.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: 40px;
    `;
    guide.innerHTML = `
        <div style="background:white; border-radius:20px; padding:24px; width:90%; max-width:350px; text-align:center;">
            <div style="font-size:60px; margin-bottom:16px;">📲</div>
            <h3 style="color:#333; margin-bottom:12px;">添加到主屏幕</h3>
            <p style="color:#666; font-size:14px; line-height:1.6; margin-bottom:20px;">
                点击下方分享按钮 <span style="display:inline-block; width:24px; height:24px; background:#007aff; color:white; border-radius:6px; line-height:24px; font-size:14px;">⬆</span>
                <br>然后选择「添加到主屏幕」
            </p>
            <button onclick="closeiOSGuide()" style="width:100%; padding:12px; background:#667eea; color:white; border:none; border-radius:10px; font-size:16px; cursor:pointer;">
                知道了
            </button>
        </div>
    `;
    document.body.appendChild(guide);
}

function closeiOSGuide() {
    const guide = document.getElementById('iOSInstallGuide');
    if (guide) guide.remove();
    localStorage.setItem('iosInstallDismissed', 'true');
}

function hideInstallBanner() {
    const banner = document.getElementById('installBanner');
    if (banner) banner.remove();
}

function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('用户接受安装');
            }
            deferredPrompt = null;
            hideInstallBanner();
        });
    }
}

function loadUsers() {
    const stored = localStorage.getItem('users');
    if (stored) {
        users = JSON.parse(stored);
    } else {
        users = [
            { id: 1, username: 'demo', email: 'demo@example.com', password: '123456', language: 'english' }
        ];
        saveUsers();
    }
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function loadLearningStats() {
    const stored = localStorage.getItem('learningStats');
    if (stored) {
        learningStats = JSON.parse(stored);
    }
    const today = new Date().toDateString();
    if (learningStats.lastDate !== today) {
        learningStats.days++;
        learningStats.lastDate = today;
        saveLearningStats();
    }
}

function saveLearningStats() {
    localStorage.setItem('learningStats', JSON.stringify(learningStats));
}

function checkLoginStatus() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showHeader();
        showPage('home');
    }
}

function getLearningDataKey() {
    const lang = currentUser ? currentUser.language : 'english';
    // 日语和韩语不使用学习场景模式
    if (lang !== 'english') return lang;
    return `english_${learningMode}`;
}

function getGrammarDataKey() {
    const lang = currentUser ? currentUser.language : 'english';
    if (lang !== 'english') return lang;
    if (learningMode === 'business') return 'english_business';
    return 'english';
}

function getListeningDataKey() {
    const lang = currentUser ? currentUser.language : 'english';
    if (lang !== 'english') return lang;
    if (learningMode === 'business') return 'english_business';
    return 'english';
}

function getSpeakingDataKey() {
    const lang = currentUser ? currentUser.language : 'english';
    if (lang !== 'english') return lang;
    if (learningMode === 'business') return 'english_business';
    return 'english';
}

function showHeader() {
    document.getElementById('header').classList.remove('hidden');
    document.getElementById('userName').textContent = currentUser.username;
}

function hideHeader() {
    document.getElementById('header').classList.add('hidden');
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'courses') renderCourses();
    if (pageId === 'learning') initLearning();
    if (pageId === 'progress') renderProgress();
    if (pageId === 'community') renderCommunity();
    if (pageId === 'home') renderRecommendedCourses();
}

function switchAuthTab(tab) {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    document.querySelectorAll('.auth-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    
    if (tab === 'login') {
        document.getElementById('loginForm').classList.remove('hidden');
        document.querySelectorAll('.auth-tabs .tab-btn')[0].classList.add('active');
    } else {
        document.getElementById('registerForm').classList.remove('hidden');
        document.querySelectorAll('.auth-tabs .tab-btn')[1].classList.add('active');
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showHeader();
        showPage('home');
        alert('登录成功！');
    } else {
        alert('邮箱或密码错误');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const language = document.getElementById('regLanguage').value;
    
    if (users.find(u => u.email === email)) {
        alert('该邮箱已被注册');
        return;
    }
    
    const newUser = {
        id: users.length + 1,
        username,
        email,
        password,
        language
    };
    
    users.push(newUser);
    saveUsers();
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    showHeader();
    showPage('home');
    alert('注册成功！');
}

function demoLogin() {
    currentUser = users[0];
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showHeader();
    showPage('home');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    hideHeader();
    showPage('auth-page');
}

function renderCourses() {
    const list = document.getElementById('coursesList');
    const langFilter = document.getElementById('languageFilter').value;
    const levelFilter = document.getElementById('levelFilter').value;
    
    let filtered = courses;
    if (langFilter !== 'all') {
        filtered = filtered.filter(c => c.language === langFilter);
    }
    if (levelFilter !== 'all') {
        filtered = filtered.filter(c => c.level === levelFilter);
    }
    
    list.innerHTML = filtered.map(course => `
        <div class="course-card" onclick="showCourseModal(${course.id})">
            <div class="course-image">${course.icon}</div>
            <div class="course-info">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-tags">
                    <span class="course-tag">${languageNames[course.language]}</span>
                    <span class="course-tag">${levelNames[course.level]}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function filterCourses() {
    renderCourses();
}

function showCourseModal(courseId) {
    currentCourse = courses.find(c => c.id === courseId);
    document.getElementById('modalCourseTitle').textContent = currentCourse.title;
    document.getElementById('modalCourseDesc').textContent = currentCourse.description;
    document.getElementById('modalCourseLevel').textContent = `${languageNames[currentCourse.language]} - ${levelNames[currentCourse.level]}`;
    document.getElementById('courseModal').classList.remove('hidden');
}

function closeCourseModal() {
    document.getElementById('courseModal').classList.add('hidden');
}

function enrollCourse() {
    closeCourseModal();
    showPage('learning');
}

function renderRecommendedCourses() {
    const list = document.getElementById('recommendedCourses');
    const userLang = currentUser ? currentUser.language : 'english';
    const recommended = courses.filter(c => c.language === userLang).slice(0, 3);
    
    list.innerHTML = recommended.map(course => `
        <div class="course-card" onclick="showCourseModal(${course.id})">
            <div class="course-image">${course.icon}</div>
            <div class="course-info">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-tags">
                    <span class="course-tag">${languageNames[course.language]}</span>
                    <span class="course-tag">${levelNames[course.level]}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function switchLearningTab(tab) {
    document.querySelectorAll('.learning-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.learning-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tab + 'Tab').classList.add('active');
    const tabs = ['vocabulary', 'grammar', 'speaking', 'listening'];
    document.querySelectorAll('.learning-tabs .tab-btn')[tabs.indexOf(tab)].classList.add('active');
    
    if (tab === 'vocabulary') initVocabulary();
    if (tab === 'grammar') initGrammar();
    if (tab === 'speaking') initSpeaking();
    if (tab === 'listening') initListening();
}

function initLearning() {
    const lang = currentUser ? currentUser.language : 'english';
    const modeSelector = document.getElementById('learningModeSelector');
    if (modeSelector) {
        if (lang !== 'english') {
            modeSelector.style.display = 'none';
        } else {
            modeSelector.style.display = 'flex';
        }
    }
    initVocabulary();
}

function initVocabulary() {
    currentWordIndex = 0;
    showWord();
}

function showWord() {
    const dataKey = getLearningDataKey();
    const words = vocabulary[dataKey] || vocabulary.english;
    if (currentWordIndex >= words.length) {
        currentWordIndex = 0;
    }
    const word = words[currentWordIndex];
    
    const modeLabel = learningMode === 'business' ? '商务英语' : learningMode === 'academic' ? '学术英语' : '英语';
    document.getElementById('wordTag').textContent = modeLabel;
    document.getElementById('wordDisplay').textContent = word.word;
    document.getElementById('wordPhonetic').textContent = word.phonetic;
    document.getElementById('wordMeaning').textContent = word.meaning;
    document.getElementById('wordMeaning').classList.add('hidden');
    
    document.getElementById('vocabProgress').textContent = `${currentWordIndex + 1}/${words.length}`;
    document.getElementById('vocabProgressBar').style.width = `${((currentWordIndex + 1) / words.length) * 100}%`;
}

function showWordMeaning() {
    document.getElementById('wordMeaning').classList.remove('hidden');
}

function markWord(status) {
    if (status === 'know') {
        learningStats.words++;
        saveLearningStats();
    }
    nextWord();
}

function nextWord() {
    currentWordIndex++;
    showWord();
}

function initGrammar() {
    currentGrammarIndex = 0;
    selectedGrammarOption = null;
    showGrammarQuestion();
}

function showGrammarQuestion() {
    const dataKey = getGrammarDataKey();
    const questions = grammarQuestions[dataKey] || grammarQuestions.english;
    if (currentGrammarIndex >= questions.length) {
        currentGrammarIndex = 0;
    }
    const question = questions[currentGrammarIndex];
    
    document.getElementById('grammarTitle').textContent = question.title;
    document.getElementById('grammarDescription').textContent = question.description;
    
    let optionsHtml = '';
    question.options.forEach((opt, index) => {
        optionsHtml += `
            <div class="grammar-option" onclick="selectGrammarOption(${index})" data-index="${index}">
                ${opt}
            </div>
        `;
    });
    document.getElementById('grammarOptions').innerHTML = optionsHtml;
    document.getElementById('grammarFeedback').classList.add('hidden');
}

function selectGrammarOption(index) {
    selectedGrammarOption = index;
    document.querySelectorAll('.grammar-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector(`.grammar-option[data-index="${index}"]`).classList.add('selected');
}

function checkGrammarAnswer() {
    if (selectedGrammarOption === null) {
        alert('请选择一个答案');
        return;
    }
    
    const dataKey = getGrammarDataKey();
    const question = grammarQuestions[dataKey][currentGrammarIndex];
    const feedback = document.getElementById('grammarFeedback');
    
    if (selectedGrammarOption === question.answer) {
        feedback.textContent = '回答正确！🎉';
        feedback.className = 'feedback success';
        learningStats.grammar++;
        saveLearningStats();
    } else {
        const tip = question.tip ? `<br><small>${question.tip}</small>` : '';
        feedback.innerHTML = `回答错误，正确答案是：${question.options[question.answer]}${tip}`;
        feedback.className = 'feedback error';
    }
    feedback.classList.remove('hidden');
}

function nextGrammar() {
    currentGrammarIndex++;
    selectedGrammarOption = null;
    showGrammarQuestion();
}

function initSpeaking() {
    const dataKey = getSpeakingDataKey();
    const sentences = speakingSentences[dataKey] || speakingSentences.english;
    const randomIndex = Math.floor(Math.random() * sentences.length);
    document.getElementById('speakingSentence').textContent = sentences[randomIndex];
    document.getElementById('speakingResult').classList.add('hidden');
    
    const lang = currentUser ? currentUser.language : 'english';
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = lang === 'english' ? 'en-US' : lang === 'japanese' ? 'ja-JP' : 'ko-KR';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            const result = document.getElementById('speakingResult');
            result.textContent = `您说的是：${transcript}`;
            result.className = 'feedback success';
            result.classList.remove('hidden');
            learningStats.speaking++;
            saveLearningStats();
            
            document.getElementById('recordBtn').classList.remove('hidden');
            document.getElementById('stopBtn').classList.add('hidden');
        };
        
        recognition.onerror = function(event) {
            const result = document.getElementById('speakingResult');
            result.textContent = '语音识别失败，请重试';
            result.className = 'feedback error';
            result.classList.remove('hidden');
            
            document.getElementById('recordBtn').classList.remove('hidden');
            document.getElementById('stopBtn').classList.add('hidden');
        };
    }
}

function startRecording() {
    if (recognition) {
        document.getElementById('recordBtn').classList.add('hidden');
        document.getElementById('stopBtn').classList.remove('hidden');
        recognition.start();
    } else {
        alert('您的浏览器不支持语音识别功能');
    }
}

function stopRecording() {
    if (recognition) {
        recognition.stop();
    }
}

function initListening() {
    currentListeningIndex = 0;
    selectedListeningOption = null;
    showListeningQuestion();
}

function showListeningQuestion() {
    const dataKey = getListeningDataKey();
    const questions = listeningQuestions[dataKey] || listeningQuestions.english;
    if (currentListeningIndex >= questions.length) {
        currentListeningIndex = 0;
    }
    const question = questions[currentListeningIndex];
    
    let optionsHtml = '';
    question.options.forEach((opt, index) => {
        optionsHtml += `
            <div class="listening-option" onclick="selectListeningOption(${index})" data-index="${index}">
                ${opt}
            </div>
        `;
    });
    document.getElementById('listeningOptions').innerHTML = optionsHtml;
    document.getElementById('listeningFeedback').classList.add('hidden');
}

function selectListeningOption(index) {
    selectedListeningOption = index;
    document.querySelectorAll('.listening-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector(`.listening-option[data-index="${index}"]`).classList.add('selected');
}

function playListening() {
    const dataKey = getListeningDataKey();
    const question = listeningQuestions[dataKey][currentListeningIndex];
    const lang = currentUser ? currentUser.language : 'english';
    
    const utterance = new SpeechSynthesisUtterance(question.audioText);
    utterance.lang = lang === 'english' ? 'en-US' : lang === 'japanese' ? 'ja-JP' : 'ko-KR';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
}

function checkListeningAnswer() {
    if (selectedListeningOption === null) {
        alert('请选择一个答案');
        return;
    }
    
    const dataKey = getListeningDataKey();
    const question = listeningQuestions[dataKey][currentListeningIndex];
    const feedback = document.getElementById('listeningFeedback');
    
    if (selectedListeningOption === question.answer) {
        feedback.textContent = '回答正确！🎉';
        feedback.className = 'feedback success';
        learningStats.listening++;
        saveLearningStats();
    } else {
        feedback.textContent = `回答错误，正确答案是：${question.options[question.answer]}`;
        feedback.className = 'feedback error';
    }
    feedback.classList.remove('hidden');
}

function renderProgress() {
    const totalProgress = Math.min(Math.round((learningStats.words / 50 + learningStats.grammar / 20 + learningStats.speaking / 10 + learningStats.listening / 10) / 4 * 100), 100);
    
    document.getElementById('totalProgress').textContent = totalProgress + '%';
    document.querySelector('.circular-progress').style.background = `conic-gradient(#667eea ${totalProgress}%, #eee ${totalProgress}%)`;
    
    document.getElementById('learningDays').textContent = learningStats.days;
    document.getElementById('learnedWords').textContent = learningStats.words;
    document.getElementById('completedCourses').textContent = learningStats.courses;
    
    renderAchievements();
    renderProgressChart();
}

function renderAchievements() {
    const list = document.getElementById('achievementsList');
    
    list.innerHTML = achievements.map(achievement => {
        let unlocked = false;
        if (achievement.condition.type === 'days' && learningStats.days >= achievement.condition.value) unlocked = true;
        if (achievement.condition.type === 'words' && learningStats.words >= achievement.condition.value) unlocked = true;
        if (achievement.condition.type === 'courses' && learningStats.courses >= achievement.condition.value) unlocked = true;
        if (achievement.condition.type === 'grammar' && learningStats.grammar >= achievement.condition.value) unlocked = true;
        if (achievement.condition.type === 'speaking' && learningStats.speaking >= achievement.condition.value) unlocked = true;
        if (achievement.condition.type === 'listening' && learningStats.listening >= achievement.condition.value) unlocked = true;
        
        return `
            <div class="achievement-item ${unlocked ? 'unlocked' : 'locked'}">
                <i class="fas ${unlocked ? 'fa-award' : 'fa-lock'}"></i>
                <p>${achievement.name}</p>
            </div>
        `;
    }).join('');
}

function renderProgressChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;
    
    const data = {
        labels: ['单词', '语法', '口语', '听力'],
        datasets: [{
            label: '学习进度',
            data: [learningStats.words, learningStats.grammar, learningStats.speaking, learningStats.listening],
            backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
            borderRadius: 10
        }]
    };
    
    if (window.myChart) {
        window.myChart.destroy();
    }
    
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function renderCommunity() {
    const postsList = document.getElementById('postsList');
    const leaderboard = document.getElementById('leaderboard');
    
    postsList.innerHTML = samplePosts.map(post => `
        <div class="post-card">
            <div class="post-header">
                <i class="fas fa-user-circle"></i>
                <div>
                    <span class="post-author">${post.author}</span>
                    <span class="post-time">${post.time}</span>
                </div>
            </div>
            <p class="post-content">${post.content}</p>
        </div>
    `).join('');
    
    leaderboard.innerHTML = sampleUsers.map((user, index) => `
        <div class="leaderboard-item">
            <span class="leaderboard-rank ${index < 3 ? 'top' : ''}">${index + 1}</span>
            <span class="leaderboard-user">${user.username}</span>
            <span class="leaderboard-points">${user.points}分</span>
        </div>
    `).join('');
}

function showPostModal() {
    document.getElementById('postModal').classList.remove('hidden');
}

function closePostModal() {
    document.getElementById('postModal').classList.add('hidden');
    document.getElementById('postContent').value = '';
}

function submitPost() {
    const content = document.getElementById('postContent').value;
    if (!content.trim()) {
        alert('请输入内容');
        return;
    }
    
    const newPost = {
        id: samplePosts.length + 1,
        author: currentUser.username,
        content: content,
        time: '刚刚'
    };
    
    samplePosts.unshift(newPost);
    closePostModal();
    renderCommunity();
    alert('发布成功！');
}

function startLearning() {
    showPage('learning');
}

function switchLearningMode(mode) {
    learningMode = mode;
    
    // 更新按钮状态
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.mode-btn').forEach(btn => {
        if (btn.textContent.includes(mode === 'general' ? '通用' : mode === 'business' ? '商务' : '学术')) {
            btn.classList.add('active');
        }
    });
    
    // 隐藏非英语用户的学习模式选择器
    const lang = currentUser ? currentUser.language : 'english';
    const modeSelector = document.getElementById('learningModeSelector');
    if (modeSelector) {
        if (lang !== 'english') {
            modeSelector.style.display = 'none';
        } else {
            modeSelector.style.display = 'flex';
        }
    }
    
    // 重置并重新初始化当前学习模块
    const activeTab = document.querySelector('.learning-tab.active');
    if (activeTab) {
        if (activeTab.id === 'vocabularyTab') initVocabulary();
        else if (activeTab.id === 'grammarTab') initGrammar();
        else if (activeTab.id === 'speakingTab') initSpeaking();
        else if (activeTab.id === 'listeningTab') initListening();
    }
}

document.addEventListener('DOMContentLoaded', init);