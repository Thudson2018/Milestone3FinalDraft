document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            const isExpanded = navMenu.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
        
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
});
//quiz
const quizAnswers = {
    q1: {
        correct: 'Chrome',
        points: 25,
        question: 'What is the most popular browser as of 2025?',
        type: 'multiple-choice',
        options: {
            'Chrome': 'Chrome',
            'Safari': 'Safari',
            'FireFox': 'Firefox',
            'Edge': 'Edge'
        }
    },
    q2: {
        correct: 'World Wide Web',
        points: 25,
        question: 'What does WWW stand for?',
        type: 'multiple-choice',
        options: {
            'World Wide Work': 'World Wide Work',
            'World Wide Web': 'World Wide Web',
            'Willing without work': 'Willing without work',
            'Web Without World': 'Web Without World'
        }
    },
    q3: {
        correct: 'User Interface',
        points: 25,
        question: 'What is UI?',
        type: 'multiple-choice',
        options: {
            'User\'s Information': 'User\'s Information',
            'Unbearable Intern': 'Unbearable Intern',
            'User Interface': 'User Interface',
            'User Influence': 'User Influence'
        }
    },
    q4: {
        correct: ['HTTP', 'HTML', 'CSS', 'JavaScript'],
        points: 25,
        question: 'What languages do browsers need to read? (Select all that apply)',
        type: 'multi-select',
        options: {
            'HTTP': 'HTTP',
            'HTML': 'HTML',
            'CSS': 'CSS',
            'JavaScript': 'JavaScript'
        }
    }
};
const passingScore = 60;
document.addEventListener('DOMContentLoaded', function() {
    const quizForm = document.getElementById('quizForm');
    
    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            gradeQuiz();
        });
        const resetButtons = document.querySelectorAll('.btn-reset');
        resetButtons.forEach(button => {
            button.addEventListener('click', resetQuiz);
        });
    }
});

function gradeQuiz() {
    let totalScore = 0;
    let maxScore = 0;
    const results = [];

    for (const [questionId, answerData] of Object.entries(quizAnswers)) {
        maxScore += answerData.points;
        const result = gradeQuestion(questionId, answerData);
        results.push(result);
        totalScore += result.score;
    }

    const percentage = Math.round((totalScore / maxScore) * 100);
    const passed = percentage >= passingScore;
    displayResults(passed, totalScore, maxScore, percentage, results);
    document.getElementById('resultsContainer').scrollIntoView({ behavior: 'smooth' });
}

function gradeQuestion(questionId, answerData) {
    const result = {
        question: answerData.question,
        type: answerData.type,
        maxPoints: answerData.points,
        score: 0,
        correct: false,
        userAnswer: null,
        correctAnswer: null
    };

    if (answerData.type === 'fill-blank') {
        // Grade fill-in-the-blank question
        const userAnswer = document.getElementById(questionId).value.trim();
        result.userAnswer = userAnswer;
        result.correctAnswer = Array.isArray(answerData.correct) ? answerData.correct[0] : answerData.correct;
        
        // Check if answer matches any acceptable answer (case-insensitive)
        const correctAnswers = Array.isArray(answerData.correct) ? answerData.correct : [answerData.correct];
        if (correctAnswers.some(ans => ans.toLowerCase() === userAnswer.toLowerCase())) {
            result.correct = true;
            result.score = answerData.points;
        }
    } else if (answerData.type === 'multiple-choice') {
        // Grade multiple choice question
        const selectedOption = document.querySelector(`input[name="${questionId}"]:checked`);
        result.userAnswer = selectedOption ? answerData.options[selectedOption.value] : 'No answer selected';
        result.correctAnswer = answerData.options[answerData.correct];
        
        if (selectedOption && selectedOption.value === answerData.correct) {
            result.correct = true;
            result.score = answerData.points;
        }
    } else if (answerData.type === 'multi-select') {
        // Grade multi-select question
        const selectedOptions = Array.from(document.querySelectorAll(`input[name="${questionId}"]:checked`))
            .map(input => input.value);
        
        result.userAnswer = selectedOptions.length > 0 
            ? selectedOptions.map(val => answerData.options[val]).join(', ')
            : 'No answers selected';
        result.correctAnswer = answerData.correct.map(val => answerData.options[val]).join(', ');
        
        const correctSet = new Set(answerData.correct);
        const selectedSet = new Set(selectedOptions);
        
        if (correctSet.size === selectedSet.size && 
            [...correctSet].every(item => selectedSet.has(item))) {
            result.correct = true;
            result.score = answerData.points;
        }
    }

    return result;
}
function displayResults(passed, totalScore, maxScore, percentage, results) {
    const resultsContainer = document.getElementById('resultsContainer');
    const overallResult = document.getElementById('overallResult');
    const resultTitle = document.getElementById('resultTitle');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const resultMessage = document.getElementById('resultMessage');
    const detailedResults = document.getElementById('detailedResults');

    overallResult.className = `overall-result ${passed ? 'pass' : 'fail'}`;
    resultTitle.textContent = passed ? '🎉 Congratulations! You Passed!' : '📚 Keep Learning!';
    scoreDisplay.textContent = `${percentage}%`;
    resultMessage.textContent = `You scored ${totalScore} out of ${maxScore} points.`;

    let detailedHTML = '';
    results.forEach((result, index) => {
        const questionNumber = index + 1;
        const icon = result.correct ? '✓' : '✗';
        const iconClass = result.correct ? 'correct' : 'incorrect';
        const cardClass = result.correct ? 'correct' : 'incorrect';
        detailedHTML += `
            <div class="question-result ${cardClass}">
                <div class="question-result-header">
                    <span class="result-icon ${iconClass}">${icon}</span>
                    <strong>Question ${questionNumber}:</strong> ${result.question}
                </div>
                <div class="your-answer">
                    <span class="answer-label">Your Answer:</span>
                    <span>${result.userAnswer}</span>
                </div>
                <div class="correct-answer">
                    <span class="answer-label">Correct Answer:</span>
                    <span>${result.correctAnswer}</span>
                </div>
                <div style="margin-top: 10px;">
                    <strong>Score:</strong> ${result.score} / ${result.maxPoints} points
                </div>
            </div>
        `;
    });

    detailedResults.innerHTML = detailedHTML;
    resultsContainer.classList.add('show');
    document.getElementById('quizForm').style.display = 'none';
}

function resetQuiz() {
    const quizForm = document.getElementById('quizForm');
    if (quizForm) {
        quizForm.reset();
    }
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
        resultsContainer.classList.remove('show');
    }
    if (quizForm) {
        quizForm.style.display = 'block';
    }
    const quizIntro = document.querySelector('.quiz-intro');
    if (quizIntro) {
        quizIntro.scrollIntoView({ behavior: 'smooth' });
    }
}
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
