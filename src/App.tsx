import { useEffect, useMemo, useState } from "react";
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

function berechneMonate(start: string, ende: string): number {
  const startDate = new Date(start);
  const endDate = new Date(ende);

  const jahre = endDate.getFullYear() - startDate.getFullYear();
  const monate = endDate.getMonth() - startDate.getMonth();

  return Math.max(jahre * 12 + monate + 1, 0);
}

function App() {

  const [sparrate, setSparrate] = useState<number>(100);
  const [rendite, setRendite] = useState<number>(7);

  const [startDatum, setStartDatum] = useState<string>("2011-01-01");
  const [endDatum, setEndDatum] = useState<string>("2025-11-30");

  const [selectedETF, setSelectedETF] = useState<string>("");

  const [result, setResult] = useState<ETFResult | null>(null);
  const [diagrammDaten, setDiagrammDaten] = useState<JahresDiagramm[]>([]);


  const monate = useMemo(
    () => berechneMonate(startDatum, endDatum),
    [startDatum, endDatum]
  );

  const formatEuro = (value: number) =>
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(value);


async function handleBerechnen() {
  if (monate <= 0) return;

  try {
    let renditeFinal = rendite;

    if (selectedETF) {
      const preise = await fetchETFPerformance(
        selectedETF,
        startDatum,
        endDatum
      );

      renditeFinal = berechneRenditeAusPreisen(
        preise.map((p) => p.close)
      );

      if (!Number.isFinite(renditeFinal)) {
        throw new Error("Rendite konnte nicht berechnet werden");
      }

      setRendite(renditeFinal);
    }

    setResult(
      berechneETFSparplan(sparrate, monate, renditeFinal)
    );

    setDiagrammDaten(
      berechneJahresDiagramm(sparrate, monate, renditeFinal)
    );
  } catch (err) {
    console.error(err);
    alert(
      err instanceof Error
        ? err.message
        : "Unbekannter Fehler bei der Berechnung"
    );
  }
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
          Rendite (% p.a.):
          <input
            type="number"
            value={rendite}
            onChange={(e) => setRendite(Number(e.target.value))}
            disabled={!!selectedETF}
          />
        </label>
        {selectedETF && (
          <small> Rendite wird aus ETF-Daten berechnet</small>
        )}
      </div>

      <div>
        <label>
          Startdatum:
          <input
            type="date"
            value={startDatum}
            onChange={(e) => setStartDatum(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Enddatum:
          <input
            type="date"
            value={endDatum}
            onChange={(e) => setEndDatum(e.target.value)}
          />
        </label>
      </div>

      <p>
        Laufzeit: <strong>{monate}</strong> Monate
      </p>

      <button
        onClick={handleBerechnen}
        disabled={sparrate <= 0 || monate <= 0}
        style={{ marginTop: 20 }}
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
              <Bar
                dataKey="wertsteigerung"
                stackId="a"
                fill="#065f46"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default App;