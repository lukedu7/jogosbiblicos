let perguntas = [];
let questaoAtual = 0;
let acertos = 0;

function inicializarQuiz() {
    atualizarLabelPergunta();
}

function atualizarLabelPergunta() {
    const numeroPergunta = perguntas.length + 1;
    document.getElementById('perguntaLabel').innerText = `Pergunta ${numeroPergunta}:`;
}

function adicionarPergunta() {
    const pergunta = document.getElementById('pergunta').value;
    const respostaCorreta = document.getElementById('respostaCorreta').value;
    const alternativa1 = document.getElementById('alternativa1').value;
    const alternativa2 = document.getElementById('alternativa2').value;
    const alternativa3 = document.getElementById('alternativa3').value;

    perguntas.push({
        pergunta,
        respostaCorreta,
        alternativas: [respostaCorreta, alternativa1, alternativa2, alternativa3]
    });

    // Limpar campos
    document.getElementById('pergunta').value = '';
    document.getElementById('respostaCorreta').value = '';
    document.getElementById('alternativa1').value = '';
    document.getElementById('alternativa2').value = '';
    document.getElementById('alternativa3').value = '';

    atualizarLabelPergunta();
}

function confirmarQuiz() {
    if (perguntas.length === 0) {
        document.getElementById('quizContainer').innerHTML = '<p>Adicione pelo menos uma pergunta!</p>';
        return;
    }
    document.getElementById('quizCreation').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    questaoAtual = 0;
    mostrarQuestao();
}

function mostrarQuestao() {
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = '';

    const questao = perguntas[questaoAtual];
    let questionHTML = `<div class="questao-container"><h3>${questao.pergunta}</h3>`;
    questao.alternativas.sort(() => Math.random() - 0.5).forEach((alt) => {
        questionHTML += `<button class="resposta-button" onclick="verificarResposta('${questao.respostaCorreta}', '${alt}')">${alt}</button>`;
    });
    questionHTML += `</div>`;
    quizContainer.innerHTML = questionHTML;
}

function verificarResposta(respostaCorreta, respostaEscolhida) {
    const botoes = document.querySelectorAll('.resposta-button');
    botoes.forEach(botao => {
        botao.disabled = true;
        if (botao.textContent === respostaCorreta) {
            botao.classList.add('correta');
        }
    });

    if (respostaCorreta === respostaEscolhida) {
        acertos++;
    }

    setTimeout(() => {
        questaoAtual++;
        if (questaoAtual < perguntas.length) {
            mostrarQuestao();
        } else {
            mostrarResultado();
        }
    }, 1500);
}

function mostrarResultado() {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = `
        <h2>Resultado</h2>
        <p>Acertos: ${acertos} de ${perguntas.length}</p>
        <button class="styled-button" onclick="criarNovoQuiz()">Criar Novo Quiz</button>
        <button class="styled-button" onclick="tentarNovamente()">Tentar Novamente</button>
    `;
    resultContainer.style.display = 'block';
    document.getElementById('quizContainer').style.display = 'none';
}

function criarNovoQuiz() {
    perguntas = [];
    questaoAtual = 0;
    acertos = 0;
    document.getElementById('result').style.display = 'none';
    document.getElementById('quizCreation').style.display = 'block';
    document.getElementById('quizContainer').style.display = 'none';
    atualizarLabelPergunta();
}

function tentarNovamente() {
    questaoAtual = 0;
    acertos = 0;
    document.getElementById('result').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    mostrarQuestao();
}

window.onload = function() {
    inicializarQuiz();
}