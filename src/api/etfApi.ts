const API_KEY = "Z6SZZZSO9U76F1BO";

export type ETFPreis = {
  date: string;
  close: number;
};

export async function fetchETFPerformance(
  ticker: string,
  start: string,
  end: string
): Promise<ETFPreis[]> {
  const url = `https://www.alphavantage.co/query?function=MONTHLY_ADJUSTED&symbol=${ticker}&apikey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data["Error Message"]) {
    throw new Error("Ungültiger ETF-Ticker");
  }

  if (data["Note"]) {
    throw new Error("API-Limit erreicht – bitte später erneut versuchen");
  }

  const series = data["Monthly Adjusted Time Series"];
  if (!series) {
    throw new Error("Keine Kursdaten vom Anbieter erhalten");
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  const preise: ETFPreis[] = Object.entries(series)
    .map(([date, values]: any) => ({
      date,
      close: Number(values["5. adjusted close"]),
    }))
    .filter((p) => {
      const d = new Date(p.date);
      return d >= startDate && d <= endDate;
    })
    .sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  if (preise.length < 2) {
    throw new Error(
      "Für den gewählten Zeitraum sind keine ausreichenden Kursdaten vorhanden"
    );
  }

  return preise;
}