// Dados iniciais do roteiro
let scriptData = [
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

const scriptContainer = document.getElementById('script');
const progressBar = document.getElementById('progress-bar');
const progressBarFill = progressBar.querySelector('::before'); // not directly accessible, will update via style
const sectionTimeDisplay = document.getElementById('section-time');
const totalTimeDisplay = document.getElementById('total-time');
const themeSelect = document.getElementById('theme-select');
const controlButtons = document.getElementById('control-buttons');
const progressContainer = document.getElementById('progress-container');

const colors = ["#2e7d32", "#388e3c", "#43a047", "#4caf50", "#66bb6a", "#5ea765", "#518c58", "#3c6b42", "#2c5333"];

let sections = [];
let currentIndex = 0;
let isPaused = true;
let intervalTimer;
let sectionSecondsRemaining = 0;
let totalSecondsElapsed = 0;
let elapsed = 0;

// --- Funções --- //

function createSectionElements() {
  scriptContainer.innerHTML = '';
  sections = [];

  scriptData.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'section';
    div.dataset.index = index;

    // Título editável - input
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'editable-title';
    titleInput.value = item.title;
    titleInput.title = 'Título da seção (clique para editar)';

    // Tempo editável - input
    const timeInput = document.createElement('input');
    timeInput.type = 'number';
    timeInput.min = 1;
    timeInput.className = 'time-input';
    timeInput.value = item.time;
    timeInput.title = 'Tempo da seção em minutos';

    // Label min ao lado
    const timeLabel = document.createElement('span');
    timeLabel.className = 'time-label';
    timeLabel.textContent = 'min';

    // Botões adicionar/remover seção
    const btnAddSection = document.createElement('button');
    btnAddSection.className = 'btn-add-section';
    btnAddSection.title = 'Adicionar nova seção abaixo';
    btnAddSection.textContent = '+';
    btnAddSection.onclick = () => {
      addSection(index + 1);
    };

    const btnRemoveSection = document.createElement('button');
    btnRemoveSection.className = 'btn-remove-section';
    btnRemoveSection.title = 'Remover esta seção';
    btnRemoveSection.textContent = '−';
    btnRemoveSection.onclick = () => {
      removeSection(index);
    };

    // Header da seção com título, tempo e botões
    const headerDiv = document.createElement('div');
    headerDiv.style.display = 'flex';
    headerDiv.style.alignItems = 'center';
    headerDiv.style.marginBottom = '5px';

    headerDiv.appendChild(titleInput);
    headerDiv.appendChild(timeInput);
    headerDiv.appendChild(timeLabel);
    headerDiv.appendChild(btnAddSection);
    headerDiv.appendChild(btnRemoveSection);

    div.appendChild(headerDiv);

    const loadingBar = document.createElement('div');
    loadingBar.className = 'loading-bar';
    div.appendChild(loadingBar);

    // Subtópicos com botões
    const sub = document.createElement('div');
    sub.className = 'subtopics';

    item.topics.forEach((topicText, i) => {
      addTopicInput(sub, topicText, index, i);
    });

    // Botão adicionar tópico
    const btnAddTopic = document.createElement('button');
    btnAddTopic.className = 'btn-add-topic';
    btnAddTopic.title = 'Adicionar tópico nesta seção';
    btnAddTopic.textContent = '+ Adicionar tópico';
    btnAddTopic.onclick = () => {
      addTopicInput(sub, '', index);
    };

    sub.appendChild(btnAddTopic);
    div.appendChild(sub);

    scriptContainer.appendChild(div);

    sections.push({ element: div, loadingBar, durationInput: timeInput, titleInput, subtopics: sub });
  });
}

function addTopicInput(container, text, sectionIndex, topicIndex) {
  const row = document.createElement('div');
  row.className = 'topic-row';

  const textarea = document.createElement('textarea');
  textarea.rows = 2;
  textarea.value = text;
  textarea.title = 'Editar tópico (clique para editar)';
  textarea.style.flexGrow = '1';

  const btnRemoveTopic = document.createElement('button');
  btnRemoveTopic.className = 'btn-remove-topic';
  btnRemoveTopic.title = 'Remover este tópico';
  btnRemoveTopic.textContent = '−';
  btnRemoveTopic.onclick = () => {
    container.removeChild(row);
  };

  row.appendChild(textarea);
  row.appendChild(btnRemoveTopic);
  container.insertBefore(row, container.querySelector('.btn-add-topic'));
}

function addSection(index) {
  scriptData.splice(index, 0, { title: "Nova Seção", time: 3, topics: ["Novo tópico"] });
  createSectionElements();
  startPlayer(currentIndex);
}

function removeSection(index) {
  if (scriptData.length === 1) {
    alert("Não é possível remover a última seção.");
    return;
  }
  if (confirm("Tem certeza que quer remover esta seção?")) {
    scriptData.splice(index, 1);
    createSectionElements();
    if(currentIndex >= scriptData.length) currentIndex = scriptData.length -1;
    startPlayer(currentIndex);
  }
}

function updateTimers() {
  const min = String(Math.floor(sectionSecondsRemaining / 60)).padStart(2, '0');
  const sec = String(sectionSecondsRemaining % 60).padStart(2, '0');
  // Como no layout atual não temos exibição do tempo (se quiser podemos colocar), deixo comentado
  // sectionTimeDisplay.textContent = `${min}:${sec}`;

  const total = scriptData.reduce((sum, s) => sum + (parseInt(s.time) || 0), 0);
  const elapsedTotal = scriptData
    .slice(0, currentIndex)
    .reduce((sum, s) => sum + (parseInt(s.time) || 0), 0);

  const percent = (elapsedTotal + ((parseInt(scriptData[currentIndex].time) || 0) - sectionSecondsRemaining/60)) / total * 100;

  // Atualiza barra vertical preenchida
  const progressFill = document.querySelector('#progress-bar::before');
  // Não dá para acessar ::before direto, então atualizamos via style do elemento mesmo:
  progressBar.style.setProperty('--fill-height', percent + '%');
  progressBar.style.height = '400px';

  // Atualiza altura da barra preenchida pelo JS (como não conseguimos com ::before, vamos mudar o método:)
  progressBar.style.background = `linear-gradient(to top, var(--color-progress) ${percent}%, var(--color-progress-bg) ${percent}%)`;

  // Atualiza a barra de loading horizontal da seção ativa
  sections.forEach((s, i) => {
    if (i === currentIndex) {
      const totalSec = (parseInt(scriptData[i].time) || 1) * 60;
      const passed = totalSec - sectionSecondsRemaining;
      const widthPercent = (passed / totalSec) * 100;
      s.loadingBar.style.width = widthPercent + '%';
    } else {
      s.loadingBar.style.width = '0%';
    }
  });
}

function startPlayer(index = 0) {
  clearInterval(intervalTimer);
  sections.forEach((s, i) => {
    s.element.classList.remove('active');
    s.element.style.backgroundColor = '';
  });

  if (index >= sections.length) return;

  currentIndex = index;
  const { element } = sections[index];
  element.classList.add('active');

  sectionSecondsRemaining = (parseInt(scriptData[index].time) || 1) * 60;

  updateTimers();

  intervalTimer = setInterval(() => {
    if (!isPaused) {
      sectionSecondsRemaining--;
      if (sectionSecondsRemaining <= 0) {
        clearInterval(intervalTimer);
        startPlayer(currentIndex + 1);
      }
      updateTimers();
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
  clearInterval(intervalTimer);
  startPlayer(currentIndex);
  isPaused = true;
  document.getElementById('btn-play-pause').innerText = '▶️';
}

function saveScriptAsJSON() {
  // Atualiza scriptData com valores editados
  sections.forEach((s, i) => {
    scriptData[i].title = s.titleInput.value.trim() || 'Sem título';
    scriptData[i].time = parseInt(s.durationInput.value) || 1;
    // Atualiza tópicos
    const textareas = s.subtopics.querySelectorAll('textarea');
    const topics = [];
    textareas.forEach(t => {
      if(t.value.trim() !== '') topics.push(t.value.trim());
    });
    scriptData[i].topics = topics;
  });
  const blob = new Blob([JSON.stringify(scriptData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "roteiro_live.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Tema

function applyTheme(theme) {
  document.body.className = theme;
}

themeSelect.onchange = () => {
  applyTheme(themeSelect.value);
};

// Inicia tema padrão
applyTheme(themeSelect.value);

// Liga botões
document.getElementById('btn-back').onclick = goBack;
document.getElementById('btn-play-pause').onclick = togglePause;
document.getElementById('btn-forward').onclick = goForward;
document.getElementById('btn-reset').onclick = resetTime;
document.getElementById('btn-save').onclick = saveScriptAsJSON;

// Inicia

createSectionElements();
startPlayer();
togglePause(); // começa pausado
