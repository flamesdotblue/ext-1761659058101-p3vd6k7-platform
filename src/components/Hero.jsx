import Spline from '@splinetool/react-spline';
import { Rocket } from 'lucide-react';

export default function Hero({ onStart }) {
  return (
    <header className="relative h-[70vh] w-full overflow-hidden md:h-[80vh]">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/44zrIZf-iQZhbQNQ/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      </div>

      <div className="relative z-10 flex h-full w-full items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Live DeFi Arbitrage Interface
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
            Discover market inefficiencies across DEXs
          </h1>
          <p className="mt-4 text-base text-white/80 md:text-lg">
            Visualize price spreads, configure execution constraints, and simulate net returns under fees and slippage.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-medium text-black transition hover:bg-emerald-400"
            >
              <Rocket className="h-4 w-4" /> Start Scanner
            </button>
            <a
              href="#"
              className="rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 backdrop-blur transition hover:bg-white/10"
              onClick={(e) => e.preventDefault()}
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
