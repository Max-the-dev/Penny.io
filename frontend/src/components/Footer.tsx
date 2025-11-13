import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount, useWalletClient } from 'wagmi';
import { Info, BookOpen, PenTool, HelpCircle, Mail, Shield, FileText, LayoutDashboard, Library, Laptop, HeartHandshake, Copy, Check } from 'lucide-react';
import { useAppKitProvider } from '@reown/appkit/react';
import AppKitConnectButton from './AppKitConnectButton';
import { x402PaymentService, type SupportedNetwork } from '../services/x402PaymentService';
import { createSolanaTransactionSigner } from '../utils/solanaSigner';
import { useAppKitNetwork } from '@reown/appkit/react';


function Footer() {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [selectedNetworkFamily, setSelectedNetworkFamily] = useState<'base' | 'solana'>('base');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [donationResult, setDonationResult] = useState<{ success: boolean; message: string; txHash?: string; networkFamily?: 'base' | 'solana'; network?: SupportedNetwork } | null>(null);
  const [isWalletStateReady, setIsWalletStateReady] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const { isConnected, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { walletProvider: solanaWalletProvider } = useAppKitProvider('solana');
  const solanaSigner = useMemo(
    () => createSolanaTransactionSigner(solanaWalletProvider),
    [solanaWalletProvider]
  );
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Dynamic network selection
  const {caipNetworkId} = useAppKitNetwork();
    const detectSolanaNetwork = (caip?: string): SupportedNetwork => {
    if (!caip) return 'solana-devnet';
    if (caip.startsWith('solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp')) return 'solana';
    if (caip.startsWith('solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1')) return 'solana-devnet';
    return 'solana-devnet';
  };
  const resolvedSolanaNetwork = detectSolanaNetwork(caipNetworkId);
  const donationShareUrl = useMemo(
    () => (typeof window !== 'undefined' ? `${window.location.origin}/donate` : ''),
    []
  );

  const solanaAddress = 'cAXdcMFHK6y9yTP7AMETzXC7zvTeDBbQ5f4nvSWDx51';
  const baseAddress = '0x6945890b1c074414b813c7643ae10117dec1c8e7';
  const predefinedAmounts = [1, 5, 25, 50];
  const DONATION_STORAGE_KEY = 'penny:lastDonation';
  const DONATION_NETWORK_META: Record<'base' | 'solana', { title: string; helper: string; icon: string; speed: string }> = {
    base: {
      title: 'Base · USDC',
      helper: 'Secure · low fees · L2 finality',
      icon: '/icons/base.png',
      speed: '~15s settlement',
    },
    solana: {
      title: 'Solana · USDC',
      helper: 'Ultra-fast · minimal fees',
      icon: '/icons/solana.png',
      speed: '~400ms finality',
    },
  };
  const DONATION_IMPACT_TIERS = [
    { label: 'Supporter', amount: 5, description: 'Helps cover hosting costs for a day.' },
    { label: 'Champion', amount: 25, description: 'Backs new creator tooling this week.' },
    { label: 'Patron', amount: 50, description: 'Funds growth experiments + support.' },
  ];
  const DONATION_QUICK_ACTIONS = [
    { label: '+ $5 boost', delta: 5 },
    { label: '+ $10 boost', delta: 10 },
    { label: 'Reset', delta: null },
  ];
  const isSolanaSelected = selectedNetworkFamily === 'solana';
  const isSelectedNetworkReady = isSolanaSelected
    ? Boolean(solanaSigner)
    : Boolean(isConnected && walletClient);
  const donationNetworkLabel = isSolanaSelected ? 'Solana USDC (x402)' : 'Base USDC (x402)';
  const getNetworkStatus = (family: 'base' | 'solana') => {
    if (family === 'solana') {
      const isReady = Boolean(solanaSigner);
      return {
        isReady,
        badgeText: isReady ? 'Wallet connected' : 'Connect Solana wallet',
        badgeVariant: isReady ? 'success' : 'warning',
        tooltip: isReady ? undefined : 'Connect a Solana wallet in AppKit to donate in Solana USDC.',
      };
    }
    const isReady = Boolean(isConnected && walletClient);
    return {
      isReady,
      badgeText: isReady ? 'Wallet connected' : 'Connect Base wallet',
      badgeVariant: isReady ? 'success' : 'warning',
      tooltip: isReady ? undefined : 'Connect an EVM wallet to donate with Base USDC.',
    };
  };
  const donationNetworkOptions = useMemo(() => {
    return (['base', 'solana'] as const).map((family) => {
      const meta = DONATION_NETWORK_META[family];
      const status = getNetworkStatus(family);
      return {
        family,
        title: meta.title,
        helper: meta.helper,
        icon: meta.icon,
        speed: meta.speed,
        ...status,
      };
    });
  }, [isConnected, walletClient, solanaSigner]);
  const handleCopyAddress = async (address: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(address);
        setCopiedAddress(address);
        setTimeout(() => setCopiedAddress(null), 2000);
      }
    } catch (error) {
      console.error('Failed to copy wallet address', error);
    }
  };

  const handleCopyShareLink = async () => {
    if (!donationShareUrl) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(donationShareUrl);
        setShareLinkCopied(true);
        setTimeout(() => setShareLinkCopied(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy donation share link', error);
    }
  };

  const closeDonateModal = useCallback(() => {
    setIsDonateModalOpen(false);
    setCopiedAddress(null);
    setSelectedAmount(null);
    setCustomAmount('');
    setIsProcessing(false);
    setDonationResult(null);
    setSelectedNetworkFamily('base');
    setShareLinkCopied(false);
    setIsWalletStateReady(false);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    if (!isDonateModalOpen) {
      document.body.style.overflow = '';
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setIsWalletStateReady(false);
    let readinessTimer: number | undefined;

    if (typeof window !== 'undefined') {
      readinessTimer = window.setTimeout(() => setIsWalletStateReady(true), 250);
      try {
        const stored = window.localStorage.getItem(DONATION_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.networkFamily === 'solana' || parsed.networkFamily === 'base') {
            setSelectedNetworkFamily(parsed.networkFamily);
          }
          if (typeof parsed.amount === 'number') {
            setSelectedAmount(parsed.amount);
          }
          if (typeof parsed.customAmount === 'string') {
            setCustomAmount(parsed.customAmount);
          }
        }
      } catch (error) {
        console.error('Unable to load donation preferences', error);
      }
    } else {
      setIsWalletStateReady(true);
    }

    const modalEl = modalRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const focusFirstElement = () => {
      if (!modalEl) return;
      const focusables = modalEl.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusables.length > 0) {
        focusables[0].focus();
      }
    };

    focusFirstElement();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDonateModal();
        return;
      }
      if (event.key !== 'Tab' || !modalEl) return;
      const focusables = modalEl.querySelectorAll<HTMLElement>(focusableSelector);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (typeof window !== 'undefined' && readinessTimer) {
        window.clearTimeout(readinessTimer);
      }
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDonateModalOpen, closeDonateModal]);

  const persistDonationPreferences = (preferences: Partial<{ amount: number | null; customAmount: string; networkFamily: 'base' | 'solana' }>) => {
    if (typeof window === 'undefined') return;
    try {
      const existing = window.localStorage.getItem(DONATION_STORAGE_KEY);
      const parsed = existing ? JSON.parse(existing) : {};
      const next = { ...parsed, ...preferences };
      window.localStorage.setItem(DONATION_STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.error('Unable to persist donation preferences', error);
    }
  };

  const parsedCustomAmount = parseFloat(customAmount || '');
  const normalizedCustomAmount = Number.isNaN(parsedCustomAmount) ? null : parsedCustomAmount;
  const activeAmountValue = selectedAmount ?? normalizedCustomAmount ?? null;

  const clampAmount = (value: number) => {
    return Math.min(100, Math.max(0.01, parseFloat(value.toFixed(2))));
  };

  const setAmountSelection = (amount: number | null, customValue: string) => {
    setSelectedAmount(amount);
    setCustomAmount(customValue);
    persistDonationPreferences({ amount, customAmount: customValue });
  };

  const handleQuickAction = (delta: number | null) => {
    if (delta === null) {
      setAmountSelection(null, '');
      return;
    }
    const baseValue = selectedAmount ?? normalizedCustomAmount ?? 0;
    const nextAmount = clampAmount(baseValue + delta);
    setSelectedAmount(nextAmount);
    setCustomAmount('');
    persistDonationPreferences({ amount: nextAmount, customAmount: '' });
  };

  const getExplorerUrl = (hash?: string, network?: SupportedNetwork) => {
    if (!hash || !network) return null;
    if (network.includes('solana')) {
      const clusterParam = network === 'solana' ? '' : '?cluster=devnet';
      return `https://solscan.io/tx/${hash}${clusterParam}`;
    }
    const isMainnet = network === 'base';
    const baseUrl = isMainnet ? 'https://basescan.org' : 'https://sepolia.basescan.org';
    return `${baseUrl}/tx/${hash}`;
  };

  const liveSummary = useMemo(() => {
    if (!activeAmountValue || activeAmountValue <= 0) {
      return 'Select an amount to see the impact.';
    }
    const networkLabel = isSolanaSelected ? 'Solana USDC' : 'Base USDC';
    const feeHint = isSolanaSelected ? '≈ 0.0005 SOL fees' : '≈ $0.02 gas';
    return `You're sending $${activeAmountValue.toFixed(2)} via ${networkLabel} · ${feeHint}`;
  }, [activeAmountValue, isSolanaSelected]);
  const donationExplorerUrl = useMemo(() => {
    if (!donationResult?.txHash) return null;
    return getExplorerUrl(donationResult.txHash, donationResult.network || undefined);
  }, [donationResult]);

  // Dynamic chain detection to build correct payload
  const getNetworkFromChain = (chainId?: number): SupportedNetwork => {
    if (chainId === 8453) return 'base';          // Base mainnet
    if (chainId === 84532) return 'base-sepolia'; // Base Sepolia
    return 'base-sepolia'; // Default to testnet for safety
  };

  // Donation using x402 payment flow with Base + Solana support
  const handleDonate = async () => {
    const amount = activeAmountValue ?? parseFloat(customAmount);
    if (!amount || amount < 0.01 || amount > 100) {
      setDonationResult({
        success: false,
        message: 'Please enter a valid donation amount ($0.01-$100.00)',
        networkFamily: selectedNetworkFamily,
      });
      return;
    }

    if (isSolanaSelected && !solanaSigner) {
      setDonationResult({
        success: false,
        message: 'Connect a Solana wallet to donate with USDC on Solana.',
        networkFamily: 'solana',
      });
      return;
    }

    if (!isSolanaSelected && (!isConnected || !walletClient)) {
      setDonationResult({
        success: false,
        message: 'Connect a Base-compatible wallet to donate.',
        networkFamily: 'base',
      });
      return;
    }

    setIsProcessing(true);
    setDonationResult(null);

    const network: SupportedNetwork = isSolanaSelected
      ? resolvedSolanaNetwork
      : getNetworkFromChain(chain?.id);

    try {
      const result = await x402PaymentService.donate(
        amount,
        {
          network,
          evmWalletClient: isSolanaSelected ? undefined : walletClient ?? undefined,
          solanaSigner: isSolanaSelected ? solanaSigner : undefined,
        }
      );

      if (result.success) {
        setDonationResult({
          success: true,
          message: `Thank you for your $${amount.toFixed(2)} donation via ${isSolanaSelected ? 'Solana' : 'Base'}!`,
          txHash: result.rawResponse?.data?.transactionHash,
          networkFamily: selectedNetworkFamily,
          network,
        });
      } else {
        setDonationResult({
          success: false,
          message: result.error || 'Donation failed. Please try again.',
          networkFamily: selectedNetworkFamily,
          network,
        });
      }
    } catch (error: any) {
      console.error('Donation error:', error);
      setDonationResult({
        success: false,
        message: error.message || 'Failed to process donation',
        networkFamily: selectedNetworkFamily,
      });
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Penny.io</h3>
            <p>Content Monetization Reimagined</p>
            {/* Action Buttons */}
            <div className="footer-actions">
              <Link to="/x402-test" className="x402-validation-button">
                <span className="top-key"></span>
                <span className="button-text">
                  <Laptop size={18} />
                  Live Demo
                </span>
                <span className="bottom-key-1"></span>
                <span className="bottom-key-2"></span>
              </Link>
              <button
                type="button"
                className="donate-button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsDonateModalOpen(true);
                }}
              >
                <span className="top-key"></span>
                <span className="button-text">
                  <HeartHandshake size={18} />
                  Donate
                </span>
                <span className="bottom-key-1"></span>
                <span className="bottom-key-2"></span>
              </button>
            </div>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><Link to="/whitepaper"><FileText size={16} /> Whitepaper</Link></li>
              <li><Link to="/about"><Info size={16} /> About</Link></li>
              <li><Link to="/how-it-works"><BookOpen size={16} /> How it works</Link></li>
              <li><Link to="/pricing"><FileText size={16} /> Pricing</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Creators</h4>
            <ul>
              <li><Link to="/write"><PenTool size={16}/>Start writing</Link></li>
              <li><Link to="/dashboard"><LayoutDashboard size={16}/>Dashboard</Link></li>
              <li><Link to="/resources"><Library size={16} /> Resources</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/help"><HelpCircle size={16}/>Help center</Link></li>
              <li><Link to="/contact"><Mail size={16}/>Contact</Link></li>
              <li><Link to="/privacy"><Shield size={16}/>Privacy</Link></li>
              <li><Link to="/terms"><FileText size={16}/>Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Penny.io. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
      {isDonateModalOpen && (
        <div
          className="donation-modal-overlay"
          role="presentation"
          onClick={closeDonateModal}
        >
          <div
            className="donation-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="donation-modal-title"
            ref={modalRef}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="donation-modal-header">
              <div className="donation-modal-title">
                <HeartHandshake size={18} />
                <h3 id="donation-modal-title">Support Penny.io</h3>
              </div>
              <button
                type="button"
                className="donation-modal-close"
                onClick={closeDonateModal}
                aria-label="Close donation modal"
              >
                ×
              </button>
            </div>
            <div className="donation-modal-grid">
              <section className="donation-summary-column">
                <div className="donation-impact-card">
                  <p className="donation-impact-eyebrow">Community impact</p>
                  <h4>Every dollar keeps independent media open.</h4>
                  <p>Donations fuel creator payouts, audits, and new reader experiences.</p>
                </div>
                <ul className="donation-benefits">
                  <li>Direct onchain support—no middlemen.</li>
                  <li>Transparent x402 flows with instant receipts.</li>
                  <li>Supports Base + Solana ecosystems.</li>
                </ul>
                <div className="donation-accepted-networks">
                  <span>Accepts</span>
                  <div className="donation-accepted-icons">
                    <img src="/icons/base.png" alt="Base network icon" />
                    <img src="/icons/solana.png" alt="Solana network icon" />
                  </div>
                </div>
                <div className="donation-trust-card">
                  <p className="donation-trust-eyebrow">Powered by Coinbase x402</p>
                  <p>Audited smart contracts, MPC custody, and hardware-backed signer flows.</p>
                </div>
                <div className="donation-manual-section">
                  <h5>Prefer manual transfer?</h5>
                  <div className="donation-manual-grid">
                    <div className="donation-manual-card">
                      <div className="donation-manual-card__header">
                        <span>Solana address</span>
                        <span className="donation-manual-network">Solana</span>
                      </div>
                      <code className="donation-address-truncated">
                        {solanaAddress.slice(0, 6)}...{solanaAddress.slice(-4)}
                      </code>
                      <button
                        type="button"
                        className="donation-copy-button"
                        onClick={() => handleCopyAddress(solanaAddress)}
                      >
                        {copiedAddress === solanaAddress ? (
                          <>
                            <Check size={14} aria-hidden="true" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} aria-hidden="true" />
                            <span>Copy</span>
                          </>
                        )}
                        <span className="sr-only">Copy Solana donation address</span>
                      </button>
                      <p className="donation-full-address">
                        <small>Full: <code>{solanaAddress}</code></small>
                      </p>
                    </div>
                    <div className="donation-manual-card">
                      <div className="donation-manual-card__header">
                        <span>Base address</span>
                        <span className="donation-manual-network">Base</span>
                      </div>
                      <code className="donation-address-truncated">
                        {baseAddress.slice(0, 6)}...{baseAddress.slice(-4)}
                      </code>
                      <button
                        type="button"
                        className="donation-copy-button"
                        onClick={() => handleCopyAddress(baseAddress)}
                      >
                        {copiedAddress === baseAddress ? (
                          <>
                            <Check size={14} aria-hidden="true" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} aria-hidden="true" />
                            <span>Copy</span>
                          </>
                        )}
                        <span className="sr-only">Copy Base donation address</span>
                      </button>
                      <p className="donation-full-address">
                        <small>Full: <code>{baseAddress}</code></small>
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section className="donation-action-column">
                {!isWalletStateReady ? (
                  <div className="donation-action-skeleton" aria-hidden="true">
                    <span className="donation-skeleton-line"></span>
                    <span className="donation-skeleton-pill"></span>
                    <span className="donation-skeleton-pill wide"></span>
                    <span className="donation-skeleton-line"></span>
                  </div>
                ) : (
                  <>
                    <section
                      className="donation-methods"
                      role="radiogroup"
                      aria-label="Select donation network"
                    >
                      <div className="method-header">
                        <div>
                          <p>Pick your network</p>
                          <span>Base + Solana both settle in USDC.</span>
                        </div>
                      </div>
                      <div className="method-grid">
                        {donationNetworkOptions.map(option => {
                          const isActive = selectedNetworkFamily === option.family;
                          return (
                            <button
                              key={option.family}
                              type="button"
                              role="radio"
                              aria-checked={isActive}
                              aria-label={option.title}
                              className={`method-card donation-method-card${isActive ? ' is-active' : ''}`}
                              onClick={() => {
                                setSelectedNetworkFamily(option.family);
                                persistDonationPreferences({ networkFamily: option.family });
                              }}
                              disabled={!option.isReady && !isActive}
                              title={option.tooltip}
                            >
                              <span className="method-card__icon" aria-hidden="true">
                                <img src={option.icon} alt="" />
                              </span>
                              <span className="method-card__body">
                                <span className="method-card__title">{option.title}</span>
                                <span className="method-card__helper">{option.helper}</span>
                                <span className="method-card__meta">{option.speed}</span>
                              </span>
                              <span className={`method-card__badge ${option.badgeVariant === 'warning' ? 'is-warning' : 'is-success'}`}>
                                {option.badgeText}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </section>
                    <section className="donation-amount-module">
                      <p className="donation-modal-description">
                        Select an amount to donate via {donationNetworkLabel}.
                      </p>
                      <div
                        className="donation-amount-scroller"
                        role="group"
                        aria-label="Choose donation amount"
                      >
                        {predefinedAmounts.map(amount => (
                          <button
                            key={amount}
                            type="button"
                            className={`donation-amount-chip ${selectedAmount === amount ? 'is-active' : ''}`}
                            onClick={() => {
                              setAmountSelection(amount, '');
                            }}
                            disabled={isProcessing}
                          >
                            <span>${amount}</span>
                          </button>
                        ))}
                      </div>
                      <div
                        className="donation-quick-actions"
                        role="group"
                        aria-label="Quick amount adjustments"
                      >
                        {DONATION_QUICK_ACTIONS.map(action => (
                          <button
                            key={action.label}
                            type="button"
                            className="donation-quick-action"
                            onClick={() => handleQuickAction(action.delta)}
                            disabled={isProcessing}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                      <div className="custom-amount-input donation-custom-input">
                        <label htmlFor="custom-amount">Or enter custom amount</label>
                        <input
                          id="custom-amount"
                          type="number"
                          min="0.01"
                          max="100"
                          step="0.01"
                          placeholder="Enter amount ($0.01-$100.00)"
                          value={customAmount}
                          onChange={(e) => {
                            setAmountSelection(null, e.target.value);
                          }}
                          disabled={isProcessing}
                        />
                        <small>Min $0.01 · Max $100.00</small>
                      </div>
                      <div className="donation-impact-tiers">
                        {DONATION_IMPACT_TIERS.map(tier => (
                          <button
                            key={tier.label}
                            type="button"
                            className="donation-impact-tier"
                            onClick={() => setAmountSelection(tier.amount, '')}
                            disabled={isProcessing}
                          >
                            <span className="donation-impact-tier__label">{tier.label}</span>
                            <span className="donation-impact-tier__amount">${tier.amount}</span>
                            <span className="donation-impact-tier__description">{tier.description}</span>
                          </button>
                        ))}
                      </div>
                    </section>
                    <p className="donation-live-summary" aria-live="polite">
                      {liveSummary}
                    </p>
                    {!isSelectedNetworkReady && (
                      <div className="donation-warning" role="alert">
                        <p>
                          {isSolanaSelected
                            ? 'Connect a Solana wallet to donate in Solana USDC.'
                            : 'Connect an EVM wallet to donate in Base USDC.'}
                        </p>
                        <div className="donation-warning__hint">
                          <AppKitConnectButton />
                          <span>Connect wallet</span>
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      className="donation-submit-button"
                      onClick={handleDonate}
                      disabled={isProcessing || !isSelectedNetworkReady || !activeAmountValue}
                    >
                      {isProcessing ? 'Processing...' : `Send ${donationNetworkLabel}`}
                    </button>
                    <div className="donation-status-region" aria-live="polite" aria-atomic="true">
                      {donationResult && (
                        <div className={`donation-alert donation-alert--${donationResult.success ? 'success' : 'error'}`} role="alert">
                          <p>{donationResult.message}</p>
                          {donationResult.txHash && (
                            <p className="donation-tx-hash">
                              Transaction:{' '}
                              <code>{donationResult.txHash.slice(0, 10)}...{donationResult.txHash.slice(-8)}</code>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    {donationResult?.success && (
                      <div className="donation-share-actions">
                        <button
                          type="button"
                          className="donation-share-link"
                          onClick={handleCopyShareLink}
                        >
                          {shareLinkCopied ? 'Link copied' : 'Copy shareable donation link'}
                        </button>
                        {donationExplorerUrl && (
                          <a
                            href={donationExplorerUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="donation-share-link view-transaction"
                          >
                            View transaction
                          </a>
                        )}
                      </div>
                    )}
                  </>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
export default Footer;
