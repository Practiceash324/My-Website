// ===================== Sample Question Bank =====================
const QUESTIONS = [
  {
    text: "A shopkeeper marks up an item by 40% and then gives a 10% discount. What is his net profit percentage?",
    options: ["26%", "30%", "24%", "36%"],
    correctIndex: 0
  },
  {
    text: "Find the odd one out: Apple, Mango, Potato, Banana",
    options: ["Apple", "Mango", "Potato", "Banana"],
    correctIndex: 2
  },
  {
    text: "If CODING is written as DPEJOH, how is FLOWER written in the same code?",
    options: ["GMPXFS", "GMPXFT", "GNPXFS", "HMPXFS"],
    correctIndex: 0
  },
  {
    text: "A train 150m long crosses a pole in 15 seconds. What is its speed?",
    options: ["10 m/s", "15 m/s", "36 km/h", "Both A and C"],
    correctIndex: 3
  },
  {
    text: "Choose the correctly spelled word.",
    options: ["Occassion", "Occasion", "Ocasion", "Occasionn"],
    correctIndex: 1
  }
];

const TIME_PER_QUESTION = 50; // seconds

// ===================== State =====================
let currentIndex = 0;
let selectedAnswers = new Array(QUESTIONS.length).fill(null);
let timeLeft = TIME_PER_QUESTION;
let timerInterval = null;
let violationCount = 0;
let violationLog = [];
let webcamStream = null;

// ===================== DOM refs =====================
const screenIntro = document.getElementById('screen-intro');
const screenTest = document.getElementById('screen-test');
const screenResults = document.getElementById('screen-results');

const btnStart = document.getElementById('btn-start');
const btnRetake = document.getElementById('btn-retake');
const permissionNote = document.getElementById('permission-note');

const qProgress = document.getElementById('q-progress');
const progressFill = document.getElementById('progress-fill');
const timerEl = document.getElementById('timer');
const questionText = document.getElementById('question-text');
const optionsList = document.getElementById('options-list');
const webcamFeed = document.getElementById('webcam-feed');
const violationBanner = document.getElementById('violation-banner');
const violationText = document.getElementById('violation-text');

// ===================== Screen switching =====================
function showScreen(el){
  [screenIntro, screenTest, screenResults].forEach(s => s.classList.remove('active'));
  el.classList.add('active');
}

// ===================== Start flow =====================
btnStart.addEventListener('click', async () => {
  btnStart.disabled = true;
  btnStart.textContent = 'Requesting permissions...';

  // Try webcam access
  try {
    webcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    webcamFeed.srcObject = webcamStream;
  } catch (err) {
    permissionNote.textContent = 'Webcam access was denied or unavailable — continuing in demo mode without live camera.';
  }

  // Try fullscreen
  try {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }
  } catch (err) {
    permissionNote.textContent += ' Fullscreen could not be activated in this environment.';
  }

  startTest();
});

function startTest(){
  currentIndex = 0;
  selectedAnswers = new Array(QUESTIONS.length).fill(null);
  violationCount = 0;
  violationLog = [];
  showScreen(screenTest);
  renderQuestion();
}

// ===================== Rendering a question =====================
function renderQuestion(){
  const q = QUESTIONS[currentIndex];
  qProgress.textContent = `Question ${currentIndex + 1} of ${QUESTIONS.length}`;
  progressFill.style.width = `${(currentIndex / QUESTIONS.length) * 100}%`;
  questionText.textContent = q.text;

  optionsList.innerHTML = '';
  q.options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'option';
    div.textContent = opt;
    if (selectedAnswers[currentIndex] === i) div.classList.add('selected');
    div.addEventListener('click', () => {
      selectedAnswers[currentIndex] = i;
      document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
      div.classList.add('selected');
    });
    optionsList.appendChild(div);
  });

  resetTimer();
}

// ===================== Timer =====================
function resetTimer(){
  clearInterval(timerInterval);
  timeLeft = TIME_PER_QUESTION;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0){
      clearInterval(timerInterval);
      goToNext(true);
    }
  }, 1000);
}

function updateTimerDisplay(){
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
  timerEl.classList.remove('timer-warning', 'timer-danger');
  if (timeLeft <= 10) timerEl.classList.add('timer-danger');
  else if (timeLeft <= 20) timerEl.classList.add('timer-warning');
}

// ===================== Navigation =====================
function goToNext(auto){
  clearInterval(timerInterval);
  if (currentIndex < QUESTIONS.length - 1){
    currentIndex++;
    renderQuestion();
  } else {
    finishTest();
  }
}

// Allow manual advance by pressing Enter (optional convenience)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && screenTest.classList.contains('active')){
    goToNext(false);
  }
});

// ===================== Violation detection =====================
document.addEventListener('visibilitychange', () => {
  if (document.hidden && screenTest.classList.contains('active')){
    logViolation('Tab switched or window minimized');
  }
});

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && screenTest.classList.contains('active')){
    logViolation('Exited fullscreen mode');
  }
});

function logViolation(message){
  violationCount++;
  violationLog.push(message);
  violationText.textContent = `${message} (${violationCount} total)`;
  violationBanner.classList.remove('hidden');
  setTimeout(() => violationBanner.classList.add('hidden'), 4000);

  // Auto-submit test after repeated violations, mirroring real proctoring behavior
  if (violationCount >= 3){
    finishTest();
  }
}

// ===================== Finish + scoring =====================
function finishTest(){
  clearInterval(timerInterval);

  if (webcamStream){
    webcamStream.getTracks().forEach(track => track.stop());
  }
  if (document.fullscreenElement && document.exitFullscreen){
    document.exitFullscreen().catch(() => {});
  }

  let correctCount = 0;
  QUESTIONS.forEach((q, i) => {
    if (selectedAnswers[i] === q.correctIndex) correctCount++;
  });

  document.getElementById('score-value').textContent = `${correctCount}/${QUESTIONS.length}`;
  document.getElementById('score-percent').textContent = `${Math.round((correctCount / QUESTIONS.length) * 100)}%`;

  const violationSummary = document.getElementById('violation-summary');
  violationSummary.textContent = violationCount === 0
    ? 'No violations detected'
    : `${violationCount} violation${violationCount > 1 ? 's' : ''} detected during the test`;

  const reviewList = document.getElementById('review-list');
  reviewList.innerHTML = '';
  QUESTIONS.forEach((q, i) => {
    const userAns = selectedAnswers[i];
    const isCorrect = userAns === q.correctIndex;
    const div = document.createElement('div');
    div.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;
    div.innerHTML = `
      <div class="q">Q${i + 1}. ${q.text}</div>
      <div class="ans-row">Your answer: ${userAns !== null ? q.options[userAns] : '<em>Not answered</em>'} 
        — <span class="${isCorrect ? 'tag-correct' : 'tag-incorrect'}">${isCorrect ? 'Correct' : 'Incorrect'}</span></div>
      ${!isCorrect ? `<div class="ans-row">Correct answer: ${q.options[q.correctIndex]}</div>` : ''}
    `;
    reviewList.appendChild(div);
  });

  showScreen(screenResults);
}

// ===================== Retake =====================
btnRetake.addEventListener('click', () => {
  btnStart.disabled = false;
  btnStart.textContent = 'Start Test';
  permissionNote.textContent = '';
  showScreen(screenIntro);
});
