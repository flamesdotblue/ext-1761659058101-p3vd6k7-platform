import { useMemo } from 'react';

const ALL_PAIRS = [
  { symbol: 'ETH/USDC', chains: ['Ethereum', 'Arbitrum'], dexes: ['UniswapV3', 'Sushi'] },
  { symbol: 'BTC/USDT', chains: ['Ethereum', 'BSC'], dexes: ['Curve', 'Pancake'] },
  { symbol: 'SOL/USDC', chains: ['Solana', 'Ethereum (Wormhole)'], dexes: ['Raydium', 'Jupiter', 'UniswapV3'] },
  { symbol: 'MATIC/USDC', chains: ['Polygon'], dexes: ['Quickswap', 'UniswapV3'] },
  { symbol: 'ARB/ETH', chains: ['Arbitrum'], dexes: ['Camelot', 'UniswapV3'] },
  { symbol: 'OP/USDC', chains: ['Optimism'], dexes: ['Velodrome', 'UniswapV3'] },
];

export default function MarketPairs({ selected, onChange }) {
  const groups = useMemo(() => {
    const map = new Map();
    ALL_PAIRS.forEach((p) => {
      const chainKey = p.chains[0];
      if (!map.has(chainKey)) map.set(chainKey, []);
      map.get(chainKey).push(p);
    });
    return Array.from(map.entries());
  }, []);

  const toggle = (symbol) => {
    if (selected.includes(symbol)) onChange(selected.filter((s) => s !== symbol));
    else onChange([...selected, symbol]);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Market Pairs</h2>
          <p className="text-xs text-white/60">Select assets to include in scanning.</p>
        </div>
        <button
          className="text-xs text-emerald-400 hover:text-emerald-300"
          onClick={() => onChange(ALL_PAIRS.map((p) => p.symbol))}
        >
          Select all
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {groups.map(([chain, pairs]) => (
          <div key={chain} className="rounded-xl border border-white/10 p-4">
            <h3 className="mb-3 text-sm font-medium text-white/80">{chain}</h3>
            <div className="flex flex-wrap gap-2">
              {pairs.map((p) => {
                const active = selected.includes(p.symbol);
                return (
                  <button
                    key={p.symbol}
                    onClick={() => toggle(p.symbol)}
                    className={
                      'rounded-full border px-3 py-1 text-xs transition ' +
                      (active
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10')
                    }
                    title={`DEXes: ${p.dexes.join(', ')}`}
                  >
                    {p.symbol}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
