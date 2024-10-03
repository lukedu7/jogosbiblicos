// Variáveis globais
let currentLevel = 1;
let completedBooks = JSON.parse(localStorage.getItem('completedBooks')) || [];
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let currentPhase = 1;
let currentBook = '';
let bookProgress = {};
let messageElement; // Elemento para exibir mensagens

function salvarProgresso() {
    const dados = {
        completedBooks: completedBooks,
        currentLevel: currentLevel,
        bookProgress: bookProgress
    };

    fetch('salvar_progresso.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Progresso salvo:', data);
    })
    .catch((error) => {
        console.error('Erro ao salvar progresso:', error);
    });
}


const LEVEL_PREFIXES = {
    1: "022",
    2: "023",
    3: "024"
};

// Lista de livros
const books = {
    Pentateuco: ["Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio"],
    Históricos: ["Josué", "Juízes", "Rute", "1 Samuel", "2 Samuel", "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras", "Neemias", "Ester"],
    Poéticos: ["Jó", "Salmos", "Provérbios", "Eclesiastes", "Cânticos"],
    ProfetasMaiores: ["Isaías", "Jeremias", "Lamentações", "Ezequiel", "Daniel"],
    ProfetasMenores: ["Oséias", "Joel", "Amós", "Obadias", "Jonas", "Miquéias", "Naum", "Habacuque", "Sofonias", "Ageu", "Zacarias", "Malaquias"],
    Evangelhos: ["Mateus", "Marcos", "Lucas", "João"],
    Histórico: ["Atos"],
    Cartas: ["Romanos", "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios", "Filipenses", "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses", "1 Timóteo", "2 Timóteo", "Tito", "Filemom"],
    Revelação: ["Apocalipse"]
};

// Nomes dos arquivos dos livros
const bookFileNames = {
    "Gênesis": "gen", "Êxodo": "ex", "Levítico": "lev", "Números": "num", "Deuteronômio": "deu",
    "Josué": "jos", "Juízes": "jui", "Rute": "rut", "1 Samuel": "1sam", "2 Samuel": "2sam",
    "1 Reis": "1re", "2 Reis": "2re", "1 Crônicas": "1cr", "2 Crônicas": "2cr", "Esdras": "esd",
    "Neemias": "nee", "Ester": "est", "Jó": "jo", "Salmos": "sal", "Provérbios": "pro",
    "Eclesiastes": "ecl", "Cânticos": "can", "Isaías": "isa", "Jeremias": "jer", "Lamentações": "lam",
    "Ezequiel": "eze", "Daniel": "dan", "Oseias": "ose", "Joel": "joe", "Amós": "amo",
    "Obadias": "oba", "Jonas": "jon", "Miqueias": "miq", "Naum": "nau", "Habacuque": "hab",
    "Sofonias": "sof", "Ageu": "age", "Zacarias": "zac", "Malaquias": "mal",
    "Mateus": "mat", "Marcos": "mar", "Lucas": "luc", "João": "joa", "Atos": "ato",
    "Romanos": "rom", "1 Coríntios": "1co", "2 Coríntios": "2co", "Gálatas": "gal", "Efésios": "efe",
    "Filipenses": "fil", "Colossenses": "col", "1 Tessalonicenses": "1te", "2 Tessalonicenses": "2te",
    "1 Timóteo": "1ti", "2 Timóteo": "2ti", "Tito": "tit", "Filemom": "flm", "Hebreus": "heb",
    "Tiago": "tia", "1 Pedro": "1pe", "2 Pedro": "2pe", "1 João": "1jo", "2 João": "2jo",
    "3 João": "3jo", "Judas": "jud", "Apocalipse": "apo"
};

// Elementos do DOM
const levelInfoElement = document.getElementById('levelInfo');
const progressInfoElement = document.getElementById('progressInfo');
const questionElement = document.getElementById('question');
const alternativesElement = document.getElementById('alternatives');
const submitButton = document.getElementById('submitButton');
const resultElement = document.getElementById('result');
const gameContainer = document.getElementById('gameContainer');
const albumContainer = document.getElementById('albumContainer');
const bookInfoElement = document.getElementById('bookInfo');
const phaseInfoElement = document.getElementById('phaseInfo');
const questionIndicatorElement = document.getElementById('questionIndicator');

let selectedAlternative = null; // Variável para armazenar a alternativa selecionada

// Inicialização
document.addEventListener('DOMContentLoaded', initializeGame);

function initializeGame() {
    createCategorySelection(); // Chama a função para criar a seleção de categorias
}

function createCategorySelection() {
    albumContainer.innerHTML = `<h2>Selecione uma Categoria</h2>`;
    
    const categories = [
        'Pentateuco', 'Históricos', 'Poéticos', 
        'ProfetasMaiores', 'ProfetasMenores', 
        'Evangelhos', 'Histórico', 'Cartas', 'Revelação'
    ];

    // Cria um contêiner flexível para os botões
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexWrap = 'wrap'; // Permite que os botões quebrem para a próxima linha
    buttonContainer.style.justifyContent = 'center'; // Centraliza os botões

    categories.forEach(category => {
        const button = document.createElement('button');
        button.style.margin = '10px'; // Margem entre os botões
        button.style.border = 'none'; // Remove borda
        button.style.background = 'none'; // Remove fundo
        button.style.width = '100px'; // Largura do botão
        button.style.height = '150px'; // Altura do botão
        button.style.overflow = 'hidden'; // Oculta qualquer parte da imagem que exceda o botão
        button.style.position = 'relative'; // Para posicionar a imagem
        button.style.cursor = 'pointer';

        // Cria uma imagem para o botão
        const categoryImage = document.createElement('img');
        categoryImage.src = `images/${category}.png`; // Define a imagem correspondente à categoria
        categoryImage.style.width = '470%'; // Mantém a imagem em 200% da largura do botão
        categoryImage.style.height = 'auto'; // Mantém a proporção original
        categoryImage.style.position = 'absolute'; // Posiciona a imagem
        categoryImage.style.top = '50%'; // Centraliza verticalmente
        categoryImage.style.left = '50%'; // Centraliza horizontalmente
        categoryImage.style.transform = 'translate(-50%, -50%)'; // Ajusta a posição da imagem

        button.appendChild(categoryImage);
        button.onclick = () => showBooksInCategory(category);
        
        buttonContainer.appendChild(button);
    });

    albumContainer.appendChild(buttonContainer); // Adiciona o contêiner de botões ao álbum
}




function showBooksInCategory(category) {
    const booksInCategory = books[category];
    albumContainer.innerHTML = `<h2>${category}</h2>`;

    // Cria um contêiner flexível para os botões
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexWrap = 'wrap'; // Permite que os botões quebrem para a próxima linha
    buttonContainer.style.justifyContent = 'center'; // Centraliza os botões

    booksInCategory.forEach(book => {
        const bookButton = document.createElement('button');
        bookButton.style.margin = '0px';
        bookButton.style.border = 'none'; // Remove borda
        bookButton.style.background = 'none'; // Remove fundo
        bookButton.style.width = '250px'; // Aumenta a largura do botão
        bookButton.style.height = '150px'; // Mantém a altura do botão
        bookButton.style.overflow = 'hidden'; // Oculta qualquer parte da imagem que exceda o botão
        bookButton.style.position = 'relative'; // Para posicionar a imagem
        bookButton.style.fontSize = '16px'; // Aumenta o tamanho da fonte

        // Cria uma imagem para o botão
        const bookImage = document.createElement('img');
        bookImage.src = `images/${bookFileNames[book]}.png`;
        bookImage.style.width = '200%'; // Mantém a imagem em 300% da largura do botão
        bookImage.style.height = 'auto'; // Mantém a proporção original
        bookImage.style.position = 'absolute'; // Posiciona a imagem
        bookImage.style.top = '50%'; // Centraliza verticalmente
        bookImage.style.left = '50%'; // Centraliza horizontalmente
        bookImage.style.transform = 'translate(-50%, -50%)'; // Ajusta a posição da imagem

        bookButton.appendChild(bookImage);
        bookButton.onclick = () => startBookQuiz(book);
        buttonContainer.appendChild(bookButton);
    });

    albumContainer.appendChild(buttonContainer); // Adiciona o contêiner de botões ao álbum

    // Adiciona o botão de voltar
    const backButton = document.createElement('button');
    backButton.textContent = 'Voltar';
    backButton.onclick = createCategorySelection; // Volta para a seleção de categorias
    albumContainer.appendChild(backButton);
}






function createAlbum() {
    albumContainer.innerHTML = `<h2>Nível ${currentLevel}</h2>`;
    books.forEach(book => {
        const bookElement = document.createElement('button');
        bookElement.classList.add('book-item');

        // Cria uma imagem para o botão
        const bookImage = document.createElement('img');
        bookImage.src = `images/${bookFileNames[book]}.png`;
        bookImage.style.width = '250px'; // Ajuste conforme necessário
        bookImage.style.height = 'auto'; // Mantém a proporção

        bookElement.appendChild(bookImage);
        bookElement.addEventListener('click', () => startBookQuiz(book));

        if (completedBooks.includes(book)) {
            bookElement.classList.add('completed'); // Adiciona a classe para mudar a cor
        }
        albumContainer.appendChild(bookElement);
    });

    // Adiciona o botão de reiniciar
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Reiniciar Nível 1';
    restartButton.style.fontSize = '24px';
    restartButton.style.padding = '10px';
    restartButton.style.marginTop = '20px';
    restartButton.style.backgroundColor = '#FF5733'; // Cor do botão
    restartButton.style.color = 'white';
    restartButton.style.border = 'none';
    restartButton.style.borderRadius = '5px';
    restartButton.style.cursor = 'pointer';
    restartButton.onclick = restartLevel; // Chama a função de reiniciar

    albumContainer.appendChild(restartButton); // Adiciona o botão ao álbum
}

function restartLevel() {
    currentLevel = 1;
    completedBooks = [];
    bookProgress = {};

    localStorage.removeItem('completedBooks');
    salvarProgresso(); // Adicione esta linha para salvar o progresso

    createAlbum();
    updateProgress();
}


function startBookQuiz(book) {
    currentBook = book;
    currentPhase = 1;
    if (!bookProgress[book]) {
        bookProgress[book] = { phase1: false, phase2: false };
    }
    albumContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    fetchQuestions(book, currentPhase);
}

async function fetchQuestions(book, phase) {
    try {
        const bookCode = bookFileNames[book];
        const levelPrefix = LEVEL_PREFIXES[currentLevel];
        const phaseCode = phase === 1 ? 'C' : 'v';
        const fileName = `data/${levelPrefix}.${phaseCode}${bookCode}${currentLevel}.json`;
        
        console.log(`Carregando perguntas de: ${fileName}`);

        const response = await fetch(fileName);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allQuestions = await response.json();
        if (!Array.isArray(allQuestions)) {
            throw new Error("Formato de perguntas inválido.");
        }

        currentQuestions = shuffleArray(allQuestions).slice(0, 10);
        currentQuestionIndex = 0;
        score = 0;
        showQuizInterface();
        loadQuestion();
        updateBookAndPhaseInfo(); // Atualiza informações do livro e fase
    } catch (error) {
        console.error('Erro ao carregar as perguntas:', error);
        alert(`Erro ao carregar as perguntas para ${book}: ${error.message}`);
        endBook();
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateBookAndPhaseInfo() {
    bookInfoElement.textContent = `Livro: ${currentBook}`; // Atualiza o livro
    phaseInfoElement.textContent = `Fase: ${currentPhase}`; // Atualiza a fase
}

function showQuizInterface() {
    gameContainer.style.display = 'block';
    submitButton.style.display = 'block';
    resultElement.textContent = '';
}

function loadQuestion() {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    questionIndicatorElement.textContent = `Questão ${currentQuestionIndex + 1} de ${currentQuestions.length}`; // Indicação da questão
    questionElement.textContent = currentQuestion.pergunta; // Pergunta centralizada
    alternativesElement.innerHTML = '';

    // Embaralha as alternativas
    const shuffledAlternatives = shuffleArray(currentQuestion.alternativas);

    shuffledAlternatives.forEach((alt) => {
        const button = document.createElement('button');
        button.textContent = alt;
        button.addEventListener('click', () => selectAlternative(button));
        alternativesElement.appendChild(button);
    });

    selectedAlternative = null; // Reseta a alternativa selecionada
    submitButton.disabled = true; // Desabilita o botão de envio
}

function selectAlternative(selectedButton) {
    const buttons = alternativesElement.getElementsByTagName('button');
    for (let button of buttons) {
        button.classList.remove('selected'); // Remove a classe 'selected' de todos os botões
    }
    selectedButton.classList.add('selected'); // Adiciona a classe 'selected' ao botão clicado
    selectedAlternative = selectedButton.textContent; // Armazena a alternativa selecionada
    submitButton.disabled = false; // Habilita o botão de envio
}

submitButton.addEventListener('click', () => {
    if (selectedAlternative) {
        checkAnswer();
    }
});

function checkAnswer() {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correta;

    // Verificar se a resposta está correta
    const buttons = alternativesElement.getElementsByTagName('button');
    for (let button of buttons) {
        button.classList.remove('correct', 'incorrect', 'not-selected'); // Remove classes anteriores
        if (button.textContent === correctAnswer) {
            button.classList.add('correct'); // Adiciona classe para a resposta correta
        } else if (button.textContent === selectedAlternative) {
            button.classList.add('incorrect'); // Adiciona classe para a resposta incorreta
        }
    }

    // Atualiza a pontuação se a resposta estiver correta
    if (selectedAlternative === correctAnswer) {
        score++; // Incrementa a pontuação
    }

    // Exibir referência após a resposta
    const referenceDiv = document.createElement('div');
    referenceDiv.textContent = `Referência: ${currentQuestion.referencia}`;
    referenceDiv.style.marginTop = '10px'; // Adiciona um espaço acima da referência
    alternativesElement.appendChild(referenceDiv);

    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        setTimeout(loadQuestion, 2000); // Aguarda 2 segundos antes de carregar a próxima pergunta
    } else {
        setTimeout(showResults, 2000);
    }
}

function showResults() {
    const percentage = (score / currentQuestions.length) * 100; // Calcula a porcentagem de acertos
    questionElement.textContent = `Você acertou ${score} de ${currentQuestions.length} perguntas (${percentage.toFixed(2)}%).`;
    alternativesElement.innerHTML = '';
    submitButton.style.display = 'none'; // Oculta o botão de enviar resposta

    if (currentPhase === 1) {
        if (percentage >= 70) {
            displayMessage('Parabéns! Você completou a Fase 1. Clique no botão abaixo para ir para a Fase 2.', true);
            showTransitionButton('Ir para a Fase 2', goToPhase2);
            salvarProgresso(); // Salva o progresso após completar a Fase 1
        } else {
            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'Você não atingiu a pontuação necessária para completar a Fase 1. Tente novamente.';
            errorMessage.style.color = 'red'; // Cor da mensagem
            errorMessage.style.marginBottom = '10px'; // Espaço abaixo da mensagem
            alternativesElement.appendChild(errorMessage); // Adiciona a mensagem acima do botão

            showTryAgainButton(restartPhase1); // Botão para tentar novamente na fase 1
        }
    } else if (currentPhase === 2) {
        if (percentage >= 70) {
            displayMessage('Parabéns! Você completou o livro!', true);
            if (!completedBooks.includes(currentBook)) {
                bookProgress[currentBook].completed = true; // Marca o livro como completo
                completedBooks.push(currentBook); // Adiciona o livro à lista de concluídos
                
                // Atualiza o estado do livro no álbum
                const bookElement = Array.from(document.querySelectorAll('.book-item')).find(el => el.textContent === currentBook);
                if (bookElement) {
                    bookElement.classList.add('completed'); // Adiciona a classe para mudar a cor
                }

                // Atualiza o progresso
                updateProgress();
                localStorage.setItem('completedBooks', JSON.stringify(completedBooks)); // Salva no localStorage
                salvarProgresso(); // Salva o progresso após completar o livro
            }

            // Botão para finalizar livro
            showTransitionButton('Finalizar Livro', endBook);
        } else {
            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'Você não atingiu a pontuação necessária para completar a Fase 2. Tente novamente.';
            errorMessage.style.color = 'red'; // Cor da mensagem
            errorMessage.style.marginBottom = '10px'; // Espaço abaixo da mensagem
            alternativesElement.appendChild(errorMessage); // Adiciona a mensagem acima do botão

            showTryAgainButton(restartPhase2); // Botão para tentar novamente na fase 2
        }
    }
    
    // Salva o progresso independentemente do resultado
    salvarProgresso();
}


function showTryAgainButton(restartFunction) {
    const button = document.createElement('button');
    button.textContent = 'Tentar Novamente';
    button.style.fontSize = '24px';
    button.style.padding = '20px';
    button.style.marginTop = '20px';
    button.style.backgroundColor = '#007BFF'; // Azul
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.onclick = () => {
        restartFunction();
        button.remove(); // Remove o botão após o clique
    };

    document.body.appendChild(button); // Adiciona o botão à tela
}

function restartPhase1() {
    currentQuestionIndex = 0; // Reinicia o índice das perguntas
    score = 0; // Reinicia a pontuação
    fetchQuestions(currentBook, 1); // Carrega as perguntas da fase 1
}

function restartPhase2() {
    currentQuestionIndex = 0; // Reinicia o índice das perguntas
    score = 0; // Reinicia a pontuação
    fetchQuestions(currentBook, 2); // Carrega as perguntas da fase 2
}

function showTransitionButton(text, callback) {
   
    const button = document.createElement('button');
    button.textContent = text;
    button.style.fontSize = '24px';
    button.style.padding = '20px';
    button.style.marginTop = '20px';
    button.style.backgroundColor = '#4CAF50'; // Verde
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.onclick = () => {
        callback();
        button.remove(); // Remove o botão após o clique
    };

    document.body.appendChild(button); // Adiciona o botão à tela
}

function goToPhase2() {
    currentPhase = 2; // Atualiza a fase atual para 2
    clearMessages(); // Limpa mensagens antes de carregar a fase 2
    fetchQuestions(currentBook, currentPhase); // Carrega as perguntas da fase 2
}

function endBook() {
    clearMessages();
    gameContainer.style.display = 'none';
    albumContainer.style.display = 'block';
    createAlbum();

    const bookElement = Array.from(document.querySelectorAll('.book-item')).find(el => el.textContent === currentBook);
    if (bookElement) {
        bookElement.classList.add('completed');
    }
    
    localStorage.setItem('completedBooks', JSON.stringify(completedBooks));
    salvarProgresso(); // Adicione esta linha para salvar o progresso
}


function clearMessages() {
    const messageDivs = document.querySelectorAll('.message');
    messageDivs.forEach(div => div.remove()); // Remove todas as mensagens exibidas
}

function updateLevelInfo() {
    levelInfoElement.textContent = `Nível: ${currentLevel}`;
}

function updateProgress() {
    const totalBooks = books.length; // Total de livros
    const completedCount = completedBooks.length; // Livros concluídos
    progressInfoElement.textContent = `Progresso: ${completedCount}/${totalBooks} livros`; // Atualiza a informação de progresso
}

function displayMessage(message, isSuccess) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.classList.add('message'); // Adiciona a classe para estilização
    messageDiv.style.color = isSuccess ? 'green' : 'red'; // Cor do texto baseado no sucesso
    messageDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // Fundo claro
    messageDiv.style.border = '2px solid #ccc'; // Contorno
    messageDiv.style.borderRadius = '10px'; // Bordas arredondadas
    messageDiv.style.padding = '10px'; // Preenchimento
    alternativesElement.appendChild(messageDiv); // Adiciona a mensagem ao DOM
}