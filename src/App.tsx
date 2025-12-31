import { useEffect, useState } from "react";
import {
  berechneETFSparplan,
  berechneJahresDiagramm,
  berechneRenditeAusPreisen,
  type ETFResult,
  type JahresDiagramm,
} from "./utils/etfCalculator";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { fetchETFPerformance } from "./api/etfApi";

function App() {

  const [sparrate, setSparrate] = useState<number>(100);
  const [monate, setMonate] = useState<number>(30);
  const [rendite, setRendite] = useState<number>(7);

  const [selectedETF, setSelectedETF] = useState<string>("");

  const [result, setResult] = useState<ETFResult | null>(null);
  const [diagrammDaten, setDiagrammDaten] = useState<JahresDiagramm[]>([]);

  const formatEuro = (value: number) =>
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(value);


  useEffect(() => {
    if (!selectedETF) return;

    fetchETFPerformance(selectedETF)
      .then((preise) => {
        const renditeETF = berechneRenditeAusPreisen(
          preise.map((p) => p.close)
        );

        setRendite(renditeETF);

        const diagramm = berechneJahresDiagramm(
          sparrate,
          monate,
          renditeETF
        );

        const berechnung = berechneETFSparplan(
          sparrate,
          monate,
          renditeETF
        );

        setDiagrammDaten(diagramm);
        setResult(berechnung);
      })
      .catch(console.error);
  }, [selectedETF, sparrate, monate]);

  function handleBerechnen() {
    const berechnung = berechneETFSparplan(
      sparrate,
      monate,
      rendite
    );

    const diagramm = berechneJahresDiagramm(
      sparrate,
      monate,
      rendite
    );

    setDiagrammDaten(diagramm);
    setResult(berechnung);
  }
  
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1>ETF Sparplan Rechner</h1>

      <div>
        <label>
          Sparrate (€):
          <input
            type="number"
            value={sparrate}
            onChange={(e) => setSparrate(Number(e.target.value))}
            min={0}
          />
        </label>
      </div>

      <div>
        <label>
          Laufzeit (Monate):
          <input
            type="number"
            value={monate}
            onChange={(e) => setMonate(Number(e.target.value))}
            min={1}
          />
        </label>
      </div>

      <div>
        <label>
          Rendite (% p.a.):
          <input
            type="number"
            value={rendite}
            onChange={(e) => setRendite(Number(e.target.value))}
            disabled={!!selectedETF}
          />
        </label>
        {selectedETF && <small> Rendite wird aus ETF-Daten berechnet</small>}
      </div>

      <div>
        <label>
          ETF auswählen:
          <select
            value={selectedETF}
            onChange={(e) => setSelectedETF(e.target.value)}
          >
            <option value="">– kein ETF –</option>
            <option value="IVV">S&P 500 (IVV)</option>
            <option value="URTH">MSCI World (URTH)</option>
            <option value="QQQ">NASDAQ 100 (QQQ)</option>
          </select>
        </label>
      </div>

      <button
        onClick={handleBerechnen}
        disabled={sparrate <= 0 || monate <= 0}
      >
        Berechnen
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Ergebnis</h2>
          <p>Eingezahlt: {formatEuro(result.eingezahlt)}</p>
          <p>Endkapital: {formatEuro(result.endkapital)}</p>
          <p>Gewinn: {formatEuro(result.gewinn)}</p>
        </div>
      )}

      {diagrammDaten.length > 0 && (
        <div style={{ width: "100%", height: 350, marginTop: 40 }}>
          <h3>Vermögensentwicklung</h3>

          <ResponsiveContainer>
            <BarChart data={diagrammDaten}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jahr" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  typeof value === "number"
                    ? formatEuro(value)
                    : ""
                }
              />
              <Bar dataKey="einzahlung" stackId="a" fill="#059669" />
              <Bar dataKey="wertsteigerung" stackId="a" fill="#065f46" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default App;