import {type ETF} from "../data/etfs";

type Props = { 
    etfs: ETF[];
    value: string; 
    onChange: (ticker:string) => void;
}

export function EtfSelect({ etfs, value, onChange}: Props) { 
    return ( 
        <select 
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">ETF auswählen</option>
            {etfs.map((etf) => (
                <option key={etf.ticker} value={etf.ticker}>
                    {etf.name}
                </option>
            ))}
            </select>
    )
}