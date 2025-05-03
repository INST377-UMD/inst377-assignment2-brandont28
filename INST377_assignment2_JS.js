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
async function generateStockChart() {
    const apiKey = 'lIqWG9GF8NXdidRfJ0Nx53ICFEfvBsoU';
    const ticker = document.getElementById('ticker').value;
    const days = document.getElementById('days').value;

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

//Top 5 Reddit stocks function
function top5Stocks () {
    //Fetches only top 5 reddit stocks
    fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
        .then(resp => resp.json())
        .then(data => {
        const top5 = data.slice(0, 5);
        console.log(top5);

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

window.onload = function(){
    getQuote();
    top5Stocks();
    randomDogs();
}