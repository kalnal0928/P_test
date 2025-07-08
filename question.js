// 문제 데이터
const questions = [
    {
        id: 1,
        question: "국어의 음운에 대한 설명으로 적절하지 않은 것은?",
        options: [
            "음운의 종류에는 자음과 모음이 있다.",
            "말의 뜻을 구별해 주는 소리의 단위이다.",
            "모음은 공기가 그대로 흘러나오는 소리이다.",
            "자음은 모음 없이 홀로 소리 낼 수 있는 음운이다.",
            "음운에 따라 소리 낼 때의 느낌이 달라질 수 있다."
        ],
        correctAnswer: 3, // 0부터 시작하는 인덱스 (④번이 정답)
        explanation: "자음은 모음과 결합해야 소리를 낼 수 있습니다."
    }
    // 더 많은 문제들을 여기에 추가할 수 있습니다
];

// 게임 상태 관리
class QuizGame {
    constructor() {
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.isQuizCompleted = false;
        
        this.initializeElements();
        this.initializeGame();
    }

    initializeElements() {
        // DOM 요소들 가져오기
        this.questionText = document.getElementById('questionText');
        this.optionsContainer = document.getElementById('optionsContainer');
        this.currentQuestionSpan = document.getElementById('currentQuestion');
        this.totalQuestionsSpan = document.getElementById('totalQuestions');
        this.timer = document.getElementById('timer');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.submitBtn = document.getElementById('submitBtn');
        this.resultSection = document.getElementById('resultSection');
        this.finalScore = document.getElementById('finalScore');
        this.totalScore = document.getElementById('totalScore');
        this.scoreMessage = document.getElementById('scoreMessage');
        this.restartBtn = document.getElementById('restartBtn');

        // 이벤트 리스너 추가
        this.prevBtn.addEventListener('click', () => this.previousQuestion());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.submitBtn.addEventListener('click', () => this.submitQuiz());
        this.restartBtn.addEventListener('click', () => this.restartQuiz());
    }

    initializeGame() {
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(questions.length).fill(null);
        this.score = 0;
        this.isQuizCompleted = false;
        
        this.totalQuestionsSpan.textContent = questions.length;
        this.totalScore.textContent = questions.length;
        
        this.showQuestion();
        this.startTimer();
        
        // 결과 섹션 숨기기
        this.resultSection.style.display = 'none';
        document.querySelector('.question-section').style.display = 'block';
    }

    showQuestion() {
        const question = questions[this.currentQuestionIndex];
        
        // 질문 번호 업데이트
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
        
        // 질문 텍스트 표시
        this.questionText.textContent = question.question;
        
        // 선택지 생성
        this.renderOptions(question.options);
        
        // 버튼 상태 업데이트
        this.updateButtonStates();
    }

    renderOptions(options) {
        this.optionsContainer.innerHTML = '';
        
        options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                <span class="option-label">${String.fromCharCode(9312 + index)}</span>
                <span class="option-text">${option}</span>
            `;
            
            // 이미 선택된 답이 있다면 표시
            if (this.userAnswers[this.currentQuestionIndex] === index) {
                optionElement.classList.add('selected');
            }
            
            optionElement.addEventListener('click', () => this.selectOption(index));
            this.optionsContainer.appendChild(optionElement);
        });
    }

    selectOption(optionIndex) {
        // 이전 선택 제거
        this.optionsContainer.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // 새로운 선택 표시
        const selectedOption = this.optionsContainer.children[optionIndex];
        selectedOption.classList.add('selected');
        
        // 답안 저장
        this.userAnswers[this.currentQuestionIndex] = optionIndex;
        
        // 버튼 상태 업데이트
        this.updateButtonStates();
    }

    updateButtonStates() {
        // 이전 버튼
        this.prevBtn.disabled = this.currentQuestionIndex === 0;
        
        // 다음/제출 버튼
        const isLastQuestion = this.currentQuestionIndex === questions.length - 1;
        const hasAnswer = this.userAnswers[this.currentQuestionIndex] !== null;
        
        if (isLastQuestion) {
            this.nextBtn.style.display = 'none';
            this.submitBtn.style.display = hasAnswer ? 'inline-block' : 'none';
        } else {
            this.nextBtn.style.display = 'inline-block';
            this.nextBtn.disabled = !hasAnswer;
            this.submitBtn.style.display = 'none';
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.showQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < questions.length - 1) {
            this.currentQuestionIndex++;
            this.showQuestion();
        }
    }

    submitQuiz() {
        this.isQuizCompleted = true;
        this.stopTimer();
        this.calculateScore();
        this.showResults();
    }

    calculateScore() {
        this.score = 0;
        questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correctAnswer) {
                this.score++;
            }
        });
    }

    showResults() {
        // 퀴즈 섹션 숨기기
        document.querySelector('.question-section').style.display = 'none';
        
        // 결과 섹션 표시
        this.resultSection.style.display = 'block';
        
        // 점수 표시
        this.finalScore.textContent = this.score;
        
        // 성취도 메시지
        const percentage = (this.score / questions.length) * 100;
        let message = '';
        
        if (percentage >= 90) {
            message = '🏆 훌륭합니다! 완벽에 가까운 점수네요!';
        } else if (percentage >= 80) {
            message = '🎉 잘했습니다! 우수한 성적이에요!';
        } else if (percentage >= 70) {
            message = '👍 좋습니다! 조금만 더 노력하면 될 것 같아요!';
        } else if (percentage >= 60) {
            message = '📚 괜찮아요! 더 공부해서 다시 도전해보세요!';
        } else {
            message = '💪 아직 부족해요. 더 열심히 공부하고 다시 도전하세요!';
        }
        
        this.scoreMessage.textContent = message;
    }

    restartQuiz() {
        this.stopTimer();
        this.initializeGame();
    }

    startTimer() {
        this.startTime = new Date();
        this.timerInterval = setInterval(() => {
            const now = new Date();
            const elapsed = Math.floor((now - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            
            this.timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
}

// 문제 관리 클래스
class QuestionManager {
    static addQuestion(questionData) {
        questions.push({
            id: questions.length + 1,
            ...questionData
        });
    }

    static removeQuestion(questionId) {
        const index = questions.findIndex(q => q.id === questionId);
        if (index !== -1) {
            questions.splice(index, 1);
        }
    }

    static updateQuestion(questionId, questionData) {
        const index = questions.findIndex(q => q.id === questionId);
        if (index !== -1) {
            questions[index] = { ...questions[index], ...questionData };
        }
    }

    static getQuestions() {
        return questions;
    }

    static getQuestionById(questionId) {
        return questions.find(q => q.id === questionId);
    }
}

// 페이지 로드 시 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    new QuizGame();
});

// 추가 문제들을 쉽게 등록할 수 있는 함수
function addNewQuestion(question, options, correctAnswerIndex, explanation = '') {
    QuestionManager.addQuestion({
        question: question,
        options: options,
        correctAnswer: correctAnswerIndex,
        explanation: explanation
    });
}

// 예시: 새로운 문제 추가 (필요시 사용)
// addNewQuestion(
//     "다음 중 올바른 맞춤법은?",
//     ["안녕하세요", "안녕하세여", "안녕하십니까", "안녕하신가요"],
//     0,
//     "'안녕하세요'가 올바른 맞춤법입니다."
// );