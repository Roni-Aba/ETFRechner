export type ETFResult = {
    endkapital: number;
    eingezahlt: number; 
    gewinn: number; 
}

export type Jahreswert = {
    jahr: number; 
    kapital: number; 
};

export type JahresDiagramm = {
    jahr: number; 
    einzahlung: number; 
    wertsteigerung: number; 
}

export function berechneJahresDiagramm(
    sparrate: number, 
    monate: number, 
    renditeProJahr: number
): JahresDiagramm[] { 
    const monatZins = Math.pow(1+ renditeProJahr / 100, 1 / 12)-1;

    let kapital = 0; 
    let eingezahlt = 0; 
    const daten: JahresDiagramm[] = []

    for (let monat = 1; monat <= monate; monat++){
        eingezahlt += sparrate; 
        kapital = kapital * (1 + monatZins) + sparrate; 

        if (monat % 12 === 0){
            daten.push({
                jahr: monat / 12,
                einzahlung: Number(eingezahlt.toFixed(2)),
                wertsteigerung: Number((kapital - eingezahlt).toFixed(2)),
            })
        }
    }
    return daten; 
}


export function berechneJahresentwicklung(
    sparrate: number,
    monate: number, 
    renditeProJahr: number
): Jahreswert[] {
    const monatzins = Math.pow(1 + renditeProJahr / 100, 1 /12)-1;

    let kapital = 0; 
    const daten: Jahreswert[] = []; 

    for(let monat = 1; monat <= monate; monat++) {
        kapital = kapital * (1+ monatzins) + sparrate; 

        if (monat % 12 === 0){
            daten.push({
                jahr: monat / 12,
                kapital: Number(kapital.toFixed(2)),
            });
        }
    }
    return daten; 
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
