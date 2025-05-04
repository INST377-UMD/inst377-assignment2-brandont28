//Generates random quote on home page upon every refresh
function getQuote() {
    //Fetches Quote
    fetch(`https://zenquotes.io/api/random`)
    .then((resp) => resp.json())
    .then((data) => {
        const randomQuote = data;
        document.getElementById('quote').textContent = randomQuote[0].q + ' - ' + randomQuote[0].a ;
    });
}

//Generate stock chart function based on user input of Ticker and day count
async function generateStockChart(tickerArg = null) {
    const apiKey = 'lIqWG9GF8NXdidRfJ0Nx53ICFEfvBsoU';
    const ticker = tickerArg || document.getElementById('ticker').value;
    const days = document.getElementById('days').value || 30;

    //Converts date format to be usable in Polygon API
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${start}/${end}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`);
    const data = await response.json();

    //Converts date format again for labels
    const labels = data.results.map(d => new Date(d.t).toISOString().split('T')[0]);
    const prices = data.results.map(d => d.c);

    const ctx = document.getElementById('stockChart');
    //Prevents errors if a new chart is drawn while canvas is occupied
    if (window.chart) window.chart.destroy();

    //Generates chart using date as x and prices as y
    window.chart = new Chart(ctx, {
        type: 'line',
        data: {
        labels,
        datasets: [{
            label: `($) Stock Price`,
            data: prices,
            borderColor: 'blue',
            fill: false
        }]
        }
    });
}

//Fetches top 5 Reddit stocks and appends to table
function top5Stocks () {
    //Fetches only top 5 reddit stocks
    fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
        .then(resp => resp.json())
        .then(data => {
        const top5 = data.slice(0, 5);

        //Creates elements that will be appended to the table
        top5.forEach(stock => {
            const stockTable = document.getElementById('redditStocks');
            const tableRow = document.createElement('tr');
            const ticker = document.createElement('td');
            const tickerLink = document.createElement('a');

            tickerLink.href = `https://finance.yahoo.com/quote/${stock.ticker}`;
            tickerLink.textContent = stock.ticker;
            ticker.appendChild(tickerLink);

            const comments = document.createElement('td');
            comments.textContent = stock.no_of_comments;

            const sentiments = document.createElement('td');
            const icon = document.createElement('img');

            //Conditional, if bullish then bull icon is used, if bearish, bear icon used
            if (stock.sentiment == 'Bullish') {
                icon.src = 'https://static.thenounproject.com/png/3328202-200.png';
            } else if (stock.sentiment == 'Bearish') {
                icon.src = 'https://static.thenounproject.com/png/3328203-200.png';
            }
            sentiments.appendChild(icon);

            //Appends to the stockTable
            tableRow.appendChild(ticker);
            tableRow.appendChild(comments);
            tableRow.appendChild(sentiments);
            stockTable.append(tableRow);
            })
        });  
}

//Fetches random dog images and creates a simple carousel that rotates images based on time
function randomDogs () {
    //Fetches 10 random dog pictures on window load and adds to the carousel
    fetch('https://dog.ceo/api/breeds/image/random/10')
    .then((resp) => resp.json())
    .then((data) => {
    
        const dogCarousel = document.getElementById('dogCarousel');

        data.message.forEach(imgUrl => {
            const img = document.createElement('img');
            img.src = imgUrl;
            dogCarousel.appendChild(img);
        })
        simpleslider.getSlider();
    });
}

//Stores globally to allow for voice command to work outside of dogBreeds function
let breeds = [];
let breedInfo;

//Dog Button functions
function dogBreeds () {
    fetch('https://dogapi.dog/api/v2/breeds')
    .then((resp) => resp.json())
    .then((data) => {
        breeds = data.data;
        const dogButtonsContainer = document.getElementsByClassName('dogButtons-container')[0];
        breedInfo = document.getElementsByClassName('breedInfo')[0];

        breeds.forEach(breed => {
            const button = document.createElement('button');
            button.textContent = breed.attributes.name;
            button.setAttribute('class', 'breed-button');

            button.addEventListener('click', () => {
                breedInfo.innerHTML = `
                <h1>Name: ${breed.attributes.name}</h1>
                <h2>Description: ${breed.attributes.description}</h2>
                <h2>Min Life: ${breed.attributes.life.min}</h2>
                <h2>Max Life: ${breed.attributes.life.max}</h2>
                `;
                breedInfo.style.display = 'block';
            })
            dogButtonsContainer.appendChild(button);
        });
    });
}

//Annyang Audio Commands
let commandsAdded = false;

document.addEventListener('DOMContentLoaded', () => {
    const onButton = document.getElementById('listeningOn');
    const offButton = document.getElementById('listeningOff');
    
    if (annyang && onButton && offButton) {
        const commands = {

            //Hello World Alert
            'hello': () => {alert('Hello World');
            },
        
            //Changes background color of the page
            'change the color to *color': (color) => {
                document.body.style.backgroundColor = color;
            },
        
            //Changes webpage
            'navigate to *page': (page) => {
                const lowercasePage = page.toLowerCase();
                const pages = {
                    home: 'INST377_assignment2_home.html',
                    stocks: 'INST377_assignment2_stocks.html',
                    dogs: 'INST377_assignment2_dogs.html'
                };
        
                if (pages[lowercasePage]) {
                    window.location.href = pages[lowercasePage];
                }
            },
        
            //Inputs ticker and calls generateStockChart function
            'look up *ticker': (ticker) => {
                const tickerFormatted = ticker.toUpperCase().replace(/\s/g, '');
        
                const userInput = document.getElementById('ticker');
                if (userInput) userInput.value = tickerFormatted;
                    
                if (typeof generateStockChart == 'function') {
                    generateStockChart(tickerFormatted)
                }
            },
        
            //Loads breedInfo box for said breed
            'load dog breed *breedName': (breedName) => {
                const breedFormatted = breedName.trim().toLowerCase();
                const breed = breeds.find(b => b.attributes.name.toLowerCase() === breedFormatted);
                    
                if (breed) {
                    breedInfo.innerHTML = `
                        <h1>Name: ${breed.attributes.name}</h1>
                        <h2>Description: ${breed.attributes.description}</h2>
                        <h2>Min Life: ${breed.attributes.life.min}</h2>
                        <h2>Max Life: ${breed.attributes.life.max}</h2>
                    `;
                    breedInfo.style.display = 'block';
                }
            }};
    
        //Enables voice control through buttons in audio box
        onButton.addEventListener('click', () => {
            if (!commandsAdded) {
                annyang.addCommands(commands);
                commandsAdded = true;
            }
            annyang.start({ autoRestart: true, continuous: true });
        });
    
        offButton.addEventListener('click', () => {
            annyang.abort();
        });
    }
});

window.onload = function(){
    getQuote();
    top5Stocks();
    randomDogs();
    dogBreeds();
}