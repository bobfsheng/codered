const bull = require('@assets/images/exp/bullLong.png')
const bio = require('@assets/images/exp/bioLong.png')
const bear = require('@assets/images/exp/bearLong.png')
const energy = require('@assets/images/exp/energyLong.png')
const estate = require('@assets/images/exp/estateLong.png')
const etf = require('@assets/images/exp/etfLong.png')
const popular = require('@assets/images/exp/popularLong.png')
const crypto = require('@assets/images/exp/popularLong.png')
const tech = require('@assets/images/exp/techLong.png')

const headerbull = require('@assets/images/exp/bull.png')
const headerbio = require('@assets/images/exp/bio.png')
const headerbear = require('@assets/images/exp/bear.png')
const headerenergy = require('@assets/images/exp/energy.png')
const headerestate = require('@assets/images/exp/estate.png')
const headeretf = require('@assets/images/exp/etf.png')
const headerpopular = require('@assets/images/exp/popular.png')
const headercrypto = require('@assets/images/exp/crypto.png')
const headertech = require('@assets/images/exp/tech.png')

const exploreArray = [
  {
    category: tech,
    catString: 'tech',
    mainHeader: headertech,
    fullString: 'Technology 💻',
    fullStringE: 'Technology Stocks',
    emoji: '💻',
    description: `Most popular technology companies' stocks`,
    gradientColors: ['#42A5F5', '#1E88E5'],
  },
  {
    category: bull,
    catString: 'bull',
    mainHeader: headerbull,
    fullString: 'Bullish ETFs 🐂',
    fullStringE: 'Bullish ETFs',
    emoji: '🐂',
    description: `Funds that follow asset classes, such as stocks, bonds and commodity futures`,
    gradientColors: ['#66BB6A', '#43A047'],
  },
  {
    category: bear,
    catString: 'bear',
    mainHeader: headerbear,
    fullString: 'Bearish ETFs 🐻',
    fullStringE: 'Bearish ETFs',
    emoji: '🐻',
    description:
      'Funds that follow the opposite gain of stocks, bonds and commodity futures',
    gradientColors: ['#EF5350', '#E53935'],
  },
  {
    category: popular,
    catString: 'popular',
    mainHeader: headerpopular,
    fullString: 'Popular 🚀',
    fullStringE: 'Popular Stocks',
    emoji: '🚀',
    description: 'Most popular stocks in the market, explore, trade and keep track.',
    gradientColors: ['#FFCA28', '#FFA726'],
  },
  {
    category: energy,
    catString: 'energy',
    mainHeader: headerenergy,
    fullString: 'Energy ⚡️',
    fullStringE: 'Energy Stocks',
    emoji: '⚡️',
    description: 'Stocks in alternative, sustainable and conventional energy sources.',
    gradientColors: ['orange', 'red'],
  },
  {
    category: bio,
    catString: 'bio',
    mainHeader: headerbio,
    fullString: 'Biotech 💉',
    fullStringE: 'Biotech Stocks',
    emoji: '💉',
    description: 'Stocks in alternative, sustainable and conventional energy sources.',
    gradientColors: ['#AB47BC', 'lightpink'],
  },
  {
    category: estate,
    catString: 'estate',
    mainHeader: headerestate,
    fullString: 'Real Estate 🌃',
    fullStringE: 'Real Estate Stocks',
    emoji: '🌃',
    description: 'Stocks in pharmacueticals, biotech and medicine.',
    gradientColors: ['#8D6E63', '#6D4C41'],
  },
  {
    category: crypto,
    catString: 'crypto',
    mainHeader: headercrypto,
    fullString: 'Crypto 💲',
    fullStringE: 'Cryptocurrencies',
    emoji: '💲',
    description:
      'Real estate stocks on the spotlight. Explore the largest real estate companies',
    gradientColors: ['silver', 'gray'],
  },
  {
    category: etf,
    catString: 'etf',
    mainHeader: headeretf,
    fullStringE: 'Popular ETFs',
    emoji: '🏆',
    description:
      'Funds that follow asset classes, such as stocks, bonds and commodity futures',
    gradientColors: ['#5C6BC0', '#3949AB'],
  },

  // { category: crypto, catString: 'crypto', mainHeader: headercrypto, fullString: 'Crypto ' },
]

const exploreArrayTwo = [
  { category: tech, catString: 'tech', mainHeader: headertech },
  // { category: crypto, catString: 'crypto', mainHeader: headercrypto },
  { category: bull, catString: 'bull', mainHeader: headerbull },
  { category: bear, catString: 'bear', mainHeader: headerbear },
  { category: popular, catString: 'popular', mainHeader: headerpopular },
  { category: energy, catString: 'energy', mainHeader: headerenergy },
  { category: bio, catString: 'bio', mainHeader: headerbio },
  { category: estate, catString: 'estate', mainHeader: headerestate },
  { category: etf, catString: 'etf', mainHeader: headeretf },
]

export { exploreArray, exploreArrayTwo }
