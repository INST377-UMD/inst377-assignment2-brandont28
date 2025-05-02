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

    console.log(start);
    console.log(end);

    const response = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${start}/${end}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`);
    const data = await response.json();

    //Converts date format again for labels
    const labels = data.results.map(d => new Date(d.t).toISOString().split('T')[0]);
    const prices = data.results.map(d => d.c);

    const ctx = document.getElementById('stockChart');
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