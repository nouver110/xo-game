let isPlayerX = true; // البداية مع X
let gameActive = true; // اللعبة نشطة
let board = ['', '', '', '', '', '', '', '', '']; // الخانات الفارغة
let aiEnabled = false; // تمكين الذكاء الاصطناعي

// عناصر واجهة المستخدم
const cells = document.querySelectorAll('.cell');
const gameResult = document.getElementById('result-text');
const mainContainer = document.querySelector('.main-container');
const gameContainer = document.getElementById('game-board');
const restartButton = document.querySelector('.result button:first-child');
const backButton = document.querySelector('.result button:last-child');
const playerVsFriendButton = document.getElementById('play-friend');
const playerVsAIButton = document.getElementById('play-ai');

// الأحداث عند الضغط على الأزرار
playerVsFriendButton.addEventListener('click', () => startGame(false));  // اللعب ضد صديق
playerVsAIButton.addEventListener('click', () => startGame(true));      // اللعب ضد الذكاء الاصطناعي
restartButton.addEventListener('click', restartGame);
backButton.addEventListener('click', backToMainPage);

// بدء اللعبة
function startGame(isAI) {
    aiEnabled = isAI;
    mainContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    board = ['', '', '', '', '', '', '', '', ''];
    isPlayerX = true;
    gameActive = true;
    gameResult.textContent = 'النتيجة: ';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.disabled = false;
    });
}

// التعامل مع الخانات
function handleCellClick(cell) {
    const index = cell.getAttribute('data-index');
    
    if (board[index] === '' && gameActive) {
        board[index] = isPlayerX ? 'X' : 'O';
        cell.textContent = isPlayerX ? 'X' : 'O';
        cell.disabled = true;
        checkWinner();
        isPlayerX = !isPlayerX;

        if (aiEnabled && !isPlayerX && gameActive) {
            setTimeout(aiMove, 500); // تأخير الذكاء الاصطناعي نصف ثانية
        }
    }
}

// تحقق من الفائز
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameResult.textContent = `${board[a]} فاز!`;
            gameActive = false;
            return;
        }
    }

    if (!board.includes('')) {
        gameResult.textContent = 'تعادل!';
        gameActive = false;
    }
}

// الذكاء الاصطناعي المتقدم
function aiMove() {
    const bestMove = getBestMove(board, 'O');
    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    cells[bestMove].disabled = true;
    checkWinner();
    isPlayerX = !isPlayerX;
}

// العثور على أفضل حركة باستخدام Minimax
function getBestMove(board, currentPlayer) {
    const bestMove = minimax(board, currentPlayer, -Infinity, Infinity, true);
    return bestMove.index;
}

// خوارزمية Minimax مع Alpha-Beta Pruning
function minimax(board, currentPlayer, alpha, beta, isMaximizing) {
    const availableMoves = getAvailableMoves(board);

    // إذا كان هناك فائز
    const winner = checkWinnerForBoard(board);
    if (winner === 'X') {
        return { score: -10 }; // خسارة
    } else if (winner === 'O') {
        return { score: 10 }; // فوز
    } else if (availableMoves.length === 0) {
        return { score: 0 }; // تعادل
    }

    let bestMove = { score: isMaximizing ? -Infinity : Infinity };

    for (const move of availableMoves) {
        board[move] = currentPlayer;
        const result = minimax(board, currentPlayer === 'O' ? 'X' : 'O', alpha, beta, !isMaximizing);
        board[move] = ''; // إرجاع الخانة إلى حالتها الأصلية

        if (isMaximizing) {
            if (result.score > bestMove.score) {
                bestMove = { score: result.score, index: move };
            }
            alpha = Math.max(alpha, bestMove.score);
        } else {
            if (result.score < bestMove.score) {
                bestMove = { score: result.score, index: move };
            }
            beta = Math.min(beta, bestMove.score);
        }

        if (beta <= alpha) {
            break; // تقليم الشجرة
        }
    }

    return bestMove;
}

// الحصول على الحركات المتاحة
function getAvailableMoves(board) {
    return board.map((value, index) => value === '' ? index : null).filter(index => index !== null);
}

// التحقق من الفائز
function checkWinnerForBoard(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return null;
}

// إعادة اللعبة
function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    isPlayerX = true;
    gameActive = true;
    gameResult.textContent = 'النتيجة: ';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.disabled = false;
    });
}

// العودة إلى الصفحة الرئيسية
function backToMainPage() {
    mainContainer.style.display = 'block';
    gameContainer.style.display = 'none';
}
