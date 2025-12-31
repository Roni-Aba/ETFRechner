export type ETF = {
    name: string;
    ticker: string;
}

export const ETFS: ETF[] = [
  { name: "MSCI World (iShares)", ticker: "URTH" },
  { name: "MSCI World (Vanguard)", ticker: "VT" },
  { name: "S&P 500 (iShares)", ticker: "IVV" },
  { name: "FTSE All-World", ticker: "VWCE.DE" },
  { name: "NASDAQ 100", ticker: "QQQ"},
];