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
const controlButtons = document.getElementById('control-buttons');
const themeSelect = document.getElementById('theme-select');
const totalTimeDisplay = document.getElementById('total-time-display');
const importModal = document.getElementById('import-modal');
const importTextarea = document.getElementById('import-textarea');
const importLoadBtn = document.getElementById('import-load-btn');
const importCancelBtn = document.getElementById('import-cancel-btn');

let sections = [];
let currentIndex = 0;
let isPaused = true;
let intervalTimer;
let sectionSecondsRemaining = 0;

// --- Criação das seções e elementos --- //

function createSectionElements() {
  scriptContainer.innerHTML = '';
  sections = [];

  scriptData.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'section';
    div.dataset.index = index;

    // Tempo editável - input (acima do título)
    const timeInput = document.createElement('input');
    timeInput.type = 'number';
    timeInput.min = 1;
    timeInput.className = 'time-input';
    timeInput.value = item.time;
    timeInput.title = 'Tempo do tópico em minutos';

    // Label "min" fixo do lado
    const timeLabel = document.createElement('span');
    timeLabel.className = 'time-label';
    timeLabel.textContent = 'min';

    const timeWrapper = document.createElement('div');
    timeWrapper.style.marginBottom = '6px';
    timeWrapper.appendChild(timeInput);
    timeWrapper.appendChild(timeLabel);

    // Título editável - input
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'editable-title';
    titleInput.value = item.title;
    titleInput.title = 'Título do tópico (clique para editar)';

    // Subtópicos container
    const sub = document.createElement('div');
    sub.className = 'subtopics';

    item.topics.forEach((topicText, i) => {
      addTopicInput(sub, topicText);
    });

    // Botão adicionar subtópico (embaixo)
    const btnAddTopic = document.createElement('button');
    btnAddTopic.className = 'btn-add-topic';
    btnAddTopic.title = 'Adicionar subtópico neste tópico';
    btnAddTopic.textContent = '+ Adicionar subtópico';
    btnAddTopic.onclick = () => {
      addTopicInput(sub, '');
    };

    sub.appendChild(btnAddTopic);

    // Botão remover tópico (seção)
    const btnRemoveSection = document.createElement('button');
    btnRemoveSection.className = 'btn-remove-section';
    btnRemoveSection.title = 'Remover este tópico';
    btnRemoveSection.textContent = '−';
    btnRemoveSection.style.marginTop = '10px';
    btnRemoveSection.onclick = () => removeSection(index);

    div.appendChild(timeWrapper);
    div.appendChild(titleInput);
    div.appendChild(sub);
    div.appendChild(btnRemoveSection);

    scriptContainer.appendChild(div);

    sections.push({
      element: div,
      timeInput,
      titleInput,
      subtopics: sub,
      loadingBar: null // Usado para a barra horizontal, criamos depois
    });
  });

  createLoadingBars();
  updateTotalTime();
}

function addTopicInput(container, value = '') {
  const row = document.createElement('div');
  row.className = 'topic-row';

  const btnRemoveTopic = document.createElement('button');
  btnRemoveTopic.className = 'btn-remove-topic';
  btnRemoveTopic.title = 'Remover subtópico';
  btnRemoveTopic.textContent = '−';
  btnRemoveTopic.onclick = () => {
    container.removeChild(row);
  };

  const textarea = document.createElement('textarea');
  textarea.rows = 1;
  textarea.placeholder = 'Novo subtópico';
  textarea.value = value;
  textarea.title = 'Subtópico (clique para editar)';

  row.appendChild(btnRemoveTopic);
  row.appendChild(textarea);
  container.insertBefore(row, container.querySelector('.btn-add-topic'));
}

function removeSection(index) {
  if (scriptData.length === 1) {
    alert("Não é possível remover o último tópico.");
    return;
  }
  if (confirm("Tem certeza que quer remover este tópico?")) {
    scriptData.splice(index, 1);
    createSectionElements();
    if (currentIndex >= scriptData.length) currentIndex = scriptData.length - 1;
    startPlayer(currentIndex);
  }
}

function createLoadingBars() {
  sections.forEach(s => {
    if (!s.loadingBar) {
      const bar = document.createElement('div');
      bar.style.position = 'absolute';
      bar.style.bottom = '0';
      bar.style.left = '0';
      bar.style.height = '4px';
      bar.style.backgroundColor = 'var(--color-progress)';
      bar.style.width = '0%';
      bar.style.borderRadius = '0 0 6px 6px';
      s.loadingBar = bar;
      s.element.style.position = 'relative';
      s.element.appendChild(bar);
    }
  });
}

// Atualiza a soma total dos minutos e exibe
function updateTotalTime() {
  const total = scriptData.reduce((acc, s) => acc + (parseInt(s.time) || 0), 0);
  totalTimeDisplay.textContent = `Total: ${total} min`;
}

// Atualiza os tempos e barra vertical e horizontal

function updateTimers() {
  if (!sections.length) return;

  let totalMinutes = 0;
  let elapsedMinutes = 0;

  scriptData.forEach((s, i) => {
    totalMinutes += parseInt(s.time) || 0;
    if (i < currentIndex) elapsedMinutes += parseInt(s.time) || 0;
  });

  const currentSectionTime = parseInt(scriptData[currentIndex].time) || 1;
  const passedInCurrent = currentSectionTime - sectionSecondsRemaining / 60;

  const percent = ((elapsedMinutes + passedInCurrent) / totalMinutes) * 100;

  // Atualiza a barra vertical
  progressBar.style.setProperty('--fill-height', percent + '%');
  progressBar.style.background = `linear-gradient(to top, var(--color-progress) ${percent}%, var(--color-progress-bg) ${percent}%)`;

  // Atualiza barra horizontal da seção ativa
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

  updateTotalTime();
}

// Inicia o player numa seção

function startPlayer(index = 0) {
  clearInterval(intervalTimer);
  sections.forEach((s, i) => {
    s.element.classList.remove('active');
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
        if (currentIndex < sections.length - 1) {
          startPlayer(currentIndex + 1);
        }
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

// Salvar roteiro em .txt com explicação inicial

function saveScriptAsTXT() {
  // Atualiza scriptData com valores atuais do DOM
  sections.forEach((s, i) => {
    scriptData[i].title = s.titleInput.value.trim() || 'Sem título';
    scriptData[i].time = parseInt(s.timeInput.value) || 1;

    // Atualiza tópicos
    const textareas = s.subtopics.querySelectorAll('textarea');
    const topics = [];
    textareas.forEach(t => {
      if (t.value.trim() !== '') topics.push(t.value.trim());
    });
    scriptData[i].topics = topics;
  });

  let lines = [];
  lines.push("Roteiro para usar no site da live. Copie e cole este conteúdo JSON no campo de importação do site.\n");
  lines.push(JSON.stringify(scriptData, null, 2));

  const blob = new Blob([lines.join('\n')], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "roteiro_live.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Abrir modal de importação

function openImportModal() {
  importModal.setAttribute('aria-hidden', 'false');
  importTextarea.value = '';
  importTextarea.focus();
}

// Fechar modal

function closeImportModal() {
  importModal.setAttribute('aria-hidden', 'true');
}

// Importar roteiro JSON colado

function importScriptFromJSON() {
  let jsonText = importTextarea.value.trim();
  if (!jsonText) {
    alert("Por favor, cole o JSON do roteiro para importar.");
    return;
  }
  try {
    const data = JSON.parse(jsonText);
    if (!Array.isArray(data)) throw new Error('Formato inválido');
    scriptData = data;
    createSectionElements();
    startPlayer(0);
    togglePause(); // Começa pausado
    closeImportModal();
  } catch (e) {
    alert("JSON inválido. Verifique e tente novamente.");
  }
}

// Tema

function applyTheme(theme) {
  document.body.className = theme;
}

themeSelect.onchange = () => {
  applyTheme(themeSelect.value);
};

// Liga botões

document.getElementById('btn-back').onclick = goBack;
document.getElementById('btn-play-pause').onclick = togglePause;
document.getElementById('btn-forward').onclick = goForward;
document.getElementById('btn-reset').onclick = resetTime;
document.getElementById('btn-save').onclick = saveScriptAsTXT;
document.getElementById('btn-import').onclick = openImportModal;
importLoadBtn.onclick = importScriptFromJSON;
importCancelBtn.onclick = closeImportModal;

// Inicia tudo

applyTheme(themeSelect.value);
createSectionElements();
startPlayer(0);
togglePause(); // começa pausado
