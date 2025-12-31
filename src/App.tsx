import {useState} from 'react';
import { berechneETFSparplan, type ETFResult } from './utils/etfCalculator';

console.log(berechneETFSparplan(100,360,7));

function App() {
  const [sparrate, setSparrate] = useState<number>(100);
  const [monate, setMonate] = useState<number>(30);
  const [rendite, setRendite] = useState<number>(7);
  const [result, setResult] = useState<ETFResult | null>(null);

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

    <button onClick={handleBerechnen}>
      Berechnen
    </button>


    {result && (
      <div>
        <h2>Ergebnis</h2>
        <p>Eingezahlt: {result.eingezahlt} €</p>
        <p>Endkapital: {result.endkapital} €</p>
        <p>Gewinn: {result.gewinn} €</p>
      </div>
    )}
  </div>
);

  
}

export default App;