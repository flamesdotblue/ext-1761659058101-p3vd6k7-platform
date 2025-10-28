import { useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';

const EXCHANGES = ['UniswapV3', 'Sushi', 'Curve', 'Raydium', 'Jupiter', 'Pancake', 'Quickswap', 'Velodrome', 'Camelot'];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function simulatePrices(pair) {
  // Produce a base mid price per pair and a slight spread between two random venues
  const [ex1, ex2] = pickTwo(EXCHANGES);
  const base = basePriceFor(pair);
  // simulate deviation +/- 1%
  const p1 = base * (1 + randomBetween(-0.006, 0.006));
  const p2 = base * (1 + randomBetween(-0.006, 0.006));
  return { pair, venues: [
    { name: ex1, price: Number(p1.toFixed(4)) },
    { name: ex2, price: Number(p2.toFixed(4)) },
  ] };
}

function basePriceFor(pair) {
  if (pair.includes('ETH')) return 3200;
  if (pair.includes('BTC')) return 65000;
  if (pair.includes('SOL')) return 150;
  if (pair.includes('MATIC')) return 0.8;
  if (pair.includes('ARB')) return 1.2;
  if (pair.includes('OP')) return 2.5;
  return 100;
}

function pickTwo(arr) {
  const i = Math.floor(Math.random() * arr.length);
  let j = Math.floor(Math.random() * arr.length);
  while (j === i) j = Math.floor(Math.random() * arr.length);
  return [arr[i], arr[j]];
}

function computeArb(op, params) {
  const { capital, feeBps, maxSlippageBps } = params;
  const [a, b] = op.venues;
  const buy = a.price < b.price ? a : b;
  const sell = a.price < b.price ? b : a;
  const spread = (sell.price - buy.price) / buy.price; // raw spread
  const totalBps = feeBps + maxSlippageBps; // conservative
  const cost = totalBps / 10000;
  const net = spread - cost;
  const profitUsd = Math.max(0, net * capital);
  return {
    pair: op.pair,
    buyOn: buy.name,
    sellOn: sell.name,
    buyPrice: buy.price,
    sellPrice: sell.price,
    spreadPct: spread * 100,
    netPct: net * 100,
    profitUsd,
  };
}

export default function OpportunityScanner({ selectedPairs, params }) {
  const [rows, setRows] = useState([]);
  const [isScanning, setIsScanning] = useState(params.autoScan);
  const timerRef = useRef(null);

  const scan = () => {
    const universe = selectedPairs.length ? selectedPairs : [];
    const updates = universe.map((p) => simulatePrices(p)).map((op) => computeArb(op, params));
    // sort by highest profit
    updates.sort((a, b) => b.profitUsd - a.profitUsd);
    setRows(updates);
  };

  useEffect(() => {
    setIsScanning(params.autoScan);
  }, [params.autoScan]);

  useEffect(() => {
    if (isScanning) {
      scan();
      timerRef.current = setInterval(scan, 3000);
      return () => clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isScanning, selectedPairs, params]);

  const hasProfits = useMemo(() => rows.some((r) => r.profitUsd > 0), [rows]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Opportunities</h2>
          <p className="text-xs text-white/60">Net after fees and slippage. Sorted by potential PnL.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={
            'inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs ' +
            (isScanning ? 'bg-emerald-500/10 text-emerald-300' : 'bg-white/10 text-white/70')
          }>
            <span className={
              'h-2 w-2 rounded-full ' + (isScanning ? 'bg-emerald-400' : 'bg-white/30')
            } /> {isScanning ? 'Live' : 'Paused'}
          </span>
          <button
            onClick={() => setIsScanning((s) => !s)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10"
          >
            <RefreshCw className="h-3.5 w-3.5" /> {isScanning ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 text-xs text-white/60">
            <tr>
              <th className="px-3 py-2">Pair</th>
              <th className="px-3 py-2">Buy @</th>
              <th className="px-3 py-2">Sell @</th>
              <th className="px-3 py-2">Spread</th>
              <th className="px-3 py-2">Net</th>
              <th className="px-3 py-2">Est. PnL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-b border-white/5">
                <td className="px-3 py-2 font-medium">{r.pair}</td>
                <td className="px-3 py-2 text-white/80">
                  <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70">{r.buyOn}</span>
                  <span className="ml-2">${r.buyPrice.toLocaleString()}</span>
                </td>
                <td className="px-3 py-2 text-white/80">
                  <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70">{r.sellOn}</span>
                  <span className="ml-2">${r.sellPrice.toLocaleString()}</span>
                </td>
                <td className="px-3 py-2 {r.spreadPct >= 0 ? 'text-emerald-300' : 'text-rose-300'}">
                  {r.spreadPct >= 0 ? '+' : ''}{r.spreadPct.toFixed(2)}%
                </td>
                <td className={"px-3 py-2 " + (r.netPct >= 0 ? 'text-emerald-300' : 'text-rose-300')}>
                  {r.netPct >= 0 ? '+' : ''}{r.netPct.toFixed(2)}%
                </td>
                <td className={"px-3 py-2 font-semibold " + (r.profitUsd > 0 ? 'text-emerald-300' : 'text-white/70')}>
                  {r.profitUsd > 0 ? '+' : ''}${r.profitUsd.toFixed(2)}
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-white/60">No data yet. Click Resume to start scanning.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!hasProfits && rows.length > 0 && (
        <div className="mt-3 rounded-lg border border-amber-400/20 bg-amber-400/10 p-3 text-xs text-amber-200">
          No net-positive opportunities under current fees and slippage. Try adjusting strategy parameters.
        </div>
      )}
    </div>
  );
}
