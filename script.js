// Dados iniciais do roteiro
const scriptData = [
  { title: "Abertura", time: 3, topics: ["Apresentação pessoal", "Objetivo da live", "Incentivo à participação"] },
  { title: "Por que treinar sua equipe?", time: 4, topics: ["Problemas comuns nas oficinas", "O custo de não treinar", "Funcionário vs profissional"] },
  { title: "Perfil da equipe ideal", time: 5, topics: ["Postura, técnica e compromisso", "Competências mínimas", "Como identificar talentos"] },
  { title: "Treinamento na prática: como começar", time: 8, topics: ["Diagnóstico da equipe atual", "Tipos de treinamento", "Individualizar o processo"] },
  { title: "Métodos de Treinamento", time: 8, topics: ["Interno vs externo", "Treinamento prático", "Aprendizado contínuo"] },
  { title: "Ferramentas e materiais", time: 5, topics: ["Materiais de apoio", "Software de gestão", "Como medir resultados"] },
  { title: "Erros comuns ao tentar treinar", time: 4, topics: ["Ensinar tudo de uma vez", "Não dar o exemplo", "Não acompanhar o desenvolvimento"] },
  { title: "Estudos de caso e experiências", time: 5, topics: ["Histórias reais", "O que funcionou", "Resultados práticos"] },
  { title: "Encerramento", time: 3, topics: ["Resumo e reforço", "Dica prática final", "Chamada para ação"] }
];

const colors = ["#2e7d32", "#388e3c", "#43a047", "#4caf50", "#66bb6a", "#5ea765", "#518c58", "#3c6b42", "#2c5333"];

const scriptContainer = document.getElementById('script');
const progressBar = document.getElementById('progress-bar');
const sectionTimeDisplay = document.getElementById('section-time');
const totalTimeDisplay = document.getElementById('total-time');

let sections = [];
let currentIndex = 0;
let isPaused = true;
let intervalTimer;
let sectionSecondsRemaining = 0;
let totalSecondsElapsed = 0;
let elapsed = 0;

function createSectionElements() {
  scriptData.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'section';
    div.dataset.index = index;

    // Título editável - input
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'editable-title';
    titleInput.value = item.title;

    // Tempo editável - input
    const timeInput = document.createElement('input');
    timeInput.type = 'number';
    timeInput.min = 1;
    timeInput.className = 'time-input';
    timeInput.value = item.time;
    timeInput.title = 'Tempo em minutos';

    div.appendChild(titleInput);
    div.appendChild(timeInput);

    const loadingBar = document.createElement('div');
    loadingBar.className = 'loading-bar';
    div.appendChild(loadingBar);

    // Tópicos editáveis - textarea para cada tópico
    const sub = document.createElement('div');
    sub.className = 'subtopics';
    item.topics.forEach(topic => {
      const ta = document.createElement('textarea');
      ta.rows = 2;
      ta.value = topic;
      sub.appendChild(ta);
    });
    div.appendChild(sub);

    scriptContainer.appendChild(div);
    sections.push({ element: div, loadingBar, durationInput: timeInput, titleInput, subtopics: sub });
  });
}

function updateTimers() {
  const min = String(Math.floor(sectionSecondsRemaining / 60)).padStart(2, '0');
  const sec = String(sectionSecondsRemaining % 60).padStart(2, '0');
  sectionTimeDisplay.textContent = `${min}:${sec}`;

  const tMin = String(Math.floor(totalSecondsElapsed / 60)).padStart(2, '0');
  const tSec = String(totalSecondsElapsed % 60).padStart(2, '0');
  totalTimeDisplay.textContent = `${tMin}:${tSec}`;
}

function startPlayer(index = 0) {
  clearInterval(intervalTimer);
  sections.forEach((s, i) => {
    s.element.classList.remove('active');
    s.loadingBar.style.width = '0%';
    s.element.style.backgroundColor = 'transparent';
  });

  if (index >= sections.length) return;

  currentIndex = index;
  const { element, loadingBar, durationInput } = sections[index];

  element.classList.add('active');
  element.style.backgroundColor = colors[index % colors.length];

  // Calcula o total atualizado (com os tempos editados)
  const total = sections.reduce((sum, s) => {
    const val = parseInt(s.durationInput.value);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  // Calcula quanto tempo já passou (soma tempos anteriores)
  elapsed = sections.slice(0, index).reduce((sum, s) => {
    const val = parseInt(s.durationInput.value);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const progressPercent = (elapsed / total) * 100;
  progressBar.style.height = progressPercent + '%';

  sectionSecondsRemaining = (parseInt(durationInput.value) || 1) * 60;
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
        startPlayer(currentIndex + 1);
      }
    }
  }, 1000);
}

function goBack() {
  if (currentIndex > 0) {
    startPlayer(currentIndex - 1);
  }
}

function togglePause() {
  isPaused = !isPaused;
  const btn = document.getElementById('btn-play-pause');
  btn.innerText = isPaused ? '▶️' : '⏸️';
}

function goForward() {
  if (currentIndex < sections.length - 1) {
    startPlayer(currentIndex + 1);
  }
}

function resetTime() {
  if (!sections[currentIndex]) return;
  clearInterval(intervalTimer);
  startPlayer(currentIndex);
  isPaused = true;
  document.getElementById('btn-play-pause').innerText = '▶️';
  totalSecondsElapsed = 0;
  elapsed = 0;
  sectionSecondsRemaining = (parseInt(sections[currentIndex].durationInput.value) || 1) * 60;
  updateTimers();
}

// Salvar roteiro editado em JSON e baixar
function saveScriptAsJSON() {
  const savedData = sections.map(s => {
    const title = s.titleInput.value.trim();
    const time = parseInt(s.durationInput.value) || 1;
    const topics = Array.from(s.subtopics.querySelectorAll('textarea')).map(t => t.value.trim()).filter(t => t);
    return { title, time, topics };
  });
  const blob = new Blob([JSON.stringify(savedData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "roteiro_live.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Liga os botões
document.getElementById('btn-back').onclick = goBack;
document.getElementById('btn-play-pause').onclick = togglePause;
document.getElementById('btn-forward').onclick = goForward;
document.getElementById('btn-reset').onclick = resetTime;
document.getElementById('btn-save').onclick = saveScriptAsJSON;

createSectionElements();
startPlayer();
togglePause(); // começa pausado
