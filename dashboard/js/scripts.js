function fetchtable() {
    let url = 'https://673b7874339a4ce4451c54ba.mockapi.io'
    fetch(url)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
}