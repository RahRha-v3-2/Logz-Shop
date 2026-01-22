import { motion } from 'framer-motion';
import { NeoCard } from './NeoCard';

interface CryptoCurrency {
  symbol: string;
  name: string;
  icon: string;
  enabled: boolean;
  address: string;
  network: string;
  color: string;
}

const cryptoCurrencies: CryptoCurrency[] = [
  {
    symbol: '₿',
    name: 'Bitcoin',
    icon: '₿',
    enabled: true,
    address: 'bc1q8hkwgn3zft9m2734c5zn966drnluc3tuaw648g',
    network: 'Bitcoin Network',
    color: 'text-orange-400'
  },
  {
    symbol: '◎',
    name: 'Solana',
    icon: '◎',
    enabled: true,
    address: 'D4sgXyU6S2heMzKatUazeZ8iUseDkGx4vypz1kKRTXSX',
    network: 'Solana Network',
    color: 'text-purple-400'
  },
  {
    symbol: 'USDC',
    name: 'USDC',
    icon: '⛽',
    enabled: true,
    address: '0x1c1805Aa9f3c4252Be61a8b666C21d2607D61DdA',
    network: 'Base Network',
    color: 'text-blue-400'
  },
  {
    symbol: 'USDT',
    name: 'USDT',
    icon: '₮',
    enabled: true,
    address: '0x9B025a18Ee207BD4c5c765c117B65FC59ED00DA4',
    network: 'Ethereum Network',
    color: 'text-green-400'
  },
];

interface PaymentOptionsProps {
  selectedCurrency?: string;
  onCurrencySelect?: (currency: CryptoCurrency) => void;
}

export function PaymentOptions({ selectedCurrency, onCurrencySelect }: PaymentOptionsProps) {
  return (
    <NeoCard className="bg-black/60 border-neon-cyan/20">
      <div className="font-mono">
        <div className="text-[10px] text-neon-cyan/40 mb-4 border-b border-neon-cyan/10 pb-2 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-neon-cyan/40 rounded-full animate-pulse"></div>
          // payment_gateway_options
        </div>
        <div className="grid grid-cols-2 gap-3">
          {cryptoCurrencies.map((crypto, index) => (
            <motion.button
              key={crypto.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: crypto.enabled ? 1.03 : 1,
                borderColor: crypto.enabled ? 'rgb(6, 182, 212)' : undefined
              }}
              whileTap={{ scale: crypto.enabled ? 0.97 : 1 }}
              onClick={() => crypto.enabled && onCurrencySelect?.(crypto)}
              disabled={!crypto.enabled}
              className={`
                relative p-4 border rounded-lg text-left transition-all duration-200 overflow-hidden
                ${crypto.enabled
                  ? 'hover:border-neon-cyan hover:bg-neon-cyan/5 cursor-pointer hover:shadow-lg hover:shadow-neon-cyan/10'
                  : 'opacity-40 cursor-not-allowed'
                }
                ${selectedCurrency === crypto.symbol
                  ? 'border-neon-cyan bg-neon-cyan/10 shadow-lg shadow-neon-cyan/20'
                  : 'border-neon-green/20 bg-black/20'
                }
              `}
            >
              {selectedCurrency === crypto.symbol && (
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 bg-neon-cyan rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              )}

              <div className="flex items-center gap-3">
                <motion.div
                  className={`text-xl font-bold ${crypto.color}`}
                  animate={selectedCurrency === crypto.symbol ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {crypto.icon}
                </motion.div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white uppercase tracking-tight">
                    {crypto.symbol} {crypto.name}
                  </div>
                  <div className="text-[9px] text-neon-green/60 uppercase tracking-wider">
                    {crypto.network}
                  </div>
                </div>
                {crypto.enabled ? (
                  <motion.div
                    className="text-[7px] text-neon-green/40 px-1.5 py-0.5 bg-neon-green/10 rounded border border-neon-green/20"
                    animate={selectedCurrency === crypto.symbol ? { backgroundColor: 'rgb(34, 197, 94, 0.2)' } : {}}
                  >
                    ONLINE
                  </motion.div>
                ) : (
                  <div className="text-[7px] text-red-500/40 px-1.5 py-0.5 bg-red-500/10 rounded border border-red-500/20">
                    OFFLINE
                  </div>
                )}
              </div>

              {selectedCurrency === crypto.symbol && (
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-green"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
        <div className="mt-4 text-[9px] text-neon-cyan/30 text-center flex items-center justify-center gap-2">
          <div className="w-1 h-1 bg-neon-cyan/30 rounded-full animate-pulse"></div>
          SECURE MULTI-NETWORK PAYMENT GATEWAY
          <div className="w-1 h-1 bg-neon-cyan/30 rounded-full animate-pulse"></div>
        </div>
      </div>
    </NeoCard>
  );
}