import { BookOpen, Code, FileText, Video, Download, ExternalLink, Lightbulb, Zap, Shield, Users } from 'lucide-react';

function Resources() {
  return (
    <div className="resources-page">
      <div className="container">
        {/* Hero Section */}
        <div className="resources-hero">
          <h1>Resources & Documentation</h1>
          <p className="hero-subtitle">
            Everything you need to get started with Penny.io. <br />
            From quick guides to technical documentation.
          </p>
        </div>

        {/* Quick Start Section */}
        <section className="resources-section">
          <div className="section-header">
            <Zap size={32} />
            <h2>Quick Start Guides</h2>
          </div>
          <p className="section-description">
            Get up and running quickly with these step-by-step guides for common tasks.
          </p>
          
          <div className="guides-grid">
            <div className="guide-card">
              <div className="guide-icon">
                <BookOpen size={24} />
              </div>
              <h3>Reading Your First Article</h3>
              <p>Learn how to browse, preview, and purchase articles on Penny.io in just a few minutes.</p>
              <div className="guide-steps">
                <div className="guide-step">1. Browse available articles</div>
                <div className="guide-step">2. Connect your wallet</div>
                <div className="guide-step">3. Purchase and read</div>
              </div>
            </div>
            
            <div className="guide-card">
              <div className="guide-icon">
                <FileText size={24} />
              </div>
              <h3>Publishing Your First Article</h3>
              <p>Complete guide to writing, pricing, and publishing your content for micropayments.</p>
              <div className="guide-steps">
                <div className="guide-step">1. Connect your wallet</div>
                <div className="guide-step">2. Write your content</div>
                <div className="guide-step">3. Set price and publish</div>
              </div>
            </div>
            
            <div className="guide-card">
              <div className="guide-icon">
                <Shield size={24} />
              </div>
              <h3>Wallet Setup Guide</h3>
              <p>Step-by-step instructions for setting up and connecting popular crypto wallets.</p>
              <div className="guide-steps">
                <div className="guide-step">1. Choose a wallet</div>
                <div className="guide-step">2. Install and setup</div>
                <div className="guide-step">3. Connect to Penny.io</div>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section className="resources-section">
          <div className="section-header">
            <Code size={32} />
            <h2>Technical Documentation</h2>
          </div>
          <p className="section-description">
            Detailed technical information for developers and advanced users.
          </p>
          
          <div className="docs-grid">
            <div className="doc-item">
              <h3>x402 Protocol Integration</h3>
              <p>Learn how Penny.io implements the x402 micropayment protocol for seamless content monetization.</p>
              <div className="doc-tags">
                <span className="doc-tag">Protocol</span>
                <span className="doc-tag">Technical</span>
              </div>
            </div>
            
            <div className="doc-item">
              <h3>Supported Blockchain Networks</h3>
              <p>Complete list of supported networks, their fees, and performance characteristics.</p>
              <div className="doc-tags">
                <span className="doc-tag">Blockchain</span>
                <span className="doc-tag">Networks</span>
              </div>
            </div>
            
            <div className="doc-item">
              <h3>Smart Contract Addresses</h3>
              <p>Official smart contract addresses for all supported networks and security verification.</p>
              <div className="doc-tags">
                <span className="doc-tag">Smart Contracts</span>
                <span className="doc-tag">Security</span>
              </div>
            </div>
            
            <div className="doc-item">
              <h3>API Documentation</h3>
              <p>REST API endpoints for developers building applications on top of Penny.io.</p>
              <div className="doc-tags">
                <span className="doc-tag">API</span>
                <span className="doc-tag">Development</span>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="resources-section">
          <div className="section-header">
            <Lightbulb size={32} />
            <h2>Best Practices</h2>
          </div>
          
          <div className="practices-container">
            <div className="practice-category">
              <h3>For Writers</h3>
              <div className="practice-list">
                <div className="practice-item">
                  <strong>Pricing Strategy:</strong> Start with lower prices ($0.01-$0.05) to build readership, then adjust based on engagement.
                </div>
                <div className="practice-item">
                  <strong>Content Quality:</strong> Focus on providing clear value. Well-researched, actionable content performs best.
                </div>
                <div className="practice-item">
                  <strong>Article Length:</strong> 500-1500 words typically work well for micropayments. Match length to price.
                </div>
                <div className="practice-item">
                  <strong>Preview Optimization:</strong> Write compelling previews that give readers a taste without giving away everything.
                </div>
              </div>
            </div>
            
            <div className="practice-category">
              <h3>For Readers</h3>
              <div className="practice-list">
                <div className="practice-item">
                  <strong>Wallet Security:</strong> Never share your private keys. Use hardware wallets for larger amounts.
                </div>
                <div className="practice-item">
                  <strong>Network Choice:</strong> Use Polygon or Base networks to minimize transaction fees.
                </div>
                <div className="practice-item">
                  <strong>Preview Reading:</strong> Always read the preview carefully to ensure the content matches your interests.
                </div>
                <div className="practice-item">
                  <strong>Supporting Authors:</strong> Consider tipping authors whose content you find particularly valuable.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Tutorials Section */}
        <section className="resources-section">
          <div className="section-header">
            <Video size={32} />
            <h2>Video Tutorials</h2>
          </div>
          
          <div className="videos-grid">
            <div className="video-card">
              <div className="video-placeholder">
                <Video size={48} />
                <span>Coming Soon</span>
              </div>
              <h3>Getting Started with Penny.io</h3>
              <p>5-minute walkthrough of the platform for new users.</p>
              <span className="video-duration">5:23</span>
            </div>
            
            <div className="video-card">
              <div className="video-placeholder">
                <Video size={48} />
                <span>Coming Soon</span>
              </div>
              <h3>Setting Up MetaMask</h3>
              <p>Complete guide to installing and configuring MetaMask.</p>
              <span className="video-duration">8:15</span>
            </div>
            
            <div className="video-card">
              <div className="video-placeholder">
                <Video size={48} />
                <span>Coming Soon</span>
              </div>
              <h3>Maximizing Your Earnings</h3>
              <p>Advanced strategies for content creators on the platform.</p>
              <span className="video-duration">12:41</span>
            </div>
          </div>
        </section>

        {/* Downloads Section */}
        <section className="resources-section">
          <div className="section-header">
            <Download size={32} />
            <h2>Downloads & Tools</h2>
          </div>
          
          <div className="downloads-grid">
            <div className="download-item">
              <div className="download-icon">
                <FileText size={24} />
              </div>
              <div className="download-content">
                <h3>Writer's Toolkit</h3>
                <p>Templates and guidelines for creating successful micropayment content.</p>
                <button className="download-button">
                  <Download size={16} />
                  Download PDF
                </button>
              </div>
            </div>
            
            <div className="download-item">
              <div className="download-icon">
                <Code size={24} />
              </div>
              <div className="download-content">
                <h3>Developer SDK</h3>
                <p>JavaScript SDK for integrating Penny.io into your applications.</p>
                <button className="download-button">
                  <ExternalLink size={16} />
                  View on GitHub
                </button>
              </div>
            </div>
            
            <div className="download-item">
              <div className="download-icon">
                <Shield size={24} />
              </div>
              <div className="download-content">
                <h3>Security Audit Report</h3>
                <p>Third-party security audit of our smart contracts and platform.</p>
                <button className="download-button">
                  <Download size={16} />
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="resources-section">
          <div className="section-header">
            <Users size={32} />
            <h2>Community & Support</h2>
          </div>
          
          <div className="community-links">
            <div className="community-item">
              <h3>Discord Community</h3>
              <p>Join our Discord server to connect with other users, get help, and share feedback.</p>
              <a href="#" className="community-link">
                <ExternalLink size={16} />
                Join Discord
              </a>
            </div>
            
            <div className="community-item">
              <h3>GitHub Repository</h3>
              <p>Contribute to the project, report bugs, and view our open-source code.</p>
              <a href="#" className="community-link">
                <ExternalLink size={16} />
                View on GitHub
              </a>
            </div>
            
            <div className="community-item">
              <h3>Developer Forum</h3>
              <p>Technical discussions, integration help, and developer resources.</p>
              <a href="#" className="community-link">
                <ExternalLink size={16} />
                Visit Forum
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="resources-section">
          <div className="faq-preview">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions. For more detailed help, visit our Help Center.</p>
            
            <div className="faq-items">
              <div className="faq-item">
                <h4>What wallets are supported?</h4>
                <p>MetaMask, Coinbase Wallet, WalletConnect, and most Ethereum-compatible wallets.</p>
              </div>
              
              <div className="faq-item">
                <h4>How much do transactions cost?</h4>
                <p>Network fees range from $0.001 on Polygon to $0.02 on Base. No platform fees.</p>
              </div>
              
              <div className="faq-item">
                <h4>Can I publish content for free?</h4>
                <p>Yes, publishing is free. You only pay small network fees when readers purchase your articles.</p>
              </div>
            </div>
            
            <div className="faq-cta">
              <a href="/help" className="cta-button primary">Visit Help Center</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Resources;