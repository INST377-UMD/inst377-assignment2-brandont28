function getQuote() {

    //Fetches Quote
    fetch(`https://zenquotes.io/api/random`)
    .then((resp) => resp.json())
    .then((data) => {
        const randomQuote = data;
        document.getElementById('quote').textContent = randomQuote[0].q + ' - ' + randomQuote[0].a ;
    });
}

window.onload = getQuote;