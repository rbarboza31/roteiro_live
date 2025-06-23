// Dados do roteiro
const scriptData = [
  {
    title: "Abertura", time: 3,
    topics: ["Apresentação pessoal", "Objetivo da live", "Incentivo à participação"]
  },
  {
    title: "Por que treinar sua equipe?", time: 4,
    topics: ["Problemas comuns nas oficinas", "O custo de não treinar", "Funcionário vs profissional"]
  },
  {
    title: "Perfil da equipe ideal", time: 5,
    topics: ["Postura, técnica e compromisso", "Competências mínimas", "Como identificar talentos"]
  },
  {
    title: "Treinamento na prática: como começar", time: 8,
    topics: ["Diagnóstico da equipe atual", "Tipos de treinamento", "Individualizar o processo"]
  },
  {
    title: "Métodos de Treinamento", time: 8,
    topics: ["Interno vs externo", "Treinamento prático", "Aprendizado contínuo"]
  },
  {
    title: "Ferramentas e materiais", time: 5,
    topics: ["Materiais de apoio", "Software de gestão", "Como medir resultados"]
  },
  {
    title: "Erros comuns ao tentar treinar", time: 4,
    topics: ["Ensinar tudo de uma vez", "Não dar o exemplo", "Não acompanhar o desenvolvimento"]
  },
  {
    title: "Estudos de caso e experiências", time: 5,
    topics: ["Histórias reais", "O que funcionou", "Resultados práticos"]
  },
  {
    title: "Encerramento", time: 3,
    topics: ["Resumo e reforço", "Dica prática final", "Chamada para ação"]
  }
];

// Cores por seção
const colors = [
  "#2e7d32", "#388e3c", "#43a047", "#4caf50", "#66bb6a",
  "#5ea765", "#518c58", "#3c6b42", "#2c5333"
];

// Seletores
const scriptContainer = document.getElementById('script');
const progressBar = document.getElementById('progress-bar');
const sectionTimeDisplay = document.getElementById('section-time');
const totalTimeDisplay = document.getElementById('total-time');

// Estado
let sections = [];
let currentIndex = 0;
let isPaused = true;
let intervalTimer;
let sectionSecondsRemaining = 0;
let totalSecondsElapsed = 0;
let elapsed = 0;

// Criar visual das seções
function createSectionElements() {
  scriptData.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'section';
    div.dataset.index = index;

    const title = document.createElement('div');
    title.innerHTML = `<strong>${item.title}</strong>`;

    const timeSpan = document.createElement('span');
    timeSpan.className = 'time-editable';
    timeSpan.innerText = ` (${item.time} min)`;
    title.appendChild(timeSpan);

    div.appendChild(title);

    const loadingBar = document.createElement('div');
    loadingBar.className = 'loading-bar';
    div.appendChild(loadingBar);

    const sub = document.createElement('div');
    sub.className = 'subtopics';
    sub.innerHTML = item.topics.map(t => `• ${t}`).join("<br>");
    div.appendChild(sub);

    scriptContainer.appendChild(div);
    sections.push({ element: div, loadingBar, duration: item.time });
  });
}

// Atualiza os timers
function updateTimers() {
  const min = String(Math.floor(sectionSecondsRemaining / 60)).padStart(2, '0');
  const sec = String(sectionSecondsRemaining % 60).padStart(2, '0');
  sectionTimeDisplay.textContent = `${min}:${sec}`;

  const tMin = String(Math.floor(totalSecondsElapsed / 60)).padStart(2, '0');
  const tSec = String(totalSecondsElapsed % 60).padStart(2, '0');
  totalTimeDisplay.textContent = `${tMin}:${tSec}`;
}

// Inicia ou reinicia uma seção
function startPlayer(index = 0) {
  clearInterval(intervalTimer);
  sections.forEach((s, i) => {
    s.element.classList.remove('active');
    s.loadingBar.style.width = '0%';
    s.element.style.backgroundColor = 'transparent';
  });

  if (index >= sections.length) return;

  currentIndex = index;
  const { element, loadingBar, duration } = sections[index];

  element.classList.add('active');
  element.style.backgroundColor = colors[index % colors.length];

  const total = scriptData.reduce((sum, item) => sum + item.time, 0);
  const progressPercent = (elapsed / total) * 100;
  progressBar.style.height = progressPercent + '%';

  sectionSecondsRemaining = duration * 60;
  const totalSeconds = sectionSecondsRemaining;
  let currentSecond = 0;

  updateTimers();

  intervalTimer = setInterval(() => {
    if (!isPaused) {
      currentSecond++;
      sectionSecondsRemaining--;
      totalSecondsElapsed++;
      updateTimers();

      const percent = (currentSecond / totalSeconds) * 100;
      loadingBar.style.width = `${percent}%`;

      if (currentSecond >= totalSeconds) {
        clearInterval(intervalTimer);
        elapsed += duration;
        startPlayer(currentIndex + 1);
      }
    }
  }, 1000);
}

// Botões
function goBack() {
  if (currentIndex > 0) {
    elapsed -= scriptData[currentIndex - 1].time;
    startPlayer(currentIndex - 1);
  }
}

function togglePause() {
  isPaused = !isPaused;
  const btn = document.getElementById('btn-play-pause');
  btn.innerText = isPaused ? '▶️' : '⏸️';
}

function goForward() {
  if (currentIndex < scriptData.length - 1) {
    elapsed += scriptData[currentIndex].time;
    startPlayer(currentIndex + 1);
  }
}

function resetTime() {
  if (!sections[currentIndex]) return;
  clearInterval(intervalTimer);
  elapsed = scriptData.slice(0, currentIndex).reduce((s, i) => s + i.time, 0);
  startPlayer(currentIndex);
  isPaused = true;
  document.getElementById('btn-play-pause').innerText = '▶️';
}

// Associar eventos aos botões
document.getElementById('btn-back').onclick = goBack;
document.getElementById('btn-play-pause').onclick = togglePause;
document.getElementById('btn-forward').onclick = goForward;
document.getElementById('btn-reset').onclick = resetTime;

// Inicializar tudo
createSectionElements();
startPlayer();
togglePause(); // começa pausado
