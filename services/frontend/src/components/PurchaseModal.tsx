import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { NeoCard } from './NeoCard';
import { PaymentOptions } from './PaymentOptions';
import { NeoButton } from './NeoButton';
import { LogItem } from '../types';

interface PurchaseModalProps {
  item: LogItem | null;
  isOpen: boolean;
  onClose: () => void;
}

type PurchaseStep = 'currency' | 'confirm' | 'processing' | 'email' | 'success';

export function PurchaseModal({ item, isOpen, onClose }: PurchaseModalProps) {
  const [step, setStep] = useState<PurchaseStep>('currency');
  const [selectedCurrency, setSelectedCurrency] = useState<{symbol: string, address: string} | null>(null);
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!item) return null;

  const handleCurrencySelect = (currency: {symbol: string, address: string}) => {
    setSelectedCurrency(currency);
  };

  const handleInitiatePayment = () => {
    setStep('processing');
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep('email');
    }, 3000);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate email submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setStep('success');
  };

  const handleClose = () => {
    setStep('currency');
    setSelectedCurrency(null);
    setEmail('');
    setIsProcessing(false);
    onClose();
  };

  const priceInSelectedCurrency = selectedCurrency?.symbol === '₿' ? (item.price / 10000).toFixed(4) :
                                  selectedCurrency?.symbol === '◎' ? (item.price / 100).toFixed(2) :
                                  selectedCurrency?.symbol === 'USDC' ? item.price.toString() :
                                  selectedCurrency?.symbol === '₮' ? item.price.toString() :
                                  item.price.toString();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <NeoCard className="bg-black relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-neon-green/40 hover:text-neon-green transition-colors"
              >
                <X size={20} />
              </button>

              <div className="font-mono">
                <div className="text-[10px] text-neon-green/40 mb-4 border-b border-neon-green/10 pb-2">
                  // secure_purchase_flow
                </div>

                <AnimatePresence mode="wait">
                  {step === 'currency' && (
                    <motion.div
                      key="currency"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                       <h3 className="text-lg font-bold text-white mb-4">SELECT PAYMENT METHOD</h3>
                       <div className="mb-6">
                         <div className="text-sm text-neon-green/60 mb-2">Item: {item.title}</div>
                         <div className="text-sm text-neon-green/60 mb-1">Size: {item.size}</div>
                         <div className="text-lg font-bold text-neon-cyan">Price: ${item.price}</div>
                       </div>
                       <PaymentOptions
                         selectedCurrency={selectedCurrency?.symbol}
                         onCurrencySelect={handleCurrencySelect}
                       />
                      <div className="mt-6 flex gap-3">
                        <NeoButton onClick={handleClose} variant="ghost" className="flex-1">
                          CANCEL
                        </NeoButton>
                        <NeoButton onClick={() => setStep('confirm')} className="flex-1">
                          CONTINUE
                        </NeoButton>
                      </div>
                    </motion.div>
                  )}

                  {step === 'confirm' && (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-lg font-bold text-white mb-4">CONFIRM PURCHASE</h3>
                      <div className="space-y-4 mb-6">
                        <div className="border border-neon-green/20 p-4">
                          <div className="text-sm text-neon-green/60">Item: {item.title}</div>
                          <div className="text-sm text-neon-green/60">Source: {item.source}</div>
                          <div className="text-lg font-bold text-neon-cyan mt-2">
                            Amount: {priceInSelectedCurrency} {selectedCurrency?.symbol}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-neon-green/60 mb-2">Scan QR Code or Send to Address</div>
                          <div className="bg-white p-4 inline-block rounded">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedCurrency?.address || '')}`}
                              alt="Payment QR Code"
                              className="w-48 h-48"
                            />
                          </div>
                          <div className="mt-4 p-2 bg-black border border-neon-green/20 rounded font-mono text-xs text-neon-cyan break-all">
                            {selectedCurrency?.address}
                          </div>
                        </div>
                        <div className="text-[12px] text-neon-green/40">
                          ⚠️ Send exactly {priceInSelectedCurrency} {selectedCurrency?.symbol} to this address. Transaction will be monitored automatically.
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <NeoButton onClick={() => setStep('currency')} variant="ghost" className="flex-1">
                          BACK
                        </NeoButton>
                          <NeoButton
                            onClick={handleInitiatePayment}
                            className="flex-1"
                          >
                            INITIATE PAYMENT
                          </NeoButton>
                      </div>
                    </motion.div>
                   )}

                   {step === 'processing' && (
                     <motion.div
                       key="processing"
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -20 }}
                     >
                       <h3 className="text-lg font-bold text-white mb-4">PAYMENT PROCESSING</h3>
                       <div className="space-y-4 mb-6">
                         <div className="text-center">
                           <div className="text-4xl mb-4 animate-spin">⟳</div>
                           <div className="text-sm text-neon-green/60 mb-2">
                             Monitoring blockchain for payment confirmation...
                           </div>
                           <div className="text-xs text-neon-cyan">
                             Amount: {priceInSelectedCurrency} {selectedCurrency?.symbol}
                           </div>
                           <div className="text-xs text-neon-cyan break-all mt-2">
                             Address: {selectedCurrency?.address}
                           </div>
                         </div>
                         <div className="border border-neon-green/20 p-4">
                           <div className="text-[12px] text-neon-green/40 space-y-2">
                             <div>✓ Payment initiated</div>
                             <div>⟳ Waiting for blockchain confirmation</div>
                             <div>○ Preparing download link</div>
                           </div>
                         </div>
                       </div>
                       <div className="text-center">
                         <div className="text-sm text-neon-green/60">
                           This process may take a few moments...
                         </div>
                       </div>
                     </motion.div>
                   )}

                   {step === 'email' && (
                    <motion.div
                      key="email"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-lg font-bold text-white mb-4">DELIVERY DETAILS</h3>
                      <div className="mb-6">
                        <div className="text-sm text-neon-green/60 mb-4">
                          Enter your email address to receive the download link and access credentials.
                        </div>
                        <form onSubmit={handleEmailSubmit}>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            className="w-full bg-black border border-neon-green/20 text-white font-mono text-sm px-3 py-2 focus:outline-none focus:border-neon-green transition-all"
                          />
                          <div className="flex gap-3 mt-4">
                            <NeoButton onClick={() => setStep('confirm')} variant="ghost" className="flex-1">
                              BACK
                            </NeoButton>
                            <NeoButton
                              type="submit"
                              disabled={isProcessing || !email}
                              className="flex-1"
                            >
                              {isProcessing ? 'SENDING...' : 'SEND LINK'}
                            </NeoButton>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  )}

                  {step === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-lg font-bold text-neon-green mb-4">PURCHASE COMPLETE</h3>
                      <div className="space-y-4 mb-6">
                        <div className="text-center">
                          <div className="text-4xl mb-2">✓</div>
                          <div className="text-sm text-neon-green/60">
                            Payment confirmed and processed successfully.
                          </div>
                        </div>
                        <div className="border border-neon-green/20 p-4 text-sm">
                          <div className="text-neon-green/60">Order ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                          <div className="text-neon-green/60">Delivery Email: {email}</div>
                          <div className="text-neon-cyan mt-2">
                            Check your email for download instructions within 5 minutes.
                          </div>
                        </div>
                      </div>
                      <NeoButton onClick={handleClose} className="w-full">
                        CLOSE
                      </NeoButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </NeoCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}