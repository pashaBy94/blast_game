document.body.addEventListener("mousemove", tinyEyeball);
function tinyEyeball(event) {
    let tinyEye = document.querySelectorAll(".tinyEye");
    tinyEye.forEach(function (tinyEye) {

        let eyeWidth = tinyEye.getBoundingClientRect().left + tinyEye.clientWidth / 2;
        let eyeHeight = tinyEye.getBoundingClientRect().top + tinyEye.clientHeight / 2;
        let radian = Math.atan2(event.pageX - eyeWidth, event.pageY - eyeHeight);

        let rot = radian * (190 / Math.PI) * -1 + 280; tinyEye.style.transform = "rotate(" + rot + "deg)";
    });
}
function setWins() {
    document.querySelector('.wins').style.display = 'flex';
    document.querySelector('.wrap').style.display = 'none';
    document.querySelector('.wins').addEventListener('click', closeWins);
}
function closeWins() {
    document.querySelector('.wins').style.display = 'none';
    document.querySelector('.wrap').style.display = 'block';

    document.querySelector('.wins').removeEventListener('click', closeWins);

}