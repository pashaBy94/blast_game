function generetRandomColor() {
    let arr = ['2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E'];
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += arr[Math.floor(Math.random() * (13))]
    }
    return color
}
function setColor() {
    for (let i = 0; i < config.countColors; i++) {
        player.colorTail.push(generetRandomColor())
    }
}
function paintBomb() {
    let a = Math.random() * 100;
    return a < 3
}