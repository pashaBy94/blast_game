let wrap = document.querySelector('.wrap');
let logo = document.querySelector('.logo');

setTimeout(()=>{
    logo.classList.add('logo_show')
    setTimeout(()=>{
        logo.classList.add('logo_hidden')
        wrap.classList.add('wrap_show')
        },2000)//2000
},4000);///4000