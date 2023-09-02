const config = {
    countRows: 8,
    countCols: 8,
    countTailWins: 2,
    countColors: 6,
    maxCountUpdates: 3,
    countProgress: 50,
    maxcountSteps: 10,
    tailSize: 200,
    tailClass: 'tail',
    tailIdPrefix: 'tail',
    movingItems: 0,
    states: ['bustTransfer', 'games']
};
class Player {
    constructor() {
        this.colorTail = [];
        this.result = 0;
        this.state = '';
        this.countUpdates = 0;
        this.countSteps = 0;
        this.removeTails = [];
        this.nodesForMove = [];
        this.countMovsCol = {};
        this.data = { move: [] };
    }
}
let player = new Player();
initGame();

function isHaveCountStep() {
    return player.countSteps < config.maxcountSteps
}
function isFullProgress() {
    return player.result >= config.countProgress
}
function initGame() {
    setColor();
    createContentPage();
    createGrid();
    updateCountRefresh();
    components.btnUbpate.addEventListener('click', updategrid);
    components.bustTransfer.addEventListener('click', () => {
        setLight(components.bustTransfer);
        setState('bustTransfer');
    })
    setState('games');
    components.countStep.innerHTML = config.maxcountSteps;
}
function newGame() {
    player = new Player();
    setColor();
    createGrid();
    updateCountRefresh();
    updateResult();
    setCurrentProgress();
    setState('games');
    components.btnUbpate.addEventListener('click', updategrid);
    components.countStep.innerHTML = config.maxcountSteps;
}
function setState(name) {
    player.state = name;
}
function updategrid() {
    player.countUpdates = Math.min(player.countUpdates + 1, config.maxCountUpdates);
    if (config.maxCountUpdates === player.countUpdates) {
        components.btnUbpate.removeEventListener('click', updategrid);
    }
    if (config.maxCountUpdates - player.countUpdates >= 0)
        createGrid();
    updateCountRefresh();
    if (!isStillMove() && player.countUpdates === config.maxCountUpdates && !isFullProgress()) {
        setTimeout(() => {
            setFail();
            newGame();
        }, 800)
    }
}
function createGrid() {
    for (let i = 0; i < config.countRows; i++) {
        components.tails[i] = new Array();
        for (let j = 0; j < config.countCols; j++) {
            components.tails[i][j] = -1;
        }
    }
    components.content.innerHTML = '';
    for (let i = 0; i < config.countRows; i++) {
        for (let j = 0; j < config.countCols; j++) {
            components.tails[i][j] = Math.floor(Math.random() * (config.countColors));
            createTail(i * config.tailSize, j * config.tailSize, i, j, player.colorTail[components.tails[i][j]], paintBomb())
        }
    }
}
function transferBust(row, col) {
    player.nodesForMove.push(document.querySelector('#tail_' + row + '_' + col));
    player.data.move.push('tail_' + row + '_' + col);
    if (player.nodesForMove.length === 2) {
        if (Math.abs(player.data.move[0].split('_')[1] - player.data.move[1].split('_')[1]) <= 1 &&
            Math.abs(player.data.move[0].split('_')[2] - player.data.move[1].split('_')[2]) <= 1) {
            [
                components.tails[player.data.move[0].split('_')[1]][player.data.move[0].split('_')[2]],
                components.tails[player.data.move[1].split('_')[1]][player.data.move[1].split('_')[2]]
            ] = [
                    components.tails[player.data.move[1].split('_')[1]][player.data.move[1].split('_')[2]],
                    components.tails[player.data.move[0].split('_')[1]][player.data.move[0].split('_')[2]]
                ]
            player.nodesForMove[0].id = player.data.move[1];
            player.nodesForMove[1].id = player.data.move[0];
            setTimeout(() => {
                movingTails(player)
            }, 200)
        }
        setState('games');
        player.data.move.length = 0;
        player.nodesForMove.length = 0;
        setNight(components.bustTransfer);
    }

}
function handlerTail(event) {
    const target = event.target.closest('.tail');
    let row = parseInt(target.getAttribute('id').split('_')[1]);
    let col = parseInt(target.getAttribute('id').split('_')[2]);
    switch (player.state) {
        case 'bustTransfer':
            transferBust(row, col);
            break;
        case 'games':
            if (target) {
                if (target.classList.contains('bomb')) {
                    bombFire(row, col);
                    deleteAndPrintTails();
                } else {
                    if (getHavMoreTail(row, col)) {
                        deleteAndPrintTails();
                    }
                }
            }
            break;
        default:
            break;
    }
}
function bombFire(row, col) {
    const grid = components.tails;
    const fairTail = [[row, col], [row, col - 1], [row, col + 1], [row - 1, col], [row + 1, col], [row + 1, col + 1], [row + 1, col - 1], [row - 1, col + 1], [row - 1, col - 1]];
    fairTail.forEach(tail => {
        if (isFinite(components.tails?.[tail[0]]?.[tail[1]])) {
            grid[tail[0]][tail[1]] = -11;
            player.removeTails.push(config.tailIdPrefix + '_' + tail[0] + '_' + tail[1]);
        }
    })

}
function deleteAndPrintTails() {
    paintEmpty();
    setTimeout(() => {
        removedTails();
        deleteNode();
        paintTails();
        setTimeout(() => {
            movingTails(player);
            updateResult();
            setCurrentProgress();
            setCountStep();
            if (isFullProgress() && isHaveCountStep()) {
                setTimeout(() => {
                    setWins();
                    newGame();
                }, 800)
            }
            if (!isFullProgress() && !isHaveCountStep()) {
                setTimeout(() => {
                    setFail();
                    newGame();
                }, 800)
            }
            if (!isStillMove() && player.countUpdates === config.maxCountUpdates && !isFullProgress() && !isHaveCountStep()) {
                setTimeout(() => {
                    setFail();
                    newGame();
                }, 800)
            }
        }, 200)
    }, 500);
}
function getHavMoreTail(row, col) {
    const grid = components.tails;
    let selectTail = components.tails[row][col];
    let countTail = 0;
    findMoreTail(grid, row, col);
    function findMoreTail(grid, row, col) {
        player.removeTails.push(config.tailIdPrefix + '_' + row + '_' + col);
        grid[row][col] = -11;
        countTail++;
        if (components.tails[row][col - 1] === selectTail) findMoreTail(grid, row, col - 1)
        if (components.tails[row][col + 1] === selectTail) findMoreTail(grid, row, col + 1)
        if (components.tails?.[row - 1]?.[col] === selectTail) findMoreTail(grid, row - 1, col)
        if (components.tails?.[row + 1]?.[col] === selectTail) findMoreTail(grid, row + 1, col)
    }
    if (countTail < config.countTailWins) {
        grid[row][col] = selectTail;
        player.removeTails.length = 0;
        return false
    } else {
        return true
    }
}
function paintEmpty() {
    const nodes = components.content.children;
    for (let i = 0; i < nodes.length; i++) {
        if (player.removeTails.includes(nodes[i].getAttribute('id'))) {
            nodes[i].classList.add('delete_tail');
            nodes[i].classList.add('remove')
        }
    }
}
function removedTails() {
    const sortRemoveTails = player.removeTails.sort((a, b) => a.split('_')[2] - b.split('_')[2]);
    for (let i = 0; i < sortRemoveTails.length; i++) {
        let row = parseInt(sortRemoveTails[i].split('_')[1]);
        let col = parseInt(sortRemoveTails[i].split('_')[2]);
        if (!player.countMovsCol[row])
            player.countMovsCol[row] = 1
        else {
            player.countMovsCol[row]++
        }
        components.tails[row].splice(col, 1);
        components.tails[row].unshift(Math.floor(Math.random() * (config.countColors)));
    }
    for (let i = 0; i < sortRemoveTails.length; i++) {
        let row = parseInt(sortRemoveTails[i].split('_')[1]);
        let col = parseInt(sortRemoveTails[i].split('_')[2]);
        for (let j = 0; j < col; j++) {
            if (!player.nodesForMove.includes(document.querySelector('#tail_' + row + '_' + j)) && !document.querySelector('#tail_' + row + '_' + j).classList.contains('remove'))
                player.nodesForMove.push(document.querySelector('#tail_' + row + '_' + j))
        }
    }
    player.removeTails.length = 0;

}
function paintTails() {
    for (let i = 0; i < Object.keys(player.countMovsCol).length; i++) {
        let tailsForMov = document.querySelectorAll(`[id^='tail_${Object.keys(player.countMovsCol)[i]}_']`);
        let arr = [...tailsForMov].sort((a, b) => a.id.split('_')[2] - b.id.split('_')[2])
        for (let e = arr.length - 1, j = 0; e >= 0; e--, j++) {
            arr[e].id = 'tail_' + Object.keys(player.countMovsCol)[i] + '_' + (config.countCols - 1 - j);
        }
    }
    for (let i in player.countMovsCol) {
        for (let j = player.countMovsCol[i]; j > 0; j--) {
            createTail(i * config.tailSize, (-j) * config.tailSize, i, player.countMovsCol[i] - j, player.colorTail[components.tails[i][player.countMovsCol[i] - j]], paintBomb())
        }
    }
}
function isStillMove() {
    for (let i = 0; i < config.countRows; i++) {
        for (let j = 0; j < config.countCols; j++) {
            const variabl = components.tails[i][j];
            if (components.tails[i]?.[j - 1] === variabl) return true
            if (components.tails[i]?.[j + 1] === variabl) return true
            if (components.tails?.[i - 1]?.[j] === variabl) return true
            if (components.tails?.[i + 1]?.[j] === variabl) return true
        }
    }
    return false
}
