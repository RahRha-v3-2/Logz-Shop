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
                        <div className="text-center mb-6">
                          <motion.div
                            className="inline-flex items-center justify-center w-12 h-12 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full mb-3"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                          >
                            <div className="text-neon-cyan text-xl">💰</div>
                          </motion.div>
                          <h3 className="text-lg font-bold text-white mb-2">CHOOSE PAYMENT METHOD</h3>
                          <div className="text-sm text-neon-green/60">
                            Select your preferred cryptocurrency
                          </div>
                        </div>

                        <motion.div
                          className="mb-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="bg-black/40 border border-neon-green/20 p-4 rounded">
                            <div className="text-sm text-neon-cyan mb-2 font-bold">
                              Order Details
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-neon-green/60">Item:</span>
                                <span className="text-white">{item.title}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neon-green/60">Size:</span>
                                <span className="text-white">{item.size}</span>
                              </div>
                              <div className="border-t border-neon-green/10 pt-2 mt-3">
                                <div className="flex justify-between">
                                  <span className="text-neon-green font-bold">USD Price:</span>
                                  <span className="text-neon-cyan font-bold">${item.price}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <PaymentOptions
                            selectedCurrency={selectedCurrency?.symbol}
                            onCurrencySelect={handleCurrencySelect}
                          />
                        </motion.div>

                        <motion.div
                          className="mt-6 flex gap-3"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <NeoButton onClick={handleClose} variant="ghost" className="flex-1">
                            CANCEL
                          </NeoButton>
                          <NeoButton
                            onClick={() => setStep('confirm')}
                            disabled={!selectedCurrency}
                            className="flex-1"
                          >
                            {selectedCurrency ? 'CONTINUE TO PAYMENT' : 'SELECT CURRENCY FIRST'}
                          </NeoButton>
                        </motion.div>
                      </motion.div>
                    )}

                    {step === 'confirm' && (
                      <motion.div
                        key="confirm"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div className="text-center mb-6">
                          <motion.div
                            className="inline-flex items-center justify-center w-12 h-12 bg-neon-green/10 border border-neon-green/20 rounded-full mb-3"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                          >
                            <div className="text-neon-green text-xl">₿</div>
                          </motion.div>
                          <h3 className="text-lg font-bold text-white mb-2">PAYMENT READY</h3>
                          <div className="text-sm text-neon-green/60">
                            Send payment to complete purchase
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <motion.div
                            className="bg-black/40 border border-neon-green/20 p-4 rounded"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <div className="text-sm text-neon-cyan mb-2 font-bold">
                              Purchase Summary
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-neon-green/60">Item:</span>
                                <span className="text-white">{item.title}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neon-green/60">Source:</span>
                                <span className="text-white">{item.source}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neon-green/60">Size:</span>
                                <span className="text-white">{item.size}</span>
                              </div>
                              <div className="border-t border-neon-green/10 pt-2 mt-3">
                                <div className="flex justify-between text-lg">
                                  <span className="text-neon-green font-bold">Total:</span>
                                  <span className="text-neon-cyan font-bold">{priceInSelectedCurrency} {selectedCurrency?.symbol}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>

                          <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <div className="text-sm text-neon-green/60 mb-4">
                              Scan QR code with your wallet or copy the address below
                            </div>

                            <motion.div
                              className="bg-white p-4 inline-block rounded-lg shadow-2xl border-4 border-neon-green/20"
                              whileHover={{ scale: 1.02 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedCurrency?.address || '')}`}
                                alt="Payment QR Code"
                                className="w-48 h-48"
                              />
                            </motion.div>

                            <motion.div
                              className="mt-4 p-3 bg-black/60 border border-neon-green/20 rounded font-mono text-xs text-neon-cyan break-all cursor-pointer hover:bg-black/80 transition-colors"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.7 }}
                              onClick={() => navigator.clipboard.writeText(selectedCurrency?.address || '')}
                              title="Click to copy address"
                            >
                              {selectedCurrency?.address}
                            </motion.div>
                          </motion.div>

                          <motion.div
                            className="bg-red-900/20 border border-red-500/20 p-3 rounded"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 }}
                          >
                            <div className="flex items-start gap-2">
                              <div className="text-red-400 text-sm mt-0.5">⚠️</div>
                              <div className="text-xs text-red-300">
                                <strong>Important:</strong> Send exactly <span className="font-mono font-bold">{priceInSelectedCurrency} {selectedCurrency?.symbol}</span> to this address.
                                Overpayments cannot be refunded. Transaction will be monitored automatically.
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      <div className="flex gap-3">
                        <NeoButton onClick={() => setStep('currency')} variant="ghost" className="flex-1">
                          BACK
                        </NeoButton>
                          <NeoButton
                            onClick={handleInitiatePayment}
                            disabled={!selectedCurrency}
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
                        <div className="text-center mb-6">
                          <motion.div
                            className="inline-flex items-center justify-center w-16 h-16 bg-black border-2 border-neon-green/20 rounded-full mb-4"
                            animate={{ borderColor: ['rgb(34, 197, 94)', 'rgb(34, 197, 94)', 'rgb(6, 182, 212)', 'rgb(34, 197, 94)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <motion.div
                              className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          </motion.div>
                          <h3 className="text-lg font-bold text-white mb-2">PAYMENT PROCESSING</h3>
                          <div className="text-sm text-neon-green/60">
                            Monitoring blockchain network...
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <div className="bg-black/40 border border-neon-green/20 p-4 rounded">
                            <div className="text-sm text-neon-cyan mb-2 font-bold">
                              Transaction Details
                            </div>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-neon-green/60">Amount:</span>
                                <span className="text-neon-cyan font-mono">{priceInSelectedCurrency} {selectedCurrency?.symbol}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neon-green/60">Network:</span>
                                <span className="text-neon-cyan">{selectedCurrency?.symbol === '₿' ? 'Bitcoin' : selectedCurrency?.symbol === '◎' ? 'Solana' : selectedCurrency?.symbol === 'USDC' ? 'Base' : 'Ethereum'}</span>
                              </div>
                              <div className="flex justify-between items-start">
                                <span className="text-neon-green/60">Address:</span>
                                <span className="text-neon-cyan font-mono text-right break-all max-w-32">{selectedCurrency?.address}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-black/40 border border-neon-green/20 p-4 rounded">
                            <div className="text-sm text-neon-cyan mb-3 font-bold">
                              Processing Status
                            </div>
                            <div className="space-y-3">
                              <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                              >
                                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                                <span className="text-sm text-neon-green">Payment initiated</span>
                              </motion.div>

                              <motion.div
                                className="flex items-center gap-3"
                                initial={{ opacity: 0.3 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                              >
                                <motion.div
                                  className="w-2 h-2 bg-neon-cyan rounded-full"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                ></motion.div>
                                <span className="text-sm text-neon-cyan">Confirming transaction</span>
                              </motion.div>

                              <motion.div
                                className="flex items-center gap-3 opacity-30"
                                initial={{ opacity: 0.1 }}
                                animate={{ opacity: 0.6 }}
                                transition={{ delay: 2 }}
                              >
                                <div className="w-2 h-2 bg-neon-green/30 rounded-full"></div>
                                <span className="text-sm text-neon-green/40">Preparing delivery</span>
                              </motion.div>
                            </div>

                            <motion.div
                              className="mt-4 bg-black/20 rounded-full h-1 overflow-hidden"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <motion.div
                                className="h-full bg-gradient-to-r from-neon-green to-neon-cyan"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2.5, ease: "easeInOut" }}
                              />
                            </motion.div>
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-xs text-neon-green/40">
                            Secure transaction processing • Estimated time: 3 seconds
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
                       <div className="text-center mb-6">
                         <motion.div
                           className="inline-flex items-center justify-center w-12 h-12 bg-neon-green/10 border border-neon-green/20 rounded-full mb-3"
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                         >
                           <div className="text-neon-green text-xl">📧</div>
                         </motion.div>
                         <h3 className="text-lg font-bold text-white mb-2">DELIVERY DETAILS</h3>
                         <div className="text-sm text-neon-green/60">
                           Enter your email to receive the download link
                         </div>
                       </div>

                       <div className="mb-6">
                         <motion.div
                           className="bg-black/40 border border-neon-green/20 p-4 rounded mb-4"
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: 0.3 }}
                         >
                           <div className="text-sm text-neon-cyan mb-2 font-bold">
                             📧 Email Delivery
                           </div>
                           <div className="text-xs text-neon-green/60">
                             Your download link and access credentials will be sent to this email address immediately after payment confirmation.
                           </div>
                         </motion.div>

                         <motion.form
                           onSubmit={handleEmailSubmit}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: 0.5 }}
                         >
                           <div className="relative">
                             <input
                               type="email"
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}
                               placeholder="your@email.com"
                               required
                               className="w-full bg-black/60 border border-neon-green/20 text-white font-mono text-sm px-4 py-3 pl-12 focus:outline-none focus:border-neon-green focus:bg-black/80 transition-all placeholder:text-neon-green/40"
                             />
                             <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-green/40">
                               📧
                             </div>
                           </div>

                           <motion.div
                             className="flex gap-3 mt-6"
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.7 }}
                           >
                             <NeoButton onClick={() => setStep('confirm')} variant="ghost" className="flex-1">
                               ← BACK
                             </NeoButton>
                             <NeoButton
                               type="submit"
                               disabled={isProcessing || !email}
                               className="flex-1"
                             >
                               {isProcessing ? '⏳ SENDING...' : '📤 SEND LINK'}
                             </NeoButton>
                           </motion.div>
                         </motion.form>
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
                       <div className="text-center mb-6">
                         <motion.div
                           className="inline-flex items-center justify-center w-16 h-16 bg-neon-green/10 border-2 border-neon-green rounded-full mb-4"
                           initial={{ scale: 0 }}
                           animate={{ scale: 1 }}
                           transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                         >
                           <motion.div
                             className="text-3xl"
                             initial={{ scale: 0, rotate: -180 }}
                             animate={{ scale: 1, rotate: 0 }}
                             transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                           >
                             ✓
                           </motion.div>
                         </motion.div>
                         <h3 className="text-xl font-bold text-neon-green mb-2">PURCHASE COMPLETE</h3>
                         <div className="text-sm text-neon-green/60">
                           Your order has been processed successfully
                         </div>
                       </div>

                       <motion.div
                         className="space-y-4 mb-6"
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.3 }}
                       >
                         <div className="bg-black/40 border border-neon-green/20 p-4 rounded">
                           <div className="text-sm text-neon-cyan mb-3 font-bold">
                             📋 Order Summary
                           </div>
                           <div className="space-y-2 text-sm">
                             <div className="flex justify-between">
                               <span className="text-neon-green/60">Order ID:</span>
                               <span className="text-neon-cyan font-mono">{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-neon-green/60">Delivery Email:</span>
                               <span className="text-white">{email}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-neon-green/60">Status:</span>
                               <span className="text-neon-green font-bold">✓ CONFIRMED</span>
                             </div>
                           </div>
                         </div>

                         <motion.div
                           className="bg-neon-green/5 border border-neon-green/20 p-4 rounded"
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           transition={{ delay: 0.5 }}
                         >
                           <div className="flex items-start gap-3">
                             <div className="text-neon-green text-lg">📧</div>
                             <div>
                               <div className="text-sm text-neon-cyan font-bold mb-1">
                                 Email Sent Successfully
                               </div>
                               <div className="text-xs text-neon-green/80">
                                 Check your email for download instructions and access credentials within the next 5 minutes.
                               </div>
                             </div>
                           </div>
                         </motion.div>
                       </motion.div>

                       <motion.div
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.7 }}
                       >
                         <NeoButton onClick={handleClose} className="w-full">
                           ✓ CLOSE WINDOW
                         </NeoButton>
                       </motion.div>
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