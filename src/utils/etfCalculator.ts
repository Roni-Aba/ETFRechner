export type ETFResult = {
    endkapital: number;
    eingezahlt: number; 
    gewinn: number; 
}

export function berechneETFSparplan(
    sparrate: number,
    monate:number,
    renditeProJahr: number
): ETFResult { 
    const monatzins = Math.pow(1 + renditeProJahr / 100, 1 / 12) - 1;

    const endkapital = 
        sparrate * ((Math.pow(1+ monatzins, monate)-1)/monatzins);

    const eingezahlt = sparrate * monate; 
    const gewinn = endkapital - eingezahlt; 
    
    return {
        endkapital: Number(endkapital.toFixed(2)),
        eingezahlt,
        gewinn:Number(gewinn.toFixed(2))
    }
}
