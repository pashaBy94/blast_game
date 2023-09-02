document.body.addEventListener("mousemove", tinyEyeball);
function tinyEyeball(event) {
    let tinyEye = document.querySelectorAll(".tinyEye");
    tinyEye.forEach(function (tinyEye) {

        let eyeWidth = tinyEye.getBoundingClientRect().left + tinyEye.clientWidth / 2;
        let eyeHeight = tinyEye.getBoundingClientRect().top + tinyEye.clientHeight / 2;
        let radian = Math.atan2(event.pageX - eyeWidth, event.pageY - eyeHeight);

        let rot = radian * (90 / Math.PI) * -1 + 280;
        tinyEye.style.transform = "rotate(" + rot + "deg)";
    });
}
function setFail() {
    document.querySelector('.fail').style.display = 'flex';
    document.querySelector('.wrap').style.display = 'none';
    document.querySelector('.fail').addEventListener('click', closeFail);
}
function closeFail() {
    document.querySelector('.fail').style.display = 'none';
    document.querySelector('.wrap').style.display = 'block';
    document.querySelector('.fail').removeEventListener('click', closeFail);

}