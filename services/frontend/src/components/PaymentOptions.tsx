import { motion } from 'framer-motion';
import { NeoCard } from './NeoCard';

interface CryptoCurrency {
  symbol: string;
  name: string;
  icon: string;
  enabled: boolean;
  address: string;
}

const cryptoCurrencies: CryptoCurrency[] = [
  { symbol: '₿', name: 'Bitcoin', icon: '₿', enabled: true, address: 'bc1q8hkwgn3zft9m2734c5zn966drnluc3tuaw648g' },
  { symbol: '◎', name: 'Solana', icon: '◎', enabled: true, address: 'D4sgXyU6S2heMzKatUazeZ8iUseDkGx4vypz1kKRTXSX' },
  { symbol: 'USDC', name: 'USDC (Base)', icon: 'USDC', enabled: true, address: '0x1c1805Aa9f3c4252Be61a8b666C21d2607D61DdA' },
  { symbol: 'USDT', name: 'USDT (Ethereum)', icon: '₮', enabled: true, address: '0x9B025a18Ee207BD4c5c765c117B65FC59ED00DA4' },
];

interface PaymentOptionsProps {
  selectedCurrency?: string;
  onCurrencySelect?: (currency: CryptoCurrency) => void;
}

export function PaymentOptions({ selectedCurrency, onCurrencySelect }: PaymentOptionsProps) {
  return (
    <NeoCard className="bg-black">
      <div className="font-mono">
        <div className="text-[10px] text-neon-green/40 mb-4 border-b border-neon-green/10 pb-2">
          // payment_gateway_options
        </div>
        <div className="grid grid-cols-2 gap-3">
          {cryptoCurrencies.map((crypto) => (
            <motion.button
              key={crypto.symbol}
              whileHover={{ scale: crypto.enabled ? 1.02 : 1 }}
              whileTap={{ scale: crypto.enabled ? 0.98 : 1 }}
              onClick={() => crypto.enabled && onCurrencySelect?.(crypto)}
              disabled={!crypto.enabled}
              className={`
                p-3 border border-neon-green/20 rounded text-left transition-all
                ${crypto.enabled
                  ? 'hover:border-neon-green hover:bg-neon-green/5 cursor-pointer'
                  : 'opacity-40 cursor-not-allowed'
                }
                ${selectedCurrency === crypto.symbol ? 'border-neon-green bg-neon-green/10' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold text-neon-cyan">
                  {crypto.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white uppercase tracking-tight">
                    {crypto.symbol}
                  </div>
                  <div className="text-[10px] text-neon-green/60 uppercase tracking-wider">
                    {crypto.name}
                  </div>
                </div>
                {crypto.enabled ? (
                  <div className="text-[8px] text-neon-green/40">
                    [ENABLED]
                  </div>
                ) : (
                  <div className="text-[8px] text-red-500/40">
                    [DISABLED]
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
        <div className="mt-4 text-[9px] text-neon-green/30 text-center">
          SELECT PAYMENT CURRENCY FOR TRANSACTION
        </div>
      </div>
    </NeoCard>
  );
}