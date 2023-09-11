let components = {
    container: document.querySelector('.game_body-poly'),
    content: document.querySelector('.body_poly-content'),
    result: document.querySelector('.result'),
    countStep: document.querySelector('.game_panel-count-text'),
    progress: document.querySelector('.progress'),
    btnUbpate: document.querySelector('.game_button_refresh'),
    wins: document.querySelector('.wins'),
    resultUbpate: document.querySelector('.button_refresh'),
    bustTransfer: document.querySelector('.bust_transfer'),
    tails: [],
};
function setLight(bust){
    bust.classList.add('light_bust');
}
function setNight(bust){
    bust.classList.remove('light_bust');
}
function setCurrentProgress() {
    components.progress.style.width = Math.min((100 / config.countProgress) * player.result, 100) + '%';
}
function setCountStep() {
    player.countSteps = Math.min(player.countSteps + 1, config.maxcountSteps);
    components.countStep.innerHTML = config.maxcountSteps - player.countSteps;
}
function createContentPage() {
    components.content.style.height = (config.tailSize * config.countCols) + 'px';
    components.content.style.width = (config.tailSize * config.countRows) + 'px';
    components.content.addEventListener('click', handlerTail);
}
function updateResult() {
    components.result.innerHTML = player.result;
}
function updateCountRefresh() {
    components.resultUbpate.innerHTML = config.maxCountUpdates - player.countUpdates;
}
function createTail(t, l, row, col, color, isBomb = false) {
    let tail = document.createElement('div');
    tail.id = config.tailIdPrefix + '_' + row + '_' + col;
    tail.classList.add(config.tailClass);
    if (isBomb) tail.classList.add('bomb');
    tail.style.top = l + 'px';
    tail.style.left = t + 'px';
    tail.style.width = config.tailSize + 'px';
    tail.style.height = config.tailSize + 'px';
    tail.style.willChange = 'transform';
    let coin = document.createElement('div');
    coin.classList.add('coin');
    coin.style.backgroundColor = isBomb ? 'black' : color;
    if (isBomb) {
        coin.style.boxShadow = `1px -1px 2px black, 2px -2px 2px black, 4px -4px 2px black,inset 0 0 5px 4px rgba(161, 161, 161, 0.592)`;
    } else {
        coin.style.boxShadow = `1px -1px 2px ${color}, 2px -2px 2px ${color}, 4px -4px 2px ${color},inset 0 0 5px 4px rgba(161, 161, 161, 0.592)`;
    }
    tail.append(coin);

    let blick = document.createElement('div');
    blick.classList.add('blick');
    coin.append(blick);

    let bi = document.createElement('div');
    if (isBomb)
        bi.innerHTML = `<img src="imag/pow.png" width="40" height="40" />`;
    else
        bi.innerHTML = `<svg width="100%" height="100%" fill="currentColor" class="bi" viewBox="0 0 16 16"> <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/> </svg>`;
    coin.append(bi);
    components.content.append(tail);
}
function movingTails(player) {
    for (let x = 0; x < components.content.children.length; x++) {
        const s = components.content.children[x];
        if (s.classList.contains('tail'))
            s.style.top = s.getAttribute('id').split('_')[2] * config.tailSize + 'px';
        s.style.left = s.getAttribute('id').split('_')[1] * config.tailSize + 'px';
    }
    player.countMovsCol = {};
    player.nodesForMove.length = 0;

}
function deleteNode() {
    let deleteNode = document.querySelectorAll('.remove');
    player.result += deleteNode.length;
    for (let el of deleteNode) {
        el.remove();
    }
}