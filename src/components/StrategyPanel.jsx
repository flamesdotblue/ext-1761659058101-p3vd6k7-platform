import { Settings } from 'lucide-react';

export default function StrategyPanel({
  capital,
  onCapitalChange,
  feeBps,
  onFeeBpsChange,
  maxSlippageBps,
  onMaxSlippageBpsChange,
  autoScan,
  onAutoScanChange,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <Settings className="h-4 w-4 text-white/60" />
        <h2 className="text-lg font-semibold">Strategy</h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-xs text-white/70">Capital per Trade (USD)</label>
          <input
            type="number"
            min={10}
            step={10}
            value={capital}
            onChange={(e) => onCapitalChange(Number(e.target.value))}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none ring-emerald-500 focus:ring"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs text-white/70">Fees (basis points)</label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={feeBps}
            onChange={(e) => onFeeBpsChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-1 text-xs text-white/60">{(feeBps / 100).toFixed(2)}% total fees</div>
        </div>

        <div>
          <label className="mb-2 block text-xs text-white/70">Max Slippage (basis points)</label>
          <input
            type="range"
            min={0}
            max={200}
            step={5}
            value={maxSlippageBps}
            onChange={(e) => onMaxSlippageBpsChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-1 text-xs text-white/60">{(maxSlippageBps / 100).toFixed(2)}%</div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs text-white/70">Auto-scan</label>
          <button
            onClick={() => onAutoScanChange(!autoScan)}
            className={
              'relative inline-flex h-6 w-11 items-center rounded-full transition ' +
              (autoScan ? 'bg-emerald-500/80' : 'bg-white/10')
            }
          >
            <span
              className={
                'inline-block h-5 w-5 transform rounded-full bg-black transition ' +
                (autoScan ? 'translate-x-6' : 'translate-x-1')
              }
            />
          </button>
        </div>
      </div>
    </div>
  );
}
