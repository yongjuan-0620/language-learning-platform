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
    lastDate: null,
    dailyCounts: {
        words: 0,
        grammar: 0,
        speaking: 0,
        listening: 0,
        date: null
    }
};

const DAILY_LIMITS = {
    words: 10,
    grammar: 10,
    speaking: 5,
    listening: 5
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
        background: rgba(0,0,0,0.85);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    `;
    guide.innerHTML = `
        <div style="background:white; border-radius:20px; padding:24px; width:100%; max-width:350px; text-align:center;">
            <div style="font-size:60px; margin-bottom:16px;">📲</div>
            <h3 style="color:#333; margin-bottom:12px; font-size:20px;">安装到主屏幕</h3>
            <p style="color:#666; font-size:14px; line-height:1.6; margin-bottom:20px;">
                点击下方按钮，即可将语言学习平台<br>像APP一样安装到您的主屏幕
            </p>
            <button onclick="downloadMobileConfig()" style="width:100%; padding:14px; background:#667eea; color:white; border:none; border-radius:12px; font-size:16px; font-weight:bold; cursor:pointer; margin-bottom:12px;">
                📱 一键安装
            </button>
            <p style="color:#999; font-size:12px;">
                点击后在设置中完成安装
            </p>
            <button onclick="closeiOSGuide()" style="width:100%; padding:10px; background:#f5f5f5; color:#666; border:none; border-radius:12px; font-size:14px; cursor:pointer; margin-top:16px;">
                稍后再安装
            </button>
        </div>
    `;
    document.body.appendChild(guide);
}

function downloadMobileConfig() {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>PayloadType</key>
    <string>Configuration</string>
    <key>PayloadVersion</key>
    <integer>1</integer>
    <key>PayloadIdentifier</key>
    <string>com.language-learning-platform.webclip</string>
    <key>PayloadUUID</key>
    <string>550e8400-e29b-41d4-a716-446655440000</string>
    <key>PayloadDisplayName</key>
    <string>语言学习平台</string>
    <key>PayloadOrganization</key>
    <string>Language Learning Platform</string>
    <key>PayloadDescription</key>
    <string>将语言学习平台添加到主屏幕</string>
    <key>PayloadContent</key>
    <array>
        <dict>
            <key>PayloadType</key>
            <string>com.apple.webClip</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
            <key>PayloadIdentifier</key>
            <string>com.language-learning-platform.webclip.clips.1</string>
            <key>PayloadUUID</key>
            <string>550e8400-e29b-41d4-a716-446655440001</string>
            <key>Label</key>
            <string>语言学习</string>
            <key>URL</key>
            <string>https://yongjuan-0620.github.io/language-learning-platform/</string>
            <key>IsRemovable</key>
            <true/>
            <key>Precomposed</key>
            <true/>
            <key>FullScreen</key>
            <true/>
        </dict>
    </array>
</dict>
</plist>`;
    
    const blob = new Blob([xmlContent], { type: 'application/x-apple-aspen-config' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LanguageLearning.mobileconfig';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setTimeout(() => {
        closeiOSGuide();
        showInstallSuccess();
    }, 1000);
}

function showInstallSuccess() {
    const success = document.createElement('div');
    success.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.85);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    `;
    success.innerHTML = `
        <div style="background:white; border-radius:20px; padding:24px; width:100%; max-width:350px; text-align:center;">
            <div style="font-size:60px; margin-bottom:16px;">✅</div>
            <h3 style="color:#333; margin-bottom:12px; font-size:20px;">配置文件已下载</h3>
            <p style="color:#666; font-size:14px; line-height:1.6; margin-bottom:20px;">
                请前往「设置」→「已下载的描述文件」<br>点击安装即可
            </p>
            <button onclick="this.parentElement.parentElement.remove()" style="width:100%; padding:14px; background:#667eea; color:white; border:none; border-radius:12px; font-size:16px; font-weight:bold; cursor:pointer;">
                知道了
            </button>
        </div>
    `;
    document.body.appendChild(success);
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
        // 兼容旧数据格式
        if (!learningStats.dailyCounts) {
            learningStats.dailyCounts = {
                words: 0,
                grammar: 0,
                speaking: 0,
                listening: 0,
                date: null
            };
        }
    }
    const today = new Date().toDateString();
    if (learningStats.lastDate !== today) {
        learningStats.days++;
        learningStats.lastDate = today;
        saveLearningStats();
    }
    // 每日重置学习计数
    if (learningStats.dailyCounts.date !== today) {
        learningStats.dailyCounts = {
            words: 0,
            grammar: 0,
            speaking: 0,
            listening: 0,
            date: today
        };
        saveLearningStats();
    }
}

function isDailyLimitReached(type) {
    const today = new Date().toDateString();
    if (!learningStats.dailyCounts || learningStats.dailyCounts.date !== today) {
        return false;
    }
    return (learningStats.dailyCounts[type] || 0) >= DAILY_LIMITS[type];
}

function checkDailyLimit(type) {
    if (isDailyLimitReached(type)) {
        showDailyComplete(type);
        return true;
    }
    return false;
}

function showDailyComplete(type) {
    const typeNames = {
        words: '单词',
        grammar: '语法',
        speaking: '口语',
        listening: '听力'
    };
    const containerIds = {
        words: 'vocabContent',
        grammar: 'grammarContent',
        speaking: 'speakingContent',
        listening: 'listeningContent'
    };
    const container = document.getElementById(containerIds[type]);
    if (container) {
        container.innerHTML = `
            <div style="text-align:center;padding:60px 20px;">
                <div style="font-size:4rem;margin-bottom:20px;">🎉</div>
                <h3 style="color:#667eea;margin-bottom:15px;font-size:1.3rem;">今日${typeNames[type]}学习已完成！</h3>
                <p style="color:#666;font-size:1.1rem;">已完成 ${DAILY_LIMITS[type]}/${DAILY_LIMITS[type]} 题</p>
                <p style="color:#999;font-size:0.95rem;margin-top:20px;">明天继续加油 💪</p>
                <button onclick="location.reload()" style="margin-top:25px;padding:12px 30px;background:#667eea;color:white;border:none;border-radius:25px;cursor:pointer;font-size:1rem;">刷新页面</button>
            </div>
        `;
    }
}

function incrementDailyCount(type) {
    const today = new Date().toDateString();
    if (!learningStats.dailyCounts) {
        learningStats.dailyCounts = {
            words: 0,
            grammar: 0,
            speaking: 0,
            listening: 0,
            date: today
        };
    }
    if (learningStats.dailyCounts.date !== today) {
        learningStats.dailyCounts = {
            words: 0,
            grammar: 0,
            speaking: 0,
            listening: 0,
            date: today
        };
    }
    learningStats.dailyCounts[type] = (learningStats.dailyCounts[type] || 0) + 1;
    saveLearningStats();
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
    // 法语和韩语不使用学习场景模式
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
    if (pageId === 'settings') initSettingsPage();
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
    if (isDailyLimitReached('words')) {
        showDailyComplete('words');
        return;
    }
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

    const dailyCount = learningStats.dailyCounts ? (learningStats.dailyCounts.words || 0) : 0;
    const remaining = Math.max(0, DAILY_LIMITS.words - dailyCount);
    document.getElementById('vocabProgress').textContent = `${dailyCount}/${DAILY_LIMITS.words} (今日)`;
    document.getElementById('vocabProgressBar').style.width = `${(dailyCount / DAILY_LIMITS.words) * 100}%`;
}

function showWordMeaning() {
    document.getElementById('wordMeaning').classList.remove('hidden');
}

function markWord(status) {
    if (isDailyLimitReached('words')) {
        showDailyComplete('words');
        return;
    }
    if (status === 'know') {
        learningStats.words++;
        saveLearningStats();
    }
    incrementDailyCount('words');
    currentWordIndex++;
    showWord();
    // 检查是否刚完成
    if (isDailyLimitReached('words')) {
        setTimeout(() => showDailyComplete('words'), 800);
    }
}

function initGrammar() {
    currentGrammarIndex = 0;
    selectedGrammarOption = null;
    if (isDailyLimitReached('grammar')) {
        showDailyComplete('grammar');
        return;
    }
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

    // 更新今日进度显示
    const dailyCount = learningStats.dailyCounts ? (learningStats.dailyCounts.grammar || 0) : 0;
    const grammarProgressEl = document.getElementById('grammarProgress');
    if (grammarProgressEl) {
        grammarProgressEl.textContent = `${dailyCount + 1}/${DAILY_LIMITS.grammar} (今日)`;
    }
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
    if (isDailyLimitReached('grammar')) {
        showDailyComplete('grammar');
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
    incrementDailyCount('grammar');
    // 检查是否刚完成
    if (isDailyLimitReached('grammar')) {
        setTimeout(() => showDailyComplete('grammar'), 800);
    }
}

function nextGrammar() {
    if (checkDailyLimit('grammar')) {
        return;
    }
    currentGrammarIndex++;
    selectedGrammarOption = null;
    showGrammarQuestion();
}

function initSpeaking() {
    if (isDailyLimitReached('speaking')) {
        showDailyComplete('speaking');
        return;
    }
    const dataKey = getSpeakingDataKey();
    const sentences = speakingSentences[dataKey] || speakingSentences.english;
    const randomIndex = Math.floor(Math.random() * sentences.length);
    document.getElementById('speakingSentence').textContent = sentences[randomIndex];
    document.getElementById('speakingSentence').dataset.index = randomIndex;
    document.getElementById('speakingResult').classList.add('hidden');

    document.getElementById('recordBtn').classList.remove('hidden');
    document.getElementById('stopBtn').classList.add('hidden');

    // 更新今日进度显示
    const dailyCount = learningStats.dailyCounts ? (learningStats.dailyCounts.speaking || 0) : 0;
    const speakingProgressEl = document.getElementById('speakingProgress');
    if (speakingProgressEl) {
        speakingProgressEl.textContent = `${dailyCount}/${DAILY_LIMITS.speaking} (今日)`;
    }
}

// ==================== 语音播放（使用 ResponsiveVoice 优先）====================

let currentAudio = null;
let recordedAudioUrl = null;
let responsiveVoiceReady = false;

// 监听 ResponsiveVoice 初始化完成
function onResponsiveVoiceInit() {
    responsiveVoiceReady = true;
    console.log('ResponsiveVoice 已加载');
}

// 初始化 ResponsiveVoice 回调
if (typeof responsiveVoice !== 'undefined') {
    responsiveVoiceInit();
} else {
    window.addEventListener('load', function() {
        if (typeof responsiveVoice !== 'undefined') {
            responsiveVoiceInit();
            responsiveVoiceReady = true;
        }
    });
}

// ==================== ElevenLabs 真人发音 ====================
const ELEVENLABS_VOICES = {
    'english': { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },      // 美式英语女声
    'english_male': { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam' },   // 美式英语男声
    'french': { id: 'zrHiDhphv9ZnVXBqCLpK', name: 'Mathilde' },     // 法语女声
    'korean': { id: 'jsCqWAovK2LkecY7zXl4', name: 'Ha-Joon' }       // 韩语男声
};

function getElevenLabsKey() {
    return localStorage.getItem('elevenlabs_api_key');
}

function saveElevenLabsKey(key) {
    localStorage.setItem('elevenlabs_api_key', key);
}

/**
 * 使用 ElevenLabs 播放真人发音
 * 免费用户每月有 10,000 字符额度
 */
async function speakWithElevenLabs(text, lang, onEnd) {
    const apiKey = getElevenLabsKey();
    if (!apiKey) {
        console.log('ElevenLabs API key 未配置');
        return false;
    }

    const voice = ELEVENLABS_VOICES[lang] || ELEVENLABS_VOICES['english'];
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice.id}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': apiKey
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: 0.3,
                    use_speaker_boost: true
                }
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            console.error('ElevenLabs 错误:', error);
            if (response.status === 401) {
                alert('ElevenLabs API key 无效，请检查设置');
            } else if (response.status === 429) {
                alert('ElevenLabs 免费额度已用完，请升级或等待下个月');
            }
            return false;
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        if (onEnd) {
            audio.onended = onEnd;
        }
        audio.play();
        console.log('使用 ElevenLabs 真人发音播放');
        return true;
    } catch (e) {
        console.error('ElevenLabs 请求失败:', e);
        return false;
    }
}

function playSpeakingExample() {
    const sentence = document.getElementById('speakingSentence').textContent;
    const lang = currentUser ? currentUser.language : 'english';
    speakText(sentence, lang, 0.85);
}

// ==================== 智能断句与语音播放 ====================

/**
 * 将文本按自然断句点拆分成片段
 * 支持逗号、分号、括号等停顿点
 */
function splitIntoChunks(text, lang) {
    if (!text || text.trim().length === 0) return [];
    text = text.trim();

    // 英语：在标点处拆分，保留连接词前的自然停顿
    if (lang === 'english') {
        // 先在连接词前添加断句标记（如果前面有逗号或没有标点）
        // 然后在标点处拆分
        const chunks = [];
        // 使用正则按标点拆分，但保留标点在片段中用于判断
        // 模式：匹配到标点符号时拆分
        const regex = /([^,;:\-\(\)]+[,;:\-\(\)]*)/g;
        let match;
        const parts = [];
        while ((match = regex.exec(text)) !== null) {
            parts.push(match[1].trim());
        }
        // 如果没有匹配到（可能没有标点），直接返回整句
        if (parts.length === 0) {
            return [{ text: text, isEnd: true, pauseAfter: 400 }];
        }
        // 处理每个片段
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLast = (i === parts.length - 1);
            // 判断片段末尾是否有句末标点
            const hasEndPunct = /[.!?]$/.test(part);
            const hasComma = /[,;:\-\(\)]$/.test(part);
            chunks.push({
                text: part,
                isEnd: isLast || hasEndPunct,
                pauseAfter: hasEndPunct ? 500 : (hasComma ? 250 : 150)
            });
        }
        return chunks;
    }

    // 法语、韩语等其他语言：简单按标点拆分
    const chunks = [];
    const regex = /([^,;:\-\(\)\.\!\?]+[,;:\-\(\)\.\!\?]*)/g;
    let match;
    const parts = [];
    while ((match = regex.exec(text)) !== null) {
        parts.push(match[1].trim());
    }
    if (parts.length === 0) {
        return [{ text: text, isEnd: true, pauseAfter: 400 }];
    }
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = (i === parts.length - 1);
        const hasEndPunct = /[.!?]$/.test(part);
        chunks.push({
            text: part,
            isEnd: isLast || hasEndPunct,
            pauseAfter: hasEndPunct ? 500 : 250
        });
    }
    return chunks;
}

/**
 * 根据片段特征计算最佳语速和语调
 */
function getProsody(chunk, lang, baseRate) {
    let rate = baseRate;
    let pitch = 1;
    const text = chunk.text;

    if (lang === 'english') {
        // 英语语调优化
        pitch = 1; // 基准音调

        // 疑问句末尾升高
        if (/\?$/.test(text)) {
            pitch = 1.15;
            rate = baseRate * 0.92; // 疑问句稍慢
        }
        // 感叹句
        else if (/!$/.test(text)) {
            pitch = 1.1;
            rate = baseRate * 0.95;
        }
        // 句末片段稍微放慢（自然收尾）
        else if (chunk.isEnd) {
            rate = baseRate * 0.95;
            pitch = 0.95;
        }
        // 从句/插入语（括号内）稍微快一点
        else if (/\(/.test(text) || /\)$/.test(text)) {
            rate = baseRate * 1.05;
        }
        // 短片段（3个词以内）稍微慢一点，更清晰
        else if (text.split(/\s+/).length <= 3) {
            rate = baseRate * 0.95;
        }
        // 长片段（10个词以上）稍微快一点，更自然
        else if (text.split(/\s+/).length >= 10) {
            rate = baseRate * 1.02;
        }
    } else if (lang === 'french') {
        pitch = 1;
        if (/\?$/.test(text)) {
            pitch = 1.1;
            rate = baseRate * 0.9;
        } else if (chunk.isEnd) {
            rate = baseRate * 0.95;
        }
    } else {
        // 韩语
        pitch = 1;
        if (/\?$/.test(text)) {
            pitch = 1.08;
            rate = baseRate * 0.92;
        }
    }

    return { rate, pitch };
}

async function speakText(text, lang, rate) {
    rate = rate || 0.85;

    // 拆分成长度适中的片段
    const chunks = splitIntoChunks(text, lang);
    if (chunks.length === 0) return;

    // 如果只有1个片段，直接播放
    if (chunks.length === 1) {
        await _speakSingleChunk(chunks[0], lang, rate);
        return;
    }

    // 多片段：按顺序播放，中间添加停顿
    let index = 0;
    async function playNext() {
        if (index >= chunks.length) return;
        const chunk = chunks[index];
        index++;
        await _speakSingleChunk(chunk, lang, rate, function() {
            // 播放完成后，停顿一下再继续
            if (index < chunks.length) {
                setTimeout(playNext, chunk.pauseAfter || 200);
            }
        });
    }
    await playNext();
}

/**
 * 播放单个片段
 * 优先级：ElevenLabs(真人) > ResponsiveVoice > 系统TTS
 */
async function _speakSingleChunk(chunk, lang, baseRate, onEnd) {
    const prosody = getProsody(chunk, lang, baseRate);
    const text = chunk.text;

    // 第一优先：ElevenLabs 真人发音（如果配置了API key）
    if (getElevenLabsKey()) {
        const success = await speakWithElevenLabs(text, lang, onEnd);
        if (success) return;
        // 如果失败，继续降级
    }

    // 第二优先：ResponsiveVoice
    if (typeof responsiveVoice !== 'undefined' && responsiveVoice.voiceSupport()) {
        const voiceMap = {
            'english': 'US English Female',
            'french': 'French Female',
            'korean': 'Korean Female'
        };
        try {
            responsiveVoice.cancel();
            responsiveVoice.speak(text, voiceMap[lang] || 'US English Female', {
                rate: prosody.rate,
                pitch: prosody.pitch,
                volume: 1,
                onend: function() {
                    if (onEnd) onEnd();
                }
            });
            return;
        } catch (e) {
            console.log('ResponsiveVoice 播放失败，降级');
        }
    }

    // 第三优先：系统高质量声音
    fallbackSpeakChunk(text, lang, prosody.rate, prosody.pitch, onEnd);
}

function doSpeak(text, lang, rate) {
    speakText(text, lang, rate || 0.85);
}

function fallbackSpeakChunk(text, lang, rate, pitch, onEnd) {
    if (!('speechSynthesis' in window)) {
        if (onEnd) onEnd();
        return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'english' ? 'en-US' : lang === 'french' ? 'fr-FR' : 'ko-KR';
    utterance.rate = rate || 0.85;
    utterance.pitch = pitch || 1;

    if (onEnd) {
        utterance.onend = onEnd;
    }

    let voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
        speechSynthesis.onvoiceschanged = function() {
            voices = speechSynthesis.getVoices();
            const voice = selectBestVoice(voices, lang);
            if (voice) utterance.voice = voice;
            speechSynthesis.speak(utterance);
        };
        speechSynthesis.getVoices();
        return;
    }

    const voice = selectBestVoice(voices, lang);
    if (voice) utterance.voice = voice;

    speechSynthesis.speak(utterance);
}

// 保留旧的fallbackSpeak用于兼容性（单个utterance场景）
function fallbackSpeak(text, lang, rate) {
    fallbackSpeakChunk(text, lang, rate, 1, null);
}

function selectBestVoice(voices, lang) {
    const targetLang = lang === 'english' ? 'en' : lang === 'french' ? 'fr' : 'ko';
    
    // iOS 上最好的声音（Samantha 是 iOS 标配高质量女声）
    const preferredVoices = [
        'Samantha',      // iOS 高质量女声
        'Karen',         // iOS 澳式英语
        'Daniel',        // iOS 英式男声
        'Google US English',
        'Microsoft Zira Desktop',
        'Microsoft Mark'
    ];
    
    for (const preferred of preferredVoices) {
        const voice = voices.find(v => 
            v.name.includes(preferred) && 
            v.lang && v.lang.startsWith(targetLang)
        );
        if (voice) return voice;
    }
    
    // 回退：选择目标语言的第一个声音
    return voices.find(v => v.lang && v.lang.startsWith(targetLang));
}

// ==================== 录音功能（MediaRecorder API）====================

let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;
let recordedAudioUrl = null;

function isIOSSafari() {
    return /iPhone|iPad|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
}

async function startRecording() {
    const sentence = document.getElementById('speakingSentence').textContent;
    const result = document.getElementById('speakingResult');
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // iOS 使用 audio/mp4，其他使用 webm
        let mimeType = '';
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
            mimeType = 'audio/webm';
        }
        
        const options = mimeType ? { mimeType } : {};
        mediaRecorder = new MediaRecorder(stream, options);
        recordedChunks = [];
        isRecording = true;
        
        mediaRecorder.ondataavailable = function(event) {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = function() {
            const blobType = mimeType || 'audio/webm';
            const blob = new Blob(recordedChunks, { type: blobType });
            recordedAudioUrl = URL.createObjectURL(blob);
            
            showRecordingResult(recordedAudioUrl);
            
            // 停止所有轨道
            stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        
        document.getElementById('recordBtn').classList.add('hidden');
        document.getElementById('stopBtn').classList.remove('hidden');
        document.getElementById('stopBtn').innerHTML = '<i class="fas fa-square"></i> 停止录音';
        
        result.innerHTML = `<span style="font-size:1.5rem">🔴</span> 正在录音...<br><small>请朗读上方句子，读完后点击「停止录音」</small>`;
        result.className = 'feedback success';
        result.classList.remove('hidden');
        
    } catch (err) {
        console.error('录音失败:', err);
        let errorMsg = '无法访问麦克风';
        if (err.name === 'NotAllowedError') {
            errorMsg = '请先允许麦克风权限';
        } else if (err.name === 'NotFoundError') {
            errorMsg = '未检测到麦克风设备';
        }
        result.innerHTML = `<span style="font-size:1.5rem">⚠️</span> ${errorMsg}<br><small>请检查设置，或使用「听示范」练习跟读</small>`;
        result.className = 'feedback error';
        result.classList.remove('hidden');
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
    }
    
    document.getElementById('recordBtn').classList.remove('hidden');
    document.getElementById('stopBtn').classList.add('hidden');
}

function showRecordingResult(audioUrl) {
    const result = document.getElementById('speakingResult');

    result.innerHTML = `
        <div style="margin-bottom:15px">
            <span style="font-size:1.5rem">✅</span> 录音完成！
        </div>
        <div style="background:#f5f5f5;padding:15px;border-radius:10px;margin-bottom:15px">
            <p style="margin-bottom:10px;font-weight:bold">🎵 您的录音：</p>
            <audio controls src="${audioUrl}" style="width:100%"></audio>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
            <button onclick="playSpeakingExample()" style="padding:10px 20px;background:#667eea;color:white;border:none;border-radius:8px;cursor:pointer">
                🔊 再听示范
            </button>
            <button onclick="playMyRecording()" style="padding:10px 20px;background:#28a745;color:white;border:none;border-radius:8px;cursor:pointer">
                🎤 听我的录音
            </button>
        </div>
    `;
    result.className = 'feedback success';
    result.classList.remove('hidden');

    learningStats.speaking++;
    saveLearningStats();
    incrementDailyCount('speaking');
    // 检查是否刚完成
    if (isDailyLimitReached('speaking')) {
        setTimeout(() => showDailyComplete('speaking'), 800);
    }
}

function playMyRecording() {
    if (recordedAudioUrl) {
        const audio = new Audio(recordedAudioUrl);
        audio.play();
    }
}

function calculateSimilarity(str1, str2) {
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    let matches = 0;
    for (const word of words1) {
        if (words2.includes(word)) matches++;
    }
    return matches / Math.max(words1.length, words2.length);
}

function nextSpeaking() {
    if (checkDailyLimit('speaking')) {
        return;
    }
    initSpeaking();
}

function initListening() {
    currentListeningIndex = 0;
    selectedListeningOption = null;
    if (isDailyLimitReached('listening')) {
        showDailyComplete('listening');
        return;
    }
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

    // 更新今日进度显示
    const dailyCount = learningStats.dailyCounts ? (learningStats.dailyCounts.listening || 0) : 0;
    const listeningProgressEl = document.getElementById('listeningProgress');
    if (listeningProgressEl) {
        listeningProgressEl.textContent = `${dailyCount + 1}/${DAILY_LIMITS.listening} (今日)`;
    }
}

function selectListeningOption(index) {
    selectedListeningOption = index;
    document.querySelectorAll('.listening-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector(`.listening-option[data-index="${index}"]`).classList.add('selected');
}

function playListening() {
    const dataKey = getListeningDataKey();
    const questions = listeningQuestions[dataKey] || listeningQuestions.english;
    const question = questions[currentListeningIndex];
    const lang = currentUser ? currentUser.language : 'english';
    
    doSpeak(question.audioText, lang, 0.9);
}

function playListeningSlow() {
    const dataKey = getListeningDataKey();
    const questions = listeningQuestions[dataKey] || listeningQuestions.english;
    const question = questions[currentListeningIndex];
    const lang = currentUser ? currentUser.language : 'english';
    
    doSpeak(question.audioText, lang, 0.5);
}

function checkListeningAnswer() {
    if (selectedListeningOption === null) {
        alert('请选择一个答案');
        return;
    }
    if (isDailyLimitReached('listening')) {
        showDailyComplete('listening');
        return;
    }

    const dataKey = getListeningDataKey();
    const questions = listeningQuestions[dataKey] || listeningQuestions.english;
    const question = questions[currentListeningIndex];
    const feedback = document.getElementById('listeningFeedback');

    if (selectedListeningOption === question.answer) {
        feedback.innerHTML = `<span style="font-size:1.5rem">🎉</span> 回答正确！`;
        feedback.className = 'feedback success';
        learningStats.listening++;
        saveLearningStats();
    } else {
        feedback.innerHTML = `<span style="font-size:1.5rem">💪</span> 回答错误，正确答案是：${question.options[question.answer]}`;
        feedback.className = 'feedback error';
    }
    feedback.classList.remove('hidden');
    incrementDailyCount('listening');
    // 检查是否刚完成
    if (isDailyLimitReached('listening')) {
        setTimeout(() => showDailyComplete('listening'), 800);
    }
}

function nextListening() {
    if (checkDailyLimit('listening')) {
        return;
    }
    currentListeningIndex++;
    selectedListeningOption = null;
    showListeningQuestion();
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

// ==================== 设置页面 ====================

function initSettingsPage() {
    const keyInput = document.getElementById('elevenlabsKeyInput');
    const statusEl = document.getElementById('elevenlabsStatus');
    const savedKey = getElevenLabsKey();

    if (keyInput) {
        keyInput.value = savedKey || '';
    }
    if (statusEl) {
        if (savedKey) {
            statusEl.innerHTML = '<span style="color:#28a745;">✅ 已配置 - 将使用 ElevenLabs 真人发音</span>';
        } else {
            statusEl.innerHTML = '<span style="color:#999;">未配置 - 使用系统默认发音</span>';
        }
    }
}

function saveElevenLabsSettings() {
    const keyInput = document.getElementById('elevenlabsKeyInput');
    const key = keyInput ? keyInput.value.trim() : '';
    if (key) {
        saveElevenLabsKey(key);
        alert('ElevenLabs API Key 已保存！现在将使用真人发音。');
        initSettingsPage();
    } else {
        localStorage.removeItem('elevenlabs_api_key');
        alert('已清除 ElevenLabs 配置，将使用默认发音。');
        initSettingsPage();
    }
}

function exportLearningData() {
    const data = {
        user: currentUser,
        stats: learningStats,
        exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'language-learning-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function clearLearningData() {
    if (confirm('确定要清空所有学习数据吗？此操作不可恢复！')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('learningStats');
        localStorage.removeItem('elevenlabs_api_key');
        alert('所有数据已清空，页面将刷新。');
        location.reload();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if ('speechSynthesis' in window) {
        speechSynthesis.getVoices();
        speechSynthesis.onvoiceschanged = function() {
            speechSynthesis.getVoices();
        };
    }
    init();
});