/*!
    * Start Bootstrap - SB Admin v7.0.7 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2023 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    // 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});
function logout() {
    sessionStorage.removeItem('isLoggedIn');
    localStorage.removeItem('usuarioActual');
    window.location.href = 'login.html';
}

const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

const nombre = usuarioActual.name; 
const apellido = usuarioActual.apellido;
const avatar = usuarioActual.avatar;

const loginname = document.getElementById('loginname');

loginname.innerHTML = `
        <div class="small">Iniciaste sesión como:</div>
    <div class="d-flex align-items-center">
        <img src="${avatar}" alt="Avatar" class="avatar-img me-2" />
        <span>${nombre} ${apellido}</span>
    </div>`
    ;
    