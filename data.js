const courses = [
    { id: 1, title: '英语入门', description: '从零开始学习英语，掌握基础发音和日常对话', language: 'english', level: 'beginner', icon: '🇺🇸', lessons: 20 },
    { id: 2, title: '英语中级', description: '提升英语水平，学习语法和词汇扩展', language: 'english', level: 'intermediate', icon: '🇺🇸', lessons: 30 },
    { id: 3, title: '英语高级', description: '攻克复杂句式与高级词汇，掌握学术写作、深度阅读与地道表达', language: 'english', level: 'advanced', icon: '🎓', lessons: 40 },
    { id: 4, title: '英语精通', description: '母语级表达训练，含演讲辩论、文学赏析与跨文化沟通', language: 'english', level: 'expert', icon: '👑', lessons: 50 },
    { id: 5, title: '日语五十音', description: '学习日语基础发音和假名书写', language: 'japanese', level: 'beginner', icon: '🇯🇵', lessons: 15 },
    { id: 6, title: '日语初级', description: '掌握日语基础语法和日常会话', language: 'japanese', level: 'beginner', icon: '🇯🇵', lessons: 25 },
    { id: 7, title: '日语中级', description: '提升日语能力，学习复杂句型', language: 'japanese', level: 'intermediate', icon: '🇯🇵', lessons: 35 },
    { id: 8, title: '韩语入门', description: '学习韩语基础发音和字母', language: 'korean', level: 'beginner', icon: '🇰🇷', lessons: 15 },
    { id: 9, title: '韩语初级', description: '掌握韩语日常对话和基础语法', language: 'korean', level: 'beginner', icon: '🇰🇷', lessons: 25 },
    { id: 10, title: '韩语中级', description: '提升韩语水平，学习高级表达', language: 'korean', level: 'intermediate', icon: '🇰🇷', lessons: 35 },
    { id: 11, title: '商务英语', description: '职场英语沟通技巧和商务写作', language: 'english', level: 'advanced', icon: '💼', lessons: 25 },
    { id: 12, title: '雅思备考', description: '针对雅思考试的听、说、读、写全方位训练', language: 'english', level: 'expert', icon: '📊', lessons: 45 },
    { id: 13, title: '学术英语写作', description: '论文写作、文献综述与学术演讲能力培养', language: 'english', level: 'expert', icon: '🔬', lessons: 35 },
    { id: 14, title: '日语N2考级', description: '针对JLPT N2考试的专项训练', language: 'japanese', level: 'advanced', icon: '📝', lessons: 40 },
    { id: 15, title: '韩语TOPIK', description: 'TOPIK考试准备课程', language: 'korean', level: 'advanced', icon: '📚', lessons: 30 }
];

const levelNames = {
    beginner: '入门',
    intermediate: '中级',
    advanced: '高级',
    expert: '精通'
};

const languageNames = {
    english: '英语',
    japanese: '日语',
    korean: '韩语'
};

const vocabulary = {
    english_general: [
        { word: 'apple', phonetic: '/ˈæpl/', meaning: '苹果' },
        { word: 'beautiful', phonetic: '/ˈbjuːtɪfl/', meaning: '美丽的' },
        { word: 'computer', phonetic: '/kəmˈpjuːtər/', meaning: '计算机' },
        { word: 'delicious', phonetic: '/dɪˈlɪʃəs/', meaning: '美味的' },
        { word: 'education', phonetic: '/ˌedʒuˈkeɪʃn/', meaning: '教育' },
        { word: 'friend', phonetic: '/frend/', meaning: '朋友' }
    ],
    english_business: [
        { word: 'leverage', phonetic: '/ˈlevərɪdʒ/', meaning: '利用、发挥杠杆作用' },
        { word: 'stakeholder', phonetic: '/ˈsteɪkhəʊldər/', meaning: '利益相关者' },
        { word: 'deliverable', phonetic: '/dɪˈlɪvərəbl/', meaning: '可交付成果' },
        { word: 'benchmark', phonetic: '/ˈbentʃmɑːk/', meaning: '基准、参照标准' },
        { word: 'synergy', phonetic: '/ˈsɪnədʒi/', meaning: '协同效应' },
        { word: 'agenda', phonetic: '/əˈdʒendə/', meaning: '议程' },
        { word: 'proposal', phonetic: '/prəˈpəʊzl/', meaning: '提案' },
        { word: 'deadline', phonetic: '/ˈdedlaɪn/', meaning: '截止日期' },
        { word: 'revenue', phonetic: '/ˈrevənjuː/', meaning: '收入、收益' },
        { word: 'margin', phonetic: '/ˈmɑːdʒɪn/', meaning: '利润空间、余地' },
        { word: 'quarterly', phonetic: '/ˈkwɔːtəli/', meaning: '季度的' },
        { word: 'forecast', phonetic: '/ˈfɔːkɑːst/', meaning: '预测' },
        { word: 'pipeline', phonetic: '/ˈpaɪplaɪn/', meaning: '渠道、储备项目' },
        { word: 'ROI', phonetic: '/ˌɑːr əʊ ˈaɪ/', meaning: '投资回报率' },
        { word: 'KPI', phonetic: '/ˌkeɪ piː ˈaɪ/', meaning: '关键绩效指标' }
    ],
    english_academic: [
        { word: 'serendipity', phonetic: '/ˌserənˈdɪpəti/', meaning: '意外发现美好事物的能力' },
        { word: 'ephemeral', phonetic: '/ɪˈfemərəl/', meaning: '短暂的、转瞬即逝的' },
        { word: 'meticulous', phonetic: '/məˈtɪkjələs/', meaning: '一丝不苟的、严谨的' },
        { word: 'pragmatic', phonetic: '/præɡˈmætɪk/', meaning: '务实的、实用的' },
        { word: 'quintessential', phonetic: '/ˌkwɪntɪˈsenʃl/', meaning: '典型的、最完美的' },
        { word: 'ubiquitous', phonetic: '/juːˈbɪkwɪtəs/', meaning: '无处不在的' },
        { word: 'nostalgia', phonetic: '/nɑːˈstældʒə/', meaning: '怀旧之情' },
        { word: 'paradigm', phonetic: '/ˈpærədaɪm/', meaning: '典范、范式' }
    ],
    english: [
        { word: 'apple', phonetic: '/ˈæpl/', meaning: '苹果' },
        { word: 'beautiful', phonetic: '/ˈbjuːtɪfl/', meaning: '美丽的' },
        { word: 'computer', phonetic: '/kəmˈpjuːtər/', meaning: '计算机' },
        { word: 'delicious', phonetic: '/dɪˈlɪʃəs/', meaning: '美味的' },
        { word: 'education', phonetic: '/ˌedʒuˈkeɪʃn/', meaning: '教育' },
        { word: 'friend', phonetic: '/frend/', meaning: '朋友' },
        { word: 'government', phonetic: '/ˈɡʌvərnmənt/', meaning: '政府' },
        { word: 'happiness', phonetic: '/ˈhæpinəs/', meaning: '幸福' },
        { word: 'serendipity', phonetic: '/ˌserənˈdɪpəti/', meaning: '意外发现美好事物的能力' },
        { word: 'ephemeral', phonetic: '/ɪˈfemərəl/', meaning: '短暂的、转瞬即逝的' },
        { word: 'meticulous', phonetic: '/məˈtɪkjələs/', meaning: '一丝不苟的、严谨的' },
        { word: 'pragmatic', phonetic: '/præɡˈmætɪk/', meaning: '务实的、实用的' },
        { word: 'quintessential', phonetic: '/ˌkwɪntɪˈsenʃl/', meaning: '典型的、最完美的' },
        { word: 'ubiquitous', phonetic: '/juːˈbɪkwɪtəs/', meaning: '无处不在的' },
        { word: 'nostalgia', phonetic: '/nɑːˈstældʒə/', meaning: '怀旧之情' },
        { word: 'paradigm', phonetic: '/ˈpærədaɪm/', meaning: '典范、范式' },
        { word: 'eloquent', phonetic: '/ˈeləkwənt/', meaning: '雄辩的、有说服力的' },
        { word: 'ambivalent', phonetic: '/æmˈbɪvələnt/', meaning: '矛盾的、有矛盾情绪的' }
    ],
    japanese: [
        { word: 'こんにちは', phonetic: 'konnichiwa', meaning: '你好' },
        { word: 'ありがとう', phonetic: 'arigatou', meaning: '谢谢' },
        { word: 'すみません', phonetic: 'sumimasen', meaning: '对不起/打扰一下' },
        { word: '食べる', phonetic: 'taberu', meaning: '吃' },
        { word: '勉強', phonetic: 'benkyou', meaning: '学习' },
        { word: '友達', phonetic: 'tomodachi', meaning: '朋友' },
        { word: '家族', phonetic: 'kazoku', meaning: '家人' },
        { word: '学校', phonetic: 'gakkou', meaning: '学校' }
    ],
    korean: [
        { word: '안녕하세요', phonetic: 'annyeonghaseyo', meaning: '你好' },
        { word: '감사합니다', phonetic: 'gamsahamnida', meaning: '谢谢' },
        { word: '미안합니다', phonetic: 'mianhamnida', meaning: '对不起' },
        { word: '먹다', phonetic: 'meokda', meaning: '吃' },
        { word: '공부', phonetic: 'gongbu', meaning: '学习' },
        { word: '친구', phonetic: 'chingu', meaning: '朋友' },
        { word: '가족', phonetic: 'gajok', meaning: '家人' },
        { word: '학교', phonetic: 'hakgyo', meaning: '学校' }
    ]
};

const grammarQuestions = {
    english: [
        {
            id: 1,
            title: '现在进行时',
            description: '选择正确的动词形式填空：She ___ to music now.',
            options: ['listen', 'listens', 'is listening', 'listened'],
            answer: 2
        },
        {
            id: 2,
            title: '一般过去时',
            description: '选择正确的动词形式填空：I ___ to the park yesterday.',
            options: ['go', 'goes', 'went', 'going'],
            answer: 2
        },
        {
            id: 3,
            title: '情态动词',
            description: '选择正确的情态动词：You ___ finish your homework before dinner.',
            options: ['can', 'must', 'may', 'could'],
            answer: 1
        },
        {
            id: 4,
            title: '比较级',
            description: '选择正确的比较级形式：This book is ___ than that one.',
            options: ['interesting', 'more interesting', 'most interesting', 'interestinger'],
            answer: 1
        },
        {
            id: 5,
            title: '虚拟语气',
            description: '选择正确选项：If I ___ you, I would take the job offer immediately.',
            options: ['am', 'was', 'were', 'be'],
            answer: 2
        },
        {
            id: 6,
            title: '倒装句',
            description: '选择正确形式：Never before ___ such a magnificent view.',
            options: ['I have seen', 'have I seen', 'I had seen', 'had I seen'],
            answer: 1
        },
        {
            id: 7,
            title: '定语从句',
            description: '选择正确的关系代词：The professor ___ lecture was inspiring is from Harvard.',
            options: ['who', 'whose', 'which', 'whom'],
            answer: 1
        },
        {
            id: 8,
            title: '分词作状语',
            description: '选择正确形式：___ in the countryside, he developed a deep appreciation for nature.',
            options: ['Growing up', 'Grown up', 'Being grown', 'To grow up'],
            answer: 0
        },
        {
            id: 9,
            title: '同位语从句',
            description: '选择正确选项：The fact ___ he had already left surprised everyone.',
            options: ['which', 'that', 'what', 'whether'],
            answer: 1
        },
        {
            id: 10,
            title: '强调句',
            description: '选择正确选项：It was not until midnight ___ he finished his work.',
            options: ['when', 'that', 'which', 'what'],
            answer: 1
        }
    ],
    english_business: [
        {
            id: 1,
            title: '商务邮件 - 请求回复',
            description: '选择最地道的表达：I am writing to ___ your quotation for the new model.',
            options: ['ask', 'inquire about', 'request', 'demand'],
            answer: 1,
            tip: '"inquire about" 比 "ask" 更正式，比 "demand" 更礼貌，是商务邮件首选'
        },
        {
            id: 2,
            title: '会议开场',
            description: '选择最专业的会议开场白：Let me ___ by welcoming everyone to today\'s quarterly review.',
            options: ['begin', 'start', 'kick off', 'open up'],
            answer: 2,
            tip: '"kick off" 在商务英语中表示"启动/开始"，比 begin 更生动'
        },
        {
            id: 3,
            title: '表达意见',
            description: '选择最地道的表达：I\'d like to ___ on the proposed timeline.',
            options: ['say', 'talk', 'comment', 'speak'],
            answer: 2,
            tip: '"comment on" 是在会议上对某事发表看法的标准表达'
        },
        {
            id: 4,
            title: '提出异议',
            description: '选择最礼貌的异议表达：I\'m afraid I have to ___ with that point.',
            options: ['disagree', 'object', 'disagree', 'take issue'],
            answer: 3,
            tip: '"take issue with" 比 "disagree" 更有外交手腕，是商务沟通中的高级表达'
        },
        {
            id: 5,
            title: '催促交付',
            description: '选择最礼貌的催促：Could you ___ us an update on the delivery status?',
            options: ['give', 'provide', 'send', 'tell'],
            answer: 1,
            tip: '"provide" 比 "give" 更正式，是商务邮件的常用词'
        },
        {
            id: 6,
            title: '价格谈判',
            description: '选择最专业的表达：We can offer you a ___ of 8% if you place a bulk order.',
            options: ['discount', 'price cut', 'reduction', 'markdown'],
            answer: 0,
            tip: '商务中"折扣"最常用 "discount"，"discount of X%" 是固定搭配'
        },
        {
            id: 7,
            title: '表达观点',
            description: '选择最商务的表达：___ my point of view, we should focus on customer retention.',
            options: ['From', 'In', 'According to', 'As for'],
            answer: 0,
            tip: '"From my point of view" 是商务英语中表达个人观点的正式说法'
        },
        {
            id: 8,
            title: '委婉拒绝',
            description: '选择最礼貌的拒绝：We regret to inform you that we are unable to ___ your request at this time.',
            options: ['accept', 'agree to', 'accommodate', 'do'],
            answer: 2,
            tip: '"accommodate" 是商务英语中"满足/接受请求"的高级用词'
        },
        {
            id: 9,
            title: '结束会议',
            description: '选择最专业的结束语：To ___ up, we have agreed on the following action items.',
            options: ['sum', 'close', 'wrap', 'end'],
            answer: 2,
            tip: '"wrap up" 在商务中表示"总结收尾"，比 end 更地道'
        },
        {
            id: 10,
            title: '跟进邮件',
            description: '选择最专业的跟进：I am ___ to confirm our meeting scheduled for next Tuesday.',
            options: ['writing', 'reaching out', 'contacting', 'emailing'],
            answer: 0,
            tip: '"I am writing to..." 是商务邮件开头的经典句式'
        }
    ],
    japanese: [
        {
            id: 1,
            title: 'は/が 区别',
            description: '选择正确的助词：私___学生です。',
            options: ['は', 'が', 'を', 'に'],
            answer: 0
        },
        {
            id: 2,
            title: '动词ます形',
            description: '选择正确的ます形：食べる → 食べ___',
            options: ['る', 'ます', 'た', 'て'],
            answer: 1
        },
        {
            id: 3,
            title: '否定形',
            description: '选择正确的否定形式：行く → ___',
            options: ['行かない', '行きません', '行った', '行け'],
            answer: 0
        }
    ],
    korean: [
        {
            id: 1,
            title: '主格助词',
            description: '选择正确的助词：저___학생입니다.',
            options: ['은', '는', '이', '가'],
            answer: 2
        },
        {
            id: 2,
            title: '动词现在时',
            description: '选择正确的形式：먹다 → 나는 밥을___',
            options: ['먹다', '먹습니다', '먹었습니다', '먹을'],
            answer: 1
        },
        {
            id: 3,
            title: '形容词变形',
            description: '选择正确的变形：예쁘다 → 이 꽃은___',
            options: ['예쁘다', '예쁩니다', '예뻐요', '예뻤다'],
            answer: 2
        }
    ]
};

const speakingSentences = {
    english: [
        'Hello, how are you today?',
        'I love learning new languages.',
        'What is your favorite food?',
        'The weather is beautiful today.',
        'I want to travel around the world.',
        'Despite the challenges we faced, the team managed to deliver the project ahead of schedule.',
        'The ramifications of artificial intelligence on the job market are far more complex than people realize.',
        'Were it not for your timely intervention, the entire negotiation would have collapsed.',
        'It is imperative that we address these environmental concerns before they escalate further.',
        'The quintessential feature of effective leadership is the ability to inspire others toward a shared vision.'
    ],
    english_business: [
        'Good morning, I am calling to follow up on the proposal we sent last Friday.',
        'Let me kick off the meeting by welcoming everyone to today\'s quarterly review.',
        'I would like to take issue with the proposed timeline, as it seems overly optimistic.',
        'Could you provide us with an update on the delivery status at your earliest convenience?',
        'We are pleased to offer you a discount of ten percent if you place the order this month.',
        'I am writing to confirm our meeting scheduled for next Tuesday at ten o\'clock in the morning.',
        'To wrap up, we have agreed on three key action items that need to be completed by next Friday.',
        'We regret to inform you that we are unable to accommodate your request at this time.',
        'From my point of view, we should focus on customer retention rather than acquisition this quarter.',
        'I appreciate your patience and look forward to doing business with you in the near future.'
    ],
    japanese: [
        'こんにちは、元気ですか？',
        '新しい言語を学ぶのが好きです。',
        '好きな食べ物は何ですか？',
        '今日はいい天気ですね。',
        '世界中を旅行したいです。'
    ],
    korean: [
        '안녕하세요, 오늘 기분이 어떠세요?',
        '새로운 언어를 배우는 것을 좋아합니다.',
        '가장 좋아하는 음식이 무엇인가요?',
        '오늘 날씨가 좋네요.',
        '전 세계를 여행하고 싶습니다.'
    ]
};

const listeningQuestions = {
    english: [
        {
            id: 1,
            audioText: 'I went to the supermarket yesterday to buy some fruits and vegetables.',
            question: 'Where did the speaker go yesterday?',
            options: ['To the park', 'To the supermarket', 'To the library', 'To the restaurant'],
            answer: 1
        },
        {
            id: 2,
            audioText: 'The meeting will start at 3 o\'clock in the afternoon.',
            question: 'When will the meeting start?',
            options: ['In the morning', 'At noon', 'In the afternoon', 'In the evening'],
            answer: 2
        },
        {
            id: 3,
            audioText: 'Had the company invested in renewable energy earlier, it would have reaped substantial long-term benefits.',
            question: 'What does the speaker imply about the company\'s past decisions?',
            options: ['They were visionary', 'They missed an important opportunity', 'They were financially prudent', 'They had no alternative'],
            answer: 1
        },
        {
            id: 4,
            audioText: 'The paradigm shift in modern education emphasizes critical thinking over rote memorization.',
            question: 'What is the main focus of modern education according to the speaker?',
            options: ['Memorization', 'Critical thinking', 'Standardized testing', 'Homework completion'],
            answer: 1
        },
        {
            id: 5,
            audioText: 'The proliferation of ubiquitous computing has fundamentally transformed how we interact with information.',
            question: 'What impact does ubiquitous computing have?',
            options: ['It has made computers cheaper', 'It has transformed information interaction', 'It has reduced internet usage', 'It has limited access to data'],
            answer: 1
        }
    ],
    english_business: [
        {
            id: 1,
            audioText: 'Good morning, this is John Smith from ABC Corporation. I am calling to follow up on the quotation we sent you last week for the new product line.',
            question: 'What is the purpose of the call?',
            options: ['To place an order', 'To follow up on a quotation', 'To schedule a meeting', 'To complain about delivery'],
            answer: 1
        },
        {
            id: 2,
            audioText: 'Let me kick off today\'s meeting by reviewing the key performance indicators from the previous quarter.',
            question: 'What is the speaker doing?',
            options: ['Ending the meeting', 'Starting the meeting', 'Canceling the meeting', 'Postponing the meeting'],
            answer: 1
        },
        {
            id: 3,
            audioText: 'I am writing to inquire about the delivery status of order number 8847. We urgently need the shipment by the end of this month.',
            question: 'What does the speaker need?',
            options: ['A discount', 'A new order', 'An urgent delivery', 'A refund'],
            answer: 2
        },
        {
            id: 4,
            audioText: 'We are pleased to inform you that your application for the position of senior marketing manager has been approved.',
            question: 'What is the speaker announcing?',
            options: ['A job rejection', 'A job approval', 'A salary increase', 'A promotion request'],
            answer: 1
        },
        {
            id: 5,
            audioText: 'To wrap up today\'s discussion, we have agreed on three main action items that need to be completed by the end of next week.',
            question: 'What is happening in this conversation?',
            options: ['Starting a discussion', 'Summarizing key points', 'Rejecting a proposal', 'Asking questions'],
            answer: 1
        },
        {
            id: 6,
            audioText: 'I would like to take issue with the projected sales figures, as they seem to underestimate the impact of our recent marketing campaign.',
            question: 'What is the speaker doing?',
            options: ['Agreeing with figures', 'Disagreeing with figures', 'Presenting new figures', 'Asking for clarification'],
            answer: 1
        },
        {
            id: 7,
            audioText: 'We regret to inform you that we are unable to accommodate your request for a refund, as the items were purchased more than thirty days ago.',
            question: 'What is the speaker communicating?',
            options: ['A refund approval', 'A refund rejection', 'A product recall', 'A discount offer'],
            answer: 1
        },
        {
            id: 8,
            audioText: 'Could you please provide us with an update on the outstanding invoice? It was due two weeks ago.',
            question: 'What does the speaker want?',
            options: ['To place an order', 'To pay an invoice', 'Information about payment status', 'To cancel a contract'],
            answer: 2
        }
    ],
    japanese: [
        {
            id: 1,
            audioText: '昨日スーパーマーケットに行って果物と野菜を買いました。',
            question: '話者は昨日どこに行きましたか？',
            options: ['公園', 'スーパーマーケット', '図書館', 'レストラン'],
            answer: 1
        }
    ],
    korean: [
        {
            id: 1,
            audioText: '어제 슈퍼마켓에 가서 과일과 야채를 샀습니다.',
            question: '화자는 어제 어디에 갔습니까?',
            options: ['공원', '슈퍼마켓', '도서관', '레스토랑'],
            answer: 1
        }
    ]
};

const achievements = [
    { id: 1, name: '初学者', icon: '🌱', condition: { type: 'days', value: 1 }, description: '完成第一天学习' },
    { id: 2, name: '坚持者', icon: '🔥', condition: { type: 'days', value: 7 }, description: '连续学习7天' },
    { id: 3, name: '单词达人', icon: '📖', condition: { type: 'words', value: 50 }, description: '学习50个单词' },
    { id: 4, name: '课程完成', icon: '🏆', condition: { type: 'courses', value: 1 }, description: '完成一门课程' },
    { id: 5, name: '语法高手', icon: '✅', condition: { type: 'grammar', value: 20 }, description: '答对20道语法题' },
    { id: 6, name: '口语练习', icon: '🎤', condition: { type: 'speaking', value: 10 }, description: '完成10次口语练习' },
    { id: 7, name: '听力训练', icon: '👂', condition: { type: 'listening', value: 10 }, description: '完成10次听力训练' },
    { id: 8, name: '学习之星', icon: '⭐', condition: { type: 'days', value: 30 }, description: '连续学习30天' }
];

const sampleUsers = [
    { id: 1, username: '小明', points: 1250, days: 25 },
    { id: 2, username: '小红', points: 980, days: 18 },
    { id: 3, username: '张三', points: 750, days: 12 },
    { id: 4, username: '李四', points: 620, days: 10 },
    { id: 5, username: '王五', points: 450, days: 7 }
];

const samplePosts = [
    { id: 1, author: '小明', content: '今天终于完成了英语入门课程！感觉收获很大，继续加油！', time: '2小时前' },
    { id: 2, author: '小红', content: '有没有一起学习日语的小伙伴？可以互相交流学习心得~', time: '5小时前' },
    { id: 3, author: '张三', content: '分享一个学习单词的小技巧：每天早上起床后复习前一天学的单词，效果很好！', time: '昨天' },
    { id: 4, author: '李四', content: '韩语发音真的很难啊，有没有什么好的练习方法？', time: '昨天' },
    { id: 5, author: '王五', content: '刚刚解锁了"坚持者"徽章，连续学习7天啦！🎉', time: '2天前' }
];