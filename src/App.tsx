import { useState } from "react";
import {
  berechneETFSparplan,
  berechneJahresDiagramm,
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





function App() {
  const [sparrate, setSparrate] = useState<number>(100);
  const [monate, setMonate] = useState<number>(30);
  const [rendite, setRendite] = useState<number>(7);
  const [result, setResult] = useState<ETFResult | null>(null);
  const [diagrammDaten, setDiagrammDaten] = useState<JahresDiagramm[]>([]);

  const formatEuro = (value: number) => 
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR"
    }).format(value);


  function handleBerechnen(){
    const berechnung = berechneETFSparplan(
      sparrate,
      monate, 
      rendite
    );

    const diagramm = berechneJahresDiagramm(
      sparrate, 
      monate, 
      rendite 
    )

    setDiagrammDaten(diagramm);
    setResult(berechnung);
  }

  return (
  <div>
    <div>
      <label>
        Sparrate (€):
        <input
          type="number"
          value={sparrate}
          onChange={(e) => setSparrate(Number(e.target.value))}
          min={0}
          step={1}
        />
      </label>
    </div>

    <div>
      <label>
        Laufzeit (in Monaten):
        <input
          type="number"
          value={monate}
          onChange={(e) => setMonate(Number(e.target.value))}
          min={1}
          step={1}
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
        />
      </label>
    </div>

    <button onClick={handleBerechnen} disabled={sparrate <=0 || monate <= 0}>
      Berechnen
    </button>


    {result && (
      <div>
        <h2>Ergebnis</h2>
        <p>Eingezahlt: {formatEuro(result.eingezahlt)} </p>
        <p>Endkapital: {formatEuro(result.endkapital)} </p>
        <p>Gewinn: {formatEuro(result.gewinn)} </p>
      </div>
    )}

    {diagrammDaten.length > 0 && (
  <div style={{ width: "100%", height: 350 }}>
    <h3>Vermögensentwicklung</h3>

    <ResponsiveContainer>
      <BarChart data={diagrammDaten}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="jahr" />
        <YAxis />
        <Tooltip
          formatter={(value) => {
            if (typeof value !== "number") return "";

            return new Intl.NumberFormat("de-DE", {
              style: "currency",
              currency: "EUR",
            }).format(value);
          }}
        />

        <Bar
          dataKey="einzahlung"
          stackId="a"
          fill="#059669"
        />

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