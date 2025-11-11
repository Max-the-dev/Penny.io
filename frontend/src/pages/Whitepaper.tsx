import { FileText, BookOpen, Code, Image } from 'lucide-react';

function Whitepaper() {
  return (
    <div className="whitepaper-page">
      <div className="container">
        {/* Hero Section */}
        <div className="whitepaper-hero">
          <div className="hero-icon">
            <FileText size={48} />
          </div>
          <h1>Penny.io Technical Whitepaper</h1>
          <p className="hero-subtitle">
            A comprehensive guide to micropayment-based content monetization using the x402 protocol
          </p>
          <div className="whitepaper-meta">
            <span>Version 1.0</span>
            <span>•</span>
            <span>January 2025</span>
          </div>
        </div>

        {/* Table of Contents */}
        <section className="whitepaper-section toc-section">
          <h2>Table of Contents</h2>
          <div className="toc">
            <p className="toc-placeholder">
              Table of contents will be auto-generated from your whitepaper content headings.
            </p>
          </div>
        </section>

        {/* Content Area - Ready for rich text */}
        <section className="whitepaper-section">
          <div className="whitepaper-content">
            {/* Placeholder content structure - replace with your actual whitepaper */}
            <h2>Abstract</h2>
            <p>
              Your whitepaper abstract goes here. This section provides a high-level overview
              of the problem, solution, and key innovations presented in this document.
            </p>

            <h2>1. Introduction</h2>
            <p>
              Your introduction content goes here. This area is styled and ready to receive
              your full whitepaper content with proper formatting.
            </p>

            {/* Code Block Example */}
            <div className="code-block-container">
              <div className="code-block-header">
                <Code size={16} />
                <span>Example Code Snippet</span>
              </div>
              <pre className="code-block">
                <code>{`// Example code snippet placeholder
function processPayment(amount, recipient) {
  // x402 payment logic
  return executeTransaction(amount, recipient);
}`}</code>
              </pre>
            </div>

            {/* Diagram/Image Placeholder */}
            <div className="diagram-container">
              <div className="diagram-placeholder">
                <Image size={48} />
                <p>Diagram or image placeholder</p>
                <span>Replace with your actual diagrams, charts, or architecture images</span>
              </div>
            </div>

            <h2>2. Technical Architecture</h2>
            <p>
              Your technical architecture content goes here. Include detailed explanations,
              diagrams, and code examples as needed.
            </p>

            <h3>2.1 System Components</h3>
            <p>Subsection content goes here...</p>

            <h3>2.2 Payment Flow</h3>
            <p>Subsection content goes here...</p>

            <h2>3. Protocol Specifications</h2>
            <p>
              Your protocol specifications content goes here. This section is formatted to
              accommodate technical documentation with code snippets and diagrams.
            </p>

            <h2>4. Implementation Details</h2>
            <p>Implementation details content goes here...</p>

            <h2>5. Conclusion</h2>
            <p>
              Your conclusion content goes here. Summarize key points and future directions.
            </p>
          </div>
        </section>

        {/* Download Section */}
        <section className="whitepaper-section download-section">
          <div className="download-card">
            <BookOpen size={32} />
            <h3>Download PDF Version</h3>
            <p>Get the complete whitepaper in PDF format for offline reading.</p>
            <button className="download-button" disabled>
              <FileText size={16} />
              Download PDF (Coming Soon)
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Whitepaper;
