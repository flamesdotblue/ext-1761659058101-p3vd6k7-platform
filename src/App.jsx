import { useRef, useState, useMemo } from 'react';
import Hero from './components/Hero';
import MarketPairs from './components/MarketPairs';
import StrategyPanel from './components/StrategyPanel';
import OpportunityScanner from './components/OpportunityScanner';

export default function App() {
  const scannerRef = useRef(null);
  const [selectedPairs, setSelectedPairs] = useState([
    'ETH/USDC',
    'BTC/USDT',
    'SOL/USDC',
  ]);
  const [capital, setCapital] = useState(1000);
  const [feeBps, setFeeBps] = useState(25); // 0.25%
  const [maxSlippageBps, setMaxSlippageBps] = useState(50); // 0.5%
  const [autoScan, setAutoScan] = useState(true);

  const params = useMemo(
    () => ({ capital, feeBps, maxSlippageBps, autoScan }),
    [capital, feeBps, maxSlippageBps, autoScan]
  );

  const scrollToScanner = () => {
    scannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Hero onStart={scrollToScanner} />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 gap-6 py-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MarketPairs selected={selectedPairs} onChange={setSelectedPairs} />
          </div>
          <div>
            <StrategyPanel
              capital={capital}
              onCapitalChange={setCapital}
              feeBps={feeBps}
              onFeeBpsChange={setFeeBps}
              maxSlippageBps={maxSlippageBps}
              onMaxSlippageBpsChange={setMaxSlippageBps}
              autoScan={autoScan}
              onAutoScanChange={setAutoScan}
            />
          </div>
        </section>

        <section ref={scannerRef} className="py-6">
          <OpportunityScanner
            selectedPairs={selectedPairs}
            params={params}
          />
          <p className="mt-4 text-xs text-neutral-400">This interface is for educational and research purposes. Crypto markets are volatile; always verify execution costs and risks before transacting.</p>
        </section>
      </main>
    </div>
  );
}
