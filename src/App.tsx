import {useState} from 'react';
import { berechneETFSparplan, type ETFResult } from './utils/etfCalculator';

console.log(berechneETFSparplan(100,360,7));

function App() {
  const [sparrate, setSparrate] = useState<number>(100);
  const [monate, setMonate] = useState<number>(30);
  const [rendite, setRendite] = useState<number>(7);
  const [result, setResult] = useState<ETFResult | null>(null);

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
  </div>
);

  
}

export default App;