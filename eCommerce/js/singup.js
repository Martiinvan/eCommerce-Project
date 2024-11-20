const singupForm = document.getElementById('singupForm');
singupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // VEMOS LOS DATOS DEL FORMULARIO
    const name = document.getElementById('namein').value;
    const email = document.getElementById('emailin').value;
    const country = document.getElementById('countryin').value;
    const city = document.getElementById('cityin').value;
    const password = document.getElementById('passwordin').value;
    const phone = document.getElementById('phonein').value;
    const apellido = document.getElementById('apellidoin').value

    // último id registrado en la api
    fetch('https://673b7874339a4ce4451c54ba.mockapi.io/Usuario')
        .then(function (response) {
            return response.json();
        })
        .then(function (usuarios) {
            // Buscar si ya existe un usuario con ese email
            const emailExiste = usuarios.some(usuario => usuario.email === email);
                    
            if (emailExiste) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Email ya registrado',
                    text: 'El correo electrónico ya está en uso. Por favor, utiliza otro.',
                    confirmButtonText: 'Aceptar'
                });
                return Promise.reject('Email existente');
            }

            // nueva id para el usuario
            const nuevoId = usuarios.length > 0
                ? usuarios[usuarios.length - 1].id + 1
                : 1;

            // Crear nuevo usuario
            const newUser = {
                id: nuevoId,
                name: name,
                apellido: apellido,
                email: email,
                country: country,
                city: city,
                password: password,
                phone: phone,
                role: 'cliente',
                avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=' + email
            };

            // enviamos el usuario a la api
            return fetch('https://673b7874339a4ce4451c54ba.mockapi.io/Usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });
        })
        .then(function (createResponse) {
            if (createResponse.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Usuario Registrado!',
                    text: 'Tu cuenta ha sido creada exitosamente',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#3085d6'
                });
                singupForm.reset();
            } else {
                throw new Error('Error al registrar usuario');
            }
        })
        .catch(function (error) {
            if (error !== 'Email existente') {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Hubo un problema al registrar el usuario',
                    confirmButtonText: 'Intentar de nuevo'
                });
                console.error('Error:', error);
            }
        });
});