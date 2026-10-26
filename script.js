const story = document.querySelector('#story');
const choices = document.querySelector('#choices');
const restartButton = document.querySelector('#restart-button');
const chapterLabel = document.querySelector('#chapter-label');
const pathLabel = document.querySelector('#path-label');
const progressBar = document.querySelector('#progress-bar');

const scenes = {
  start: {
    chapter: 1,
    title: 'O desafio da feira de ciências',
    text: [
      'Você é Alex, estudante da turma 3i. Na véspera da feira de ciências, a professora Helena anuncia que cada grupo poderá usar inteligência artificial para pesquisar, criar ideias e revisar seus trabalhos.',
      'A regra é simples: a IA pode ajudar, mas ninguém pode entregar algo que não entende. Seu grupo precisa decidir como agir.'
    ],
    choices: [
      { label: 'Criar um plano de uso responsável e registrar cada ajuda da IA.', next: 'responsible', path: 'Uso responsável' },
      { label: 'Deixar a IA fazer o trabalho inteiro para ganhar tempo.', next: 'shortcut', path: 'Atalho' },
      { label: 'Recusar qualquer tecnologia e fazer tudo sem pesquisar.', next: 'fear', path: 'Desconfiança' }
    ]
  },
  responsible: {
    chapter: 2,
    title: 'Perguntas melhores',
    text: [
      'O grupo conversa sobre fontes, privacidade e vieses. Vocês usam a IA apenas para sugerir perguntas e comparar explicações, conferindo cada informação em livros e sites confiáveis.',
      'Na apresentação, um colega percebe que uma resposta da ferramenta está errada. O que vocês fazem?'
    ],
    choices: [
      { label: 'Mostrar o erro, explicar a verificação e corrigir o trabalho.', next: 'balanced', path: 'Uso responsável' },
      { label: 'Esconder o erro para a apresentação parecer perfeita.', next: 'gameOver', path: 'Uso responsável' }
    ]
  },
  shortcut: {
    chapter: 2,
    title: 'O trabalho perfeito demais',
    text: [
      'Em poucos minutos, a IA entrega um texto bonito. Porém, quando a professora pergunta como vocês chegaram à conclusão principal, ninguém sabe responder.',
      'Ainda há uma chance de mudar a rota antes da feira.'
    ],
    choices: [
      { label: 'Reconhecer o problema, recomeçar e usar a IA como apoio.', next: 'balanced', path: 'Atalho → responsabilidade' },
      { label: 'Inventar uma explicação e torcer para ninguém notar.', next: 'gameOver', path: 'Atalho' }
    ]
  },
  fear: {
    chapter: 2,
    title: 'Uma sala dividida',
    text: [
      'O grupo evita a IA, mas também deixa de ouvir colegas que usam a ferramenta com cuidado. Durante a pesquisa, vocês encontram informações difíceis de entender e percebem que a tecnologia poderia ajudar a acessá-las.',
      'Como lidar com essa descoberta?'
    ],
    choices: [
      { label: 'Testar a IA com regras claras, revisão humana e transparência.', next: 'balanced', path: 'Desconfiança → equilíbrio' },
      { label: 'Proibir o assunto e encerrar a pesquisa.', next: 'closedEnding', path: 'Desconfiança' }
    ]
  },
  balanced: {
    chapter: 3,
    title: 'A escolha que ensina',
    text: [
      'Vocês apresentam o processo completo: o que foi criado por pessoas, o que foi sugerido pela IA e como tudo foi conferido. A turma debate privacidade, autoria, acessibilidade e o risco de respostas preconceituosas.',
      'A professora convida o grupo a propor uma regra para a escola.'
    ],
    choices: [
      { label: 'Criar um guia de uso consciente, com revisão e crédito às ferramentas.', next: 'goodEnding', path: 'Equilíbrio' },
      { label: 'Liberar a IA sem regras, pois cada aluno deve decidir sozinho.', next: 'riskyEnding', path: 'Equilíbrio' }
    ]
  },
  gameOver: {
    chapter: 3,
    title: 'GAME OVER — A confiança foi perdida',
    text: [
      'O erro é descoberto, e o grupo não consegue explicar suas escolhas. A nota não é o único problema: colegas passam a desconfiar do projeto e a escola precisa interromper a feira para discutir o que aconteceu.',
      'Uma ferramenta pode acelerar um caminho, mas responsabilidade, autoria e pensamento crítico continuam sendo de quem usa.'
    ],
    ending: 'game-over'
  },
  closedEnding: {
    chapter: 3,
    title: 'Fim — Uma porta fechada',
    text: [
      'O grupo termina a pesquisa, mas percebe que a discussão ficou incompleta. A escola mantém a proibição por enquanto, enquanto prepara uma formação para que todos possam conhecer os riscos e as possibilidades da IA.',
      'Às vezes, evitar uma conversa também é uma escolha — e ela pode deixar a comunidade menos preparada.'
    ],
    ending: 'ending'
  },
  riskyEnding: {
    chapter: 4,
    title: 'Fim — Liberdade sem bússola',
    text: [
      'A regra aberta parece moderna, mas logo surgem trabalhos copiados, dados pessoais expostos e respostas preconceituosas circulando pela escola. O grupo aprende que liberdade sem orientação pode aumentar a desigualdade.',
      'A próxima tarefa será construir regras melhores, desta vez ouvindo toda a comunidade.'
    ],
    ending: 'ending'
  },
  goodEnding: {
    chapter: 4,
    title: 'FIM — A escola aprende junto',
    text: [
      'O guia é aprovado pela turma: a IA pode apoiar a aprendizagem, nunca substituir o esforço; informações devem ser verificadas; dados pessoais ficam protegidos; e toda ajuda da ferramenta é declarada.',
      'A feira termina com perguntas melhores do que as respostas. Vocês descobrem que o futuro da escola não depende de aceitar ou rejeitar a IA, mas de aprender a usá-la com consciência.'
    ],
    ending: 'ending'
  }
};

let currentScene = 'start';
let currentPath = 'ainda não escolhido';

function renderScene(sceneId) {
  const scene = scenes[sceneId];
  currentScene = sceneId;
  chapterLabel.textContent = `Capítulo ${scene.chapter} de 4`;
  pathLabel.textContent = `Caminho: ${currentPath}`;
  progressBar.style.width = `${Math.min(scene.chapter / 4 * 100, 100)}%`;
  story.innerHTML = `<h2>${scene.title}</h2>${scene.text.map(paragraph => `<p>${paragraph}</p>`).join('')}`;
  choices.innerHTML = '';

  if (scene.ending) {
    story.querySelector('h2').classList.add(scene.ending);
    story.classList.add('final-scene');
    restartButton.classList.remove('hidden');
    return;
  }

  story.classList.remove('final-scene');
  restartButton.classList.add('hidden');
  scene.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.className = 'choice-button';
    button.type = 'button';
    button.textContent = choice.label;
    button.addEventListener('click', () => {
      currentPath = choice.path;
      renderScene(choice.next);
    });
    choices.appendChild(button);
  });
}

restartButton.addEventListener('click', () => {
  currentPath = 'ainda não escolhido';
  renderScene('start');
});

renderScene('start');
