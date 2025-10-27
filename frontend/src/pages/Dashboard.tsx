import { useWallet } from '../contexts/WalletContext';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { TrendingUp, DollarSign, Eye, Users, Calendar, Edit3 } from 'lucide-react';

// Mock analytics data
const mockArticles = [
  {
    id: 1,
    title: "Building Scalable Web3 Applications with x402 Protocol",
    publishDate: "2024-10-20",
    price: 0.12,
    views: 1247,
    purchases: 89,
    earnings: 10.68,
    readTime: "8 min"
  },
  {
    id: 2,
    title: "The Future of Creator Economy: Beyond Subscriptions",
    publishDate: "2024-10-18",
    price: 0.08,
    views: 892,
    purchases: 156,
    earnings: 12.48,
    readTime: "6 min"
  },
  {
    id: 3,
    title: "Smart Contract Security Best Practices in 2024",
    publishDate: "2024-10-15",
    price: 0.15,
    views: 2108,
    purchases: 203,
    earnings: 30.45,
    readTime: "12 min"
  }
];

const mockStats = {
  totalEarnings: 53.61,
  totalArticles: 3,
  totalViews: 4247,
  totalPurchases: 448,
  conversionRate: 10.5,
  thisMonthEarnings: 24.13,
  lastMonthEarnings: 29.48,
  avgEarningsPerArticle: 17.87
};

function Dashboard() {
  const { isConnected, address, balance } = useWallet();

  if (!isConnected) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="connect-prompt">
            <h1>Connect Your Wallet</h1>
            <p>Connect your wallet to access your writer dashboard and start earning from your content.</p>
            <ConnectButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Writer Dashboard</h1>
          <div className="wallet-info">
            <p><strong>Address:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}</p>
            <p><strong>Balance:</strong> {balance}</p>
          </div>
        </div>
        
        {/* Main Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <h3>Total Earnings</h3>
              <p className="stat-value">${mockStats.totalEarnings.toFixed(2)}</p>
              <span className="stat-change positive">+${(mockStats.thisMonthEarnings - mockStats.lastMonthEarnings).toFixed(2)} this month</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Edit3 size={24} />
            </div>
            <div className="stat-content">
              <h3>Articles Published</h3>
              <p className="stat-value">{mockStats.totalArticles}</p>
              <span className="stat-change">Avg. ${mockStats.avgEarningsPerArticle.toFixed(2)} per article</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Eye size={24} />
            </div>
            <div className="stat-content">
              <h3>Total Views</h3>
              <p className="stat-value">{mockStats.totalViews.toLocaleString()}</p>
              <span className="stat-change">{mockStats.conversionRate}% conversion rate</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>Total Purchases</h3>
              <p className="stat-value">{mockStats.totalPurchases}</p>
              <span className="stat-change">{(mockStats.totalPurchases / mockStats.totalViews * 100).toFixed(1)}% of viewers</span>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="performance-section">
          <h2>Performance Overview</h2>
          <div className="performance-grid">
            <div className="performance-card">
              <h3>This Month</h3>
              <div className="performance-stat">
                <span className="performance-value">${mockStats.thisMonthEarnings.toFixed(2)}</span>
                <span className="performance-label">Earnings</span>
              </div>
            </div>
            <div className="performance-card">
              <h3>Last Month</h3>
              <div className="performance-stat">
                <span className="performance-value">${mockStats.lastMonthEarnings.toFixed(2)}</span>
                <span className="performance-label">Earnings</span>
              </div>
            </div>
            <div className="performance-card">
              <h3>Growth</h3>
              <div className="performance-stat">
                <span className={`performance-value ${mockStats.thisMonthEarnings > mockStats.lastMonthEarnings ? 'positive' : 'negative'}`}>
                  {mockStats.thisMonthEarnings > mockStats.lastMonthEarnings ? '+' : ''}
                  {(((mockStats.thisMonthEarnings - mockStats.lastMonthEarnings) / mockStats.lastMonthEarnings) * 100).toFixed(1)}%
                </span>
                <span className="performance-label">Month over Month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="articles-section">
          <div className="articles-header">
            <h2>Your Articles</h2>
            <a href="/write" className="write-new-btn">
              <Edit3 size={18} />
              Write New Article
            </a>
          </div>
          
          <div className="articles-table">
            <div className="table-header">
              <div className="table-cell">Article</div>
              <div className="table-cell">Published</div>
              <div className="table-cell">Price</div>
              <div className="table-cell">Views</div>
              <div className="table-cell">Purchases</div>
              <div className="table-cell">Earnings</div>
              <div className="table-cell">Rate</div>
            </div>
            
            {mockArticles.map((article) => (
              <div key={article.id} className="table-row">
                <div className="table-cell article-info">
                  <div className="article-title">{article.title}</div>
                  <div className="article-meta">{article.readTime} read</div>
                </div>
                <div className="table-cell">
                  {new Date(article.publishDate).toLocaleDateString()}
                </div>
                <div className="table-cell">
                  ${article.price.toFixed(2)}
                </div>
                <div className="table-cell">
                  {article.views.toLocaleString()}
                </div>
                <div className="table-cell">
                  {article.purchases}
                </div>
                <div className="table-cell earnings">
                  ${article.earnings.toFixed(2)}
                </div>
                <div className="table-cell">
                  {((article.purchases / article.views) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;