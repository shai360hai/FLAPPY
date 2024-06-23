const gameContainer = document.getElementById('gameContainer');
const dot = document.getElementById('dot');
let dotY = gameContainer.clientHeight / 2;
let dotVelocity = 0;
const gravity = 0.6;
const lift = -15;

let gameOver = false;

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameOver) {
        dotVelocity = lift;
    }
});

// Add touch event listener
document.addEventListener('touchstart', () => {
    if (!gameOver) {
        dotVelocity = lift;
    }
});

let pipes = [];
let frame = 0;

function createPipe() {
    const pipeGap = 150;
    const pipeHeight = Math.random() * (gameContainer.clientHeight - pipeGap);

    const topPipe = document.createElement('div');
    topPipe.className = 'pipe';
    topPipe.style.height = `${pipeHeight}px`;
    topPipe.style.top = '0';
    topPipe.style.left = '100%';

    const bottomPipe = document.createElement('div');
    bottomPipe.className = 'pipe';
    bottomPipe.style.height = `${gameContainer.clientHeight - pipeHeight - pipeGap}px`;
    bottomPipe.style.bottom = '0';
    bottomPipe.style.left = '100%';

    gameContainer.appendChild(topPipe);
    gameContainer.appendChild(bottomPipe);

    pipes.push({ topPipe, bottomPipe, x: gameContainer.clientWidth });
}

function update() {
    if (gameOver) return;

    frame++;

    // Move the dot
    dotVelocity += gravity;
    dotY += dotVelocity;

    if (dotY > gameContainer.clientHeight - 20) {
        dotY = gameContainer.clientHeight - 20;
        dotVelocity = 0;
    } else if (dotY < 0) {
        dotY = 0;
        dotVelocity = 0;
    }

    dot.style.top = `${dotY}px`;

    // Move and manage pipes
    if (frame % 90 === 0) {
        createPipe();
    }

    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2;
        pipes[i].topPipe.style.left = `${pipes[i].x}px`;
        pipes[i].bottomPipe.style.left = `${pipes[i].x}px`;

        if (pipes[i].x < -50) {
            gameContainer.removeChild(pipes[i].topPipe);
            gameContainer.removeChild(pipes[i].bottomPipe);
            pipes.splice(i, 1);
            i--;
        }

        // Check for collisions
        const dotRect = dot.getBoundingClientRect();
        const topPipeRect = pipes[i].topPipe.getBoundingClientRect();
        const bottomPipeRect = pipes[i].bottomPipe.getBoundingClientRect();

        if (
            dotRect.left < topPipeRect.left + topPipeRect.width &&
            dotRect.left + dotRect.width > topPipeRect.left &&
            (dotRect.top < topPipeRect.top + topPipeRect.height ||
                dotRect.top + dotRect.height > bottomPipeRect.top)
        ) {
            gameOver = true;
            alert('Game Over!');
            location.reload();
            break;
        }
    }

    requestAnimationFrame(update);
}

update();
