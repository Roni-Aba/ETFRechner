const API_KEY = "Z6SZZZSO9U76F1BO";

export async function fetchETFPerformance(ticker: string) {
  const url = `https://www.alphavantage.co/query?function=MONTHLY_ADJUSTED&symbol=${ticker}&apikey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  const series = data["Monthly Adjusted Time Series"];
  if (!series) throw new Error("Keine Daten");

  return Object.entries(series).map(([date, values]: any) => ({
    date,
    close: Number(values["5. adjusted close"]),
  }));
}

