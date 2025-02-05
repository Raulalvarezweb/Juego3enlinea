// variables de la pantalla de inicio
const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaJuego = document.getElementById("pantalla-juego");
const comenzarJuegoBtn = document.getElementById("comenzar-juego");

// Variables del juego
let playerSymbol = "X";
let aiSymbol = "O";
let currentPlayer;
let boardState;
let cells = [];
let board, status, resetButton;

// Evento para comenzar el juego
comenzarJuegoBtn.addEventListener("click", function () {
    pantallaInicio.style.display = "none"; // Oculta la pantalla de inicio
    pantallaJuego.style.display = "block"; // Muestra el juego

    inicializarJuego(); // Llama a la función que crea el tablero y los elementos
});

// Función para inicializar los elementos del juego
function inicializarJuego() {
    pantallaJuego.innerHTML = ""; // Limpia el contenido para evitar duplicados

    // Crear título
    const title = document.createElement("h1");
    title.textContent = "Juego: Tres en Raya";
    pantallaJuego.appendChild(title);

    // Crear botones de selección
    const chooseX = document.createElement("button");
    const chooseO = document.createElement("button");

    chooseX.textContent = "Jugar como X";
    chooseO.textContent = "Jugar como O";

    chooseX.addEventListener("click", () => startGame("X"));
    chooseO.addEventListener("click", () => startGame("O"));

    pantallaJuego.appendChild(chooseX);
    pantallaJuego.appendChild(chooseO);

    // Crear el tablero
    board = document.createElement("div");
    board.id = "board";
    board.style.display = "grid";
    board.style.gridTemplateColumns = "repeat(3, 100px)";
    board.style.gridTemplateRows = "repeat(3, 100px)";
    board.style.gap = "5px";
    board.style.margin = "20px auto";
    pantallaJuego.appendChild(board);

    // Crear estado del juego
    status = document.createElement("p");
    status.id = "status";
    status.textContent = "Elige tu símbolo";
    pantallaJuego.appendChild(status);

    // Crear botón de reinicio (este siempre debe existir)
    resetButton = document.createElement("button");
    resetButton.id = "resetButton";
    resetButton.textContent = "Reiniciar Juego";
    resetButton.style.display = "block"; // Asegurar que siempre esté visible
    resetButton.addEventListener("click", () => inicializarJuego());
    pantallaJuego.appendChild(resetButton);

    // Reiniciar tablero y variables
    boardState = ["", "", "", "", "", "", "", "", ""];
    cells = [];

    // Crear celdas del tablero
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.style.display = "flex";
        cell.style.alignItems = "center";
        cell.style.justifyContent = "center";
        cell.style.border = "1px solid #333";
        cell.style.fontSize = "24px";
        cell.style.fontWeight = "bold";
        cell.style.cursor = "pointer";
        cell.style.backgroundColor = "#f9f9f9";
        cell.addEventListener("click", handleMove);
        board.appendChild(cell);
        cells.push(cell);
    }
}

// Función para iniciar el juego con el símbolo elegido
function startGame(symbol) {
    playerSymbol = symbol;
    aiSymbol = symbol === "X" ? "O" : "X";
    currentPlayer = "X";

    // Ocultar solo los botones de selección, pero NO el de reinicio
    pantallaJuego.querySelectorAll("button").forEach(btn => {
        if (btn.id !== "resetButton") btn.style.display = "none";
    });

    // Reiniciar tablero
    boardState.fill("");
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("taken");
        cell.addEventListener("click", handleMove);
    });

    status.textContent = `Turno del jugador ${currentPlayer}`;

    // Si la IA comienza, hacer su primer movimiento
    if (currentPlayer === aiSymbol) setTimeout(aiMove, 500);
}

// Manejo de movimientos
function handleMove(event) {
    if (currentPlayer !== playerSymbol) return;
    const cell = event.target;
    const index = cell.dataset.index;
    if (boardState[index] !== "") return;

    makeMove(index, playerSymbol);
    if (!checkGameOver()) setTimeout(aiMove, 500);
}

// Movimiento de la IA (aleatorio)
function aiMove() {
    let availableMoves = boardState.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    if (availableMoves.length === 0) return;
    let randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeMove(randomIndex, aiSymbol);
    checkGameOver();
}

// Realizar un movimiento en el tablero
function makeMove(index, symbol) {
    boardState[index] = symbol;
    cells[index].textContent = symbol;
    cells[index].classList.add("taken");
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.textContent = `Turno del jugador ${currentPlayer}`;
}

// Verificar si hay un ganador o empate
function checkGameOver() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of winningCombinations) {
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            status.textContent = `¡Jugador ${boardState[a]} ha ganado!`;
            disableBoard();
            return true;
        }
    }

    if (boardState.every(cell => cell !== "")) {
        status.textContent = "¡Es un empate!";
        return true;
    }
    return false;
}

// Desactivar tablero después de una victoria
function disableBoard() {
    cells.forEach(cell => cell.removeEventListener("click", handleMove));
}
