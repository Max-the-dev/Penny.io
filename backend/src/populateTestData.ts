import Database from './database';
import { Author, SupportedAuthorNetwork } from './types';

const PLATFORM_BASE_ADDRESS =
  process.env.X402_PLATFORM_EVM_ADDRESS ||
  '0xEc115640B09416a59fE77e4e7b852fE700Fa6bF1';
const PLATFORM_SOL_ADDRESS =
  process.env.X402_PLATFORM_SOL_ADDRESS || 'cAXdcMFHK6y9yTP7AMETzXC7zvTeDBbQ5f4nvSWDx51';

const SEED_AUTHORS: Array<Pick<Author, 'address' | 'primaryPayoutNetwork' | 'createdAt'>> = [
  {
    address: PLATFORM_BASE_ADDRESS,
    primaryPayoutNetwork: 'base',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    address: PLATFORM_SOL_ADDRESS,
    primaryPayoutNetwork: 'solana',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

const VALIDATION_PRICE_USD = 0.01;

type ValidationArticleConfig = {
  title: string;
  content: string;
  authorAddress: string;
  authorPrimaryNetwork: SupportedAuthorNetwork;
};

const VALIDATION_ARTICLES: ValidationArticleConfig[] = [
  {
    title: 'x402 Harness: Base Mainnet Purchase',
    content:
      '<p>Use this article to validate Base mainnet purchases via the Coinbase x402 facilitator.</p><p>It is pinned to the platform Base wallet and costs exactly $0.01.</p>',
    authorAddress: PLATFORM_BASE_ADDRESS,
    authorPrimaryNetwork: 'base',
  },
  {
    title: 'x402 Harness: Base Regression Article',
    content:
      '<p>Second Base article for regression testing. Keeping a sibling entry ensures we can purchase twice without violating 1 purchase per wallet per article rule.</p><p>Also priced at $0.01.</p>',
    authorAddress: PLATFORM_BASE_ADDRESS,
    authorPrimaryNetwork: 'base',
  },
  {
    title: 'x402 Harness: Solana Validation Article',
    content:
      '<p>This article is tied to the Solana payout address so the harness can walk through SPL USDC purchases.</p><p>It mirrors the Base price ($0.01) for consistency across networks.</p>',
    authorAddress: PLATFORM_SOL_ADDRESS,
    authorPrimaryNetwork: 'solana',
  },
];

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function generatePreview(content: string): string {
  return content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300);
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, ' ');
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  return `${minutes} min read`;
}

async function populateDatabase() {
  const db = new Database();

  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    console.log('🚀 Starting x402 validation seed...\n');

    console.log('👥 Ensuring platform authors exist...');
    for (const author of SEED_AUTHORS) {
      await db.createOrUpdateAuthor({
        ...author,
        totalEarnings: 0,
        totalArticles: 0,
        totalViews: 0,
        totalPurchases: 0,
      });
      console.log(`   ↳ ${formatAddress(author.address)} (${author.primaryPayoutNetwork})`);
    }

    console.log('\n🧪 Creating fixed validation articles...\n');
    for (const config of VALIDATION_ARTICLES) {
      const timestamp = new Date().toISOString();
      const payload = {
        title: config.title,
        content: config.content,
        preview: generatePreview(config.content),
        price: VALIDATION_PRICE_USD,
        authorAddress: config.authorAddress,
        authorPrimaryNetwork: config.authorPrimaryNetwork,
        publishDate: timestamp,
        createdAt: timestamp,
        updatedAt: timestamp,
        views: 0,
        purchases: 0,
        earnings: 0,
        readTime: calculateReadTime(config.content),
        categories: ['Validation'],
        likes: 0,
        popularityScore: 0,
      };

      const created = await db.createArticle(payload);
      console.log(
        `✅ Article "${config.title}" created (ID ${created.id}) for ${config.authorPrimaryNetwork.toUpperCase()}`
      );
    }

    console.log('\n✨ x402 validation seed complete!');
    console.log(`📊 Ensured ${SEED_AUTHORS.length} authors and ${VALIDATION_ARTICLES.length} articles exist.`);
  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    db.close();
  }
}

populateDatabase();
