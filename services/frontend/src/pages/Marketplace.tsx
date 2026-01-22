import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { LogItem } from '../types';
import { LogCard } from '../components/LogCard';
import { PurchaseModal } from '../components/PurchaseModal';

const MOCK_LOGS: LogItem[] = [
  {
    id: '1',
    title: 'CHASE_GLOBAL_BIN_DUMP_01',
    type: 'DATABASE_DUMP',
    source: 'CHASE_INTERNAL_RELAY',
    price: 25,
    reliability: 98,
    tags: ['CHASE', 'BIN_DUMPS', 'FRESH'],
    risk: 'CRITICAL',
    size: '120 MB',
    leakedAt: '2024-03-15',
    region: 'US_EAST',
    flag: '🇺🇸'
  },
  {
    id: '2',
    title: 'FANDUEL_ACTIVE_PAYOUT_ACC_X12',
    type: 'ADMIN_PANEL',
    source: 'FANDUEL_STAGING_LEAK',
    price: 45,
    reliability: 92,
    tags: ['FANDUEL', 'PAYOUTS', 'HV'],
    risk: 'HIGH',
    size: '45 MB',
    leakedAt: '2024-03-14',
    region: 'US_ANY',
    flag: '🇺🇸'
  },
  {
    id: '3',
    title: 'CHIME_FULL_SESS_LOGS_MARCH',
    type: 'SERVER_ACCESS',
    source: 'CHIME_AWS_B3',
    price: 18,
    reliability: 88,
    tags: ['CHIME', 'SESSION_LOGS', 'BIN'],
    risk: 'HIGH',
    size: '89 MB',
    leakedAt: '2024-03-16',
    region: 'US_SOUTH',
    flag: '🇺🇸'
  },
  {
    id: '4',
    title: 'CORPORATE_BIN_LOG_STREAM_V4',
    type: 'DATABASE_DUMP',
    source: 'PAYMENT_GATEWAY_X',
    price: 65,
    reliability: 95,
    tags: ['BIN_LOGS', 'BULK', 'AUTO_REFRESH'],
    risk: 'CRITICAL',
    size: '450 MB',
    leakedAt: '2024-03-15',
    region: 'EURO_NODE',
    flag: '🇪🇺'
  },
   { id: '5', type: 'SERVER_ACCESS', title: 'SHELL_ACCESS // LINUX_NODE', source: 'university_network', price: 8, reliability: 60, risk: 'MEDIUM', size: '12 MB', leakedAt: '2026-01-10', region: 'ASIA', flag: '🌏', tags: ['ssh', 'edu', 'botnet'] },
   { id: '6', type: 'ADMIN_PANEL', title: 'WORDPRESS // ADMIN', source: 'tech_blog', price: 4, reliability: 40, risk: 'MEDIUM', size: '20 MB', leakedAt: '2026-01-08', region: 'US', flag: '🇺🇸', tags: ['cms', 'wp', 'seo'] },
   { id: '7', type: 'DATABASE_DUMP', title: 'STRIPE_KEYS // LIVE_REVENUE', source: 'saas_startup', price: 180, reliability: 99, risk: 'CRITICAL', size: '12 KB', leakedAt: '2026-01-16', region: 'US', flag: '🇺🇸', tags: ['fintech', 'api', 'keys'] },
   { id: '8', type: 'SERVER_ACCESS', title: 'PENTAGON_INTRA // NODE_42', source: 'gov_sec_restricted', price: 450, reliability: 100, risk: 'CRITICAL', size: '5 GB', leakedAt: '2026-01-13', region: 'US', flag: '🇺🇸', tags: ['gov', 'classified', 'root'] },
   { id: '9', type: 'DATABASE_DUMP', title: 'CREDIT_CARD_LIST // 50K', source: 'retail_breach', price: 110, reliability: 88, risk: 'CRITICAL', size: '45 MB', leakedAt: '2026-01-14', region: 'EU', flag: '🇪🇺', tags: ['cc', 'dump', 'finance'] },
   { id: '10', type: 'CLOUD_CREDENTIALS', title: 'GOOGLE_CLOUD // PROJECT_ROOT', source: 'ai_development_lab', price: 240, reliability: 95, risk: 'CRITICAL', size: '280 MB', leakedAt: '2026-01-15', region: 'GLOBAL', flag: '🌐', tags: ['gcp', 'ai', 'cloud'] },
   { id: '11', type: 'SERVER_ACCESS', title: 'JIRA_INSTANCE // INTERNAL', source: 'software_house', price: 32, reliability: 90, risk: 'HIGH', size: '1.5 GB', leakedAt: '2026-01-12', region: 'INDIA', flag: '🇮🇳', tags: ['devops', 'internal', 'jira'] },
   { id: '12', type: 'ADMIN_PANEL', title: 'C-PANEL // HOSTING_PROVIDER', source: 'legacy_hosting', price: 13, reliability: 75, risk: 'MEDIUM', size: '50 MB', leakedAt: '2026-01-11', region: 'RUSSIA', flag: '🇷🇺', tags: ['hosting', 'cpanel', 'web'] },
   { id: '13', type: 'DATABASE_DUMP', title: 'HEALTH_RECORDS // 10K', source: 'private_clinic', price: 80, reliability: 92, risk: 'HIGH', size: '320 MB', leakedAt: '2026-01-14', region: 'UK', flag: '🇬🇧', tags: ['health', 'pii', 'medical'] },
   { id: '14', type: 'CLOUD_CREDENTIALS', title: 'AWS_S3_BUCKET // PRIVATE', source: 'media_giant', price: 160, reliability: 97, risk: 'CRITICAL', size: '140 GB', leakedAt: '2026-01-13', region: 'GLOBAL', flag: '🌐', tags: ['s3', 'media', 'data'] },
   { id: '15', type: 'SERVER_ACCESS', title: 'VPN_GATEWAY // ENT_NET', source: 'fortune_500_corp', price: 290, reliability: 100, risk: 'CRITICAL', size: '120 MB', leakedAt: '2026-01-16', region: 'US', flag: '🇺🇸', tags: ['vpn', 'network', 'ent'] },
   { id: '16', type: 'ADMIN_PANEL', title: 'MAGENTO_STORE // FULL_ACCESS', source: 'luxury_retail', price: 95, reliability: 85, risk: 'HIGH', size: '90 MB', leakedAt: '2026-01-15', region: 'ITALY', flag: '🇮🇹', tags: ['ecom', 'magento', 'luxury'] },
   { id: '17', type: 'DATABASE_DUMP', title: 'PASSPORT_SCANS // 5K', source: 'travel_agency_leak', price: 150, reliability: 90, risk: 'CRITICAL', size: '1.2 GB', leakedAt: '2026-01-14', region: 'ASIA', flag: '🌏', tags: ['identity', 'passport', 'kyc'] },
   { id: '18', type: 'CLOUD_CREDENTIALS', title: 'DIGITAL_OCEAN // API_KEY', source: 'startup_saas', price: 11, reliability: 80, risk: 'MEDIUM', size: '5 KB', leakedAt: '2026-01-16', region: 'US', flag: '🇺🇸', tags: ['do', 'cloud', 'startup'] },
   { id: '19', type: 'SERVER_ACCESS', title: 'SSH_KEYS // DEV_TEAM', source: 'telco_provider', price: 65, reliability: 94, risk: 'HIGH', size: '25 MB', leakedAt: '2026-01-15', region: 'BRAZIL', flag: '🇧🇷', tags: ['ssh', 'telco', 'dev'] },
    { id: '20', type: 'ADMIN_PANEL', title: 'WHMCS // BILLING', source: 'isp_portal', price: 210, reliability: 98, risk: 'CRITICAL', size: '110 MB', leakedAt: '2026-01-16', region: 'GLOBAL', flag: '🌐', tags: ['billing', 'isp', 'whmcs'] },
    // Carding Section
    { id: '21', type: 'DATABASE_DUMP', title: 'AMEX_BIN_DUMP_2024_Q1', source: 'amex_merchant_portal', price: 170, reliability: 96, risk: 'CRITICAL', size: '280 MB', leakedAt: '2026-01-17', region: 'US', flag: '🇺🇸', tags: ['amex', 'bin', 'carding', 'premium'] },
    { id: '22', type: 'CREDIT_CARDS', title: 'VISA_MASTERCARD_MIX_10K', source: 'retail_chain_breach', price: 95, reliability: 85, risk: 'CRITICAL', size: '45 MB', leakedAt: '2026-01-18', region: 'EU', flag: '🇪🇺', tags: ['visa', 'mastercard', 'carding', 'bulk'] },
    { id: '23', type: 'DATABASE_DUMP', title: 'DISCOVER_CC_FULL_DUMP', source: 'discover_processing', price: 130, reliability: 92, risk: 'CRITICAL', size: '190 MB', leakedAt: '2026-01-19', region: 'US', flag: '🇺🇸', tags: ['discover', 'cc', 'carding'] },
    { id: '24', type: 'BIN_LISTS', title: 'GLOBAL_BIN_MASTER_LIST', source: 'payment_gateway_aggregator', price: 50, reliability: 98, risk: 'HIGH', size: '12 MB', leakedAt: '2026-01-20', region: 'GLOBAL', flag: '🌐', tags: ['bin', 'master', 'carding'] },
    { id: '25', type: 'CREDIT_CARDS', title: 'CORPORATE_CC_SUITE_5K', source: 'enterprise_breach', price: 220, reliability: 94, risk: 'CRITICAL', size: '89 MB', leakedAt: '2026-01-21', region: 'US', flag: '🇺🇸', tags: ['corporate', 'cc', 'carding', 'business'] },
    // Trading Section
    { id: '26', type: 'DATABASE_DUMP', title: 'ROBINHOOD_TRADING_LOGS', source: 'robinhood_internal', price: 150, reliability: 90, risk: 'HIGH', size: '320 MB', leakedAt: '2026-01-22', region: 'US', flag: '🇺🇸', tags: ['robinhood', 'trading', 'stocks'] },
    { id: '27', type: 'FINANCIAL_DATA', title: 'FOREX_TRADING_RECORDS', source: 'fx_broker_leak', price: 85, reliability: 87, risk: 'HIGH', size: '150 MB', leakedAt: '2026-01-23', region: 'UK', flag: '🇬🇧', tags: ['forex', 'trading', 'currency'] },
    { id: '28', type: 'DATABASE_DUMP', title: 'CRYPTO_EXCHANGE_ORDERS', source: 'crypto_platform_breach', price: 185, reliability: 95, risk: 'CRITICAL', size: '410 MB', leakedAt: '2026-01-24', region: 'GLOBAL', flag: '🌐', tags: ['crypto', 'trading', 'orders'] },
    { id: '29', type: 'FINANCIAL_DATA', title: 'HEDGE_FUND_PORTFOLIOS', source: 'wall_street_leak', price: 400, reliability: 99, risk: 'CRITICAL', size: '870 MB', leakedAt: '2026-01-25', region: 'US', flag: '🇺🇸', tags: ['hedge', 'fund', 'trading', 'premium'] },
    { id: '30', type: 'DATABASE_DUMP', title: 'OPTIONS_TRADING_DATA', source: 'derivatives_exchange', price: 115, reliability: 91, risk: 'HIGH', size: '230 MB', leakedAt: '2026-01-26', region: 'US', flag: '🇺🇸', tags: ['options', 'trading', 'derivatives'] },
    // More Admin Panels
    { id: '31', type: 'ADMIN_PANEL', title: 'SHOPIFY_ADMIN_FULL', source: 'ecommerce_store', price: 65, reliability: 88, risk: 'HIGH', size: '75 MB', leakedAt: '2026-01-27', region: 'CANADA', flag: '🇨🇦', tags: ['shopify', 'ecom', 'admin'] },
    { id: '32', type: 'ADMIN_PANEL', title: 'WORDPRESS_MULTISITE', source: 'news_network', price: 50, reliability: 82, risk: 'HIGH', size: '210 MB', leakedAt: '2026-01-28', region: 'US', flag: '🇺🇸', tags: ['wordpress', 'multisite', 'media'] },
    { id: '33', type: 'ADMIN_PANEL', title: 'DRUPAL_ADMIN_ROOT', source: 'gov_website', price: 95, reliability: 93, risk: 'CRITICAL', size: '180 MB', leakedAt: '2026-01-29', region: 'AUSTRALIA', flag: '🇦🇺', tags: ['drupal', 'gov', 'admin'] },
    // More Server Access
    { id: '34', type: 'SERVER_ACCESS', title: 'AWS_EC2_ROOT_ACCESS', source: 'cloud_infrastructure', price: 225, reliability: 97, risk: 'CRITICAL', size: '50 MB', leakedAt: '2026-01-30', region: 'GLOBAL', flag: '🌐', tags: ['aws', 'ec2', 'root', 'cloud'] },
    { id: '35', type: 'SERVER_ACCESS', title: 'GCP_COMPUTE_ENGINE', source: 'google_cloud_leak', price: 200, reliability: 95, risk: 'CRITICAL', size: '75 MB', leakedAt: '2026-01-31', region: 'GLOBAL', flag: '🌐', tags: ['gcp', 'compute', 'server'] },
    { id: '36', type: 'SERVER_ACCESS', title: 'AZURE_VM_ADMIN', source: 'microsoft_cloud', price: 190, reliability: 94, risk: 'CRITICAL', size: '60 MB', leakedAt: '2026-02-01', region: 'GLOBAL', flag: '🌐', tags: ['azure', 'vm', 'admin'] },
    // More BIN Logs
    { id: '37', type: 'DATABASE_DUMP', title: 'BANK_OF_AMERICA_BIN', source: 'boa_internal_network', price: 155, reliability: 96, risk: 'CRITICAL', size: '340 MB', leakedAt: '2026-02-02', region: 'US', flag: '🇺🇸', tags: ['boa', 'bin', 'banking'] },
    { id: '38', type: 'DATABASE_DUMP', title: 'WELLS_FARGO_BIN_LOGS', source: 'wells_fargo_backup', price: 145, reliability: 94, risk: 'CRITICAL', size: '290 MB', leakedAt: '2026-02-03', region: 'US', flag: '🇺🇸', tags: ['wells_fargo', 'bin', 'logs'] },
    { id: '39', type: 'DATABASE_DUMP', title: 'CITIBANK_BIN_STREAM', source: 'citi_processing_center', price: 165, reliability: 97, risk: 'CRITICAL', size: '380 MB', leakedAt: '2026-02-04', region: 'US', flag: '🇺🇸', tags: ['citibank', 'bin', 'stream'] },
    // More Chime/Chase Logs
    { id: '40', type: 'DATABASE_DUMP', title: 'CHASE_MOBILE_APP_LOGS', source: 'chase_app_backend', price: 75, reliability: 89, risk: 'HIGH', size: '95 MB', leakedAt: '2026-02-05', region: 'US', flag: '🇺🇸', tags: ['chase', 'mobile', 'app'] },
    { id: '41', type: 'DATABASE_DUMP', title: 'CHIME_USER_SESSIONS', source: 'chime_user_db', price: 58, reliability: 86, risk: 'HIGH', size: '68 MB', leakedAt: '2026-02-06', region: 'US', flag: '🇺🇸', tags: ['chime', 'sessions', 'user'] },
    { id: '42', type: 'DATABASE_DUMP', title: 'CHASE_CREDIT_REPORTS', source: 'chase_credit_dept', price: 115, reliability: 93, risk: 'HIGH', size: '170 MB', leakedAt: '2026-02-07', region: 'US', flag: '🇺🇸', tags: ['chase', 'credit', 'reports'] },
    // More Fanduel Payouts
    { id: '43', type: 'DATABASE_DUMP', title: 'FANDUEL_WINNER_PAYOUTS', source: 'fanduel_payment_sys', price: 100, reliability: 91, risk: 'HIGH', size: '120 MB', leakedAt: '2026-02-08', region: 'US', flag: '🇺🇸', tags: ['fanduel', 'payouts', 'winners'] },
    { id: '44', type: 'DATABASE_DUMP', title: 'FANDUEL_BETTING_HISTORY', source: 'fanduel_gambling_db', price: 85, reliability: 88, risk: 'HIGH', size: '240 MB', leakedAt: '2026-02-09', region: 'US', flag: '🇺🇸', tags: ['fanduel', 'betting', 'history'] },
    { id: '45', type: 'DATABASE_DUMP', title: 'FANDUEL_USER_BALANCES', source: 'fanduel_wallet_sys', price: 70, reliability: 85, risk: 'HIGH', size: '89 MB', leakedAt: '2026-02-10', region: 'US', flag: '🇺🇸', tags: ['fanduel', 'balances', 'wallet'] },
 ];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

export default Marketplace;;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState('ALL_MODULES');
  const [filter, setFilter] = useState('');
  const [purchaseItem, setPurchaseItem] = useState<LogItem | null>(null);

  const categories = [
    { label: 'ALL_MODULES', count: MOCK_LOGS.length },
    { label: 'CARDING_DATA', count: MOCK_LOGS.filter(l => l.tags.includes('carding')).length },
    { label: 'TRADING_DATA', count: MOCK_LOGS.filter(l => l.tags.includes('trading')).length },
    { label: 'BIN_LOGS', count: MOCK_LOGS.filter(l => l.tags.includes('bin')).length },
    { label: 'CHASE_BIN_DUMPS', count: MOCK_LOGS.filter(l => l.tags.includes('chase')).length },
    { label: 'CHIME_LOGS', count: MOCK_LOGS.filter(l => l.tags.includes('chime')).length },
    { label: 'FANDUEL_PAYOUTS', count: MOCK_LOGS.filter(l => l.tags.includes('fanduel')).length },
    { label: 'ADMIN_PANELS', count: MOCK_LOGS.filter(l => l.type === 'ADMIN_PANEL').length },
    { label: 'SERVER_ACCESS', count: MOCK_LOGS.filter(l => l.type === 'SERVER_ACCESS').length },
    { label: 'CLOUD_CREDENTIALS', count: MOCK_LOGS.filter(l => l.type === 'CLOUD_CREDENTIALS').length },
  ];

  const filteredLogs = useMemo(() => MOCK_LOGS.filter(log => {
    const matchesCategory = selectedCategory === 'ALL_MODULES' ||
      (selectedCategory === 'CARDING_DATA' && log.tags.includes('carding')) ||
      (selectedCategory === 'TRADING_DATA' && log.tags.includes('trading')) ||
      (selectedCategory === 'BIN_LOGS' && log.tags.includes('bin')) ||
      (selectedCategory === 'CHASE_BIN_DUMPS' && log.tags.includes('chase')) ||
      (selectedCategory === 'CHIME_LOGS' && log.tags.includes('chime')) ||
      (selectedCategory === 'FANDUEL_PAYOUTS' && log.tags.includes('fanduel')) ||
      (selectedCategory === 'ADMIN_PANELS' && log.type === 'ADMIN_PANEL') ||
      (selectedCategory === 'SERVER_ACCESS' && log.type === 'SERVER_ACCESS') ||
      (selectedCategory === 'CLOUD_CREDENTIALS' && log.type === 'CLOUD_CREDENTIALS');

    const matchesFilter = filter === '' ||
      log.title.toLowerCase().includes(filter.toLowerCase()) ||
      log.source.toLowerCase().includes(filter.toLowerCase()) ||
      log.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()));

    return matchesCategory && matchesFilter;
  }), [selectedCategory, filter]);

  return (
    <div className="flex gap-8 animate-in fade-in duration-500">
      {/* Sidebar Filter - ASCII Tree Style */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-72 hidden xl:block shrink-0"
      >
        <div className="sticky top-8 space-y-6">
          <div className="bg-black/40 border border-neon-green/20 p-6 ascii-border">
            <h3 className="text-[11px] font-bold text-neon-green/40 mb-5 tracking-[0.2em] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-neon-green/40" /> MARKET_TREE
            </h3>
             <nav className="font-mono text-[12px] space-y-3">
               {categories.map((cat, i) => (
                 <div key={cat.label} className="group cursor-pointer">
                   <div className="flex items-center gap-2">
                     <span className="text-neon-green/20 font-bold">{i === 0 ? '▼' : '├─'}</span>
                     <button
                       onClick={() => setSelectedCategory(cat.label)}
                       className={clsx(
                         "hover:text-white transition-colors tracking-tight",
                         selectedCategory === cat.label ? "text-neon-cyan font-bold" : i === 0 ? "text-neon-cyan font-bold" : "text-neon-green/60"
                       )}
                     >
                       {cat.label}
                     </button>
                    <span className="text-[10px] opacity-20 ml-auto font-bold tracking-tighter">[{cat.count}]</span>
                  </div>
                </div>
              ))}
              <div className="text-neon-green/20 ml-[2px] pt-2 flex items-center gap-2">
                <span>└─</span>
                <span className="text-[10px] opacity-50 px-1 border border-neon-green/20">SEC_CHECK_ACTIVE</span>
              </div>
            </nav>
          </div>

          <div className="bg-black/40 border border-neon-green/20 p-6 ascii-border">
            <h3 className="text-[11px] font-bold text-neon-green/40 mb-5 tracking-[0.2em] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-neon-green/40" /> RISK_CRITERIA
            </h3>
            <div className="space-y-3">
              {[
                { label: 'CRITICAL', color: 'text-red-500' },
                { label: 'HIGH', color: 'text-orange-500' },
                { label: 'MEDIUM', color: 'text-yellow-500' },
              ].map(risk => (
                <label key={risk.label} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-3 h-3 border border-neon-green/30 group-hover:border-neon-green transition-colors flex items-center justify-center p-0.5">
                     <div className="w-full h-full bg-neon-green opacity-0 group-hover:opacity-10" />
                  </div>
                  <span className={clsx("text-[11px] font-bold tracking-tight uppercase group-hover:text-white transition-all", risk.color)}>
                    {risk.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 space-y-10" role="main">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-neon-green/10 pb-8">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="font-mono"
          >
            <div className="text-neon-green text-xs font-bold mb-2 flex items-center gap-3">
               <span className="bg-neon-green text-black px-2 py-0.5">MARKET_V2</span>
               <span className="opacity-40 tracking-[0.5em]">////////////////////</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">
              Log_Marketplace<span className="text-neon-green animate-pulse">_</span>
            </h1>
             <p className="text-neon-green/40 text-[10px] tracking-widest font-bold">
               ESTABLISHED_TUNNEL: <span className="text-neon-cyan">KRONOS_SYDN_01</span> // ACTIVE_NODES: {filteredLogs.length}
             </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-4 w-full md:w-auto"
          >
            <div className="relative group flex-1 md:w-80">
              <div className="absolute inset-y-0 left-3 flex items-center text-neon-green/30 font-bold">$</div>
                <input
                  type="text"
                  placeholder="SEARCH_MARKET_INDEX..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  aria-label="Search marketplace logs"
                  className="w-full bg-black border border-neon-green/20 text-white font-mono text-[12px] pl-8 pr-4 py-2 focus:outline-none focus:border-neon-green/60 transition-all placeholder:text-neon-green/20"
                />
            </div>

          </motion.div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 pb-20"
        >
          {filteredLogs.map((log) => (
             <motion.div key={log.id} variants={itemVariants}>
               <LogCard item={log} onPurchase={setPurchaseItem} />
             </motion.div>
           ))}
          </motion.div>

        <PurchaseModal
          item={purchaseItem}
          isOpen={!!purchaseItem}
          onClose={() => setPurchaseItem(null)}
        />
      </main>
    </div>
  );
}
