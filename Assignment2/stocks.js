const form = document.getElementById("stock-form");
const ctx = document.getElementById("stockChart").getContext("2d");
let stockChart;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const ticker = document.getElementById("ticker").value.toUpperCase();
  const days = document.getElementById("range").value;

  const to = Math.floor(Date.now() / 1000);
  const from = to - days * 24 * 60 * 60;
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=YOUR_API_KEY`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results) throw new Error("No results found");

    const labels = data.results.map(p => new Date(p.t * 1000).toLocaleDateString());
    const prices = data.results.map(p => p.c);

    if (stockChart) stockChart.destroy();

    stockChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${ticker} Closing Prices`,
          data: prices,
          borderColor: 'blue',
          fill: false,
        }]
      },
      options: {
        responsive: true,
      }
    });
  } catch (err) {
    alert("Error fetching stock data: " + err.message);
  }
});

// Reddit Stocks Table
fetch("https://tradestie.com/api/v1/apps/reddit?date=2022-04-03")
  .then(res => res.json())
  .then(data => {
    const top5 = data.slice(0, 5);
    const tbody = document.getElementById("reddit-stocks");
    tbody.innerHTML = "";

    top5.forEach(stock => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><a href="https://finance.yahoo.com/lookup/?s=${stock.ticker}" target="_blank">${stock.ticker}</a></td>
        <td>${stock.no_of_comments}</td>
        <td class="${stock.sentiment.toLowerCase()}">
          ${stock.sentiment === "Bullish" ? "\uD83D\uDCB2" : "\u274C"} ${stock.sentiment}
        </td>
      `;
      tbody.appendChild(row);
    });
  });
