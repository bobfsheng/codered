const techList = [
  { name: 'Apple', symbol: 'AAPL' },
  { name: 'Tesla', symbol: 'TSLA' },
  { name: 'Netflix', symbol: 'NFLX' },
  { name: 'Microsoft', symbol: 'MSFT' },
  { name: 'Google', symbol: 'GOOGL' },
  { name: 'Salesforce', symbol: 'CRM' },
  { name: 'Intel', symbol: 'INTC' },
  { name: 'Advanced Micro Devices', symbol: 'AMD' },
  { name: 'NVIDIA', symbol: 'NVDA' },
  { name: 'Oracle Corporation', symbol: 'ORCL' },
]

const bullList = [
  { name: 'ProShares UltraPro QQQ', symbol: 'TQQQ' },
  { name: 'Direxion Daily Semiconductor Bull 3x Shares', symbol: 'SOXL' },
  { name: 'Direxion Daily S&P 500 Bull 3X Shares', symbol: 'SPXL' },
  { name: 'ProShares UltraPro S&P500', symbol: 'UPRO' },
  { name: 'Direxion Daily Financial Bull 3X Shares', symbol: 'FAS' },
  { name: 'Direxion Daily Technology Bull 3X Shares', symbol: 'TECL' },
  { name: 'iShares Russell 2000 Growth ETF', symbol: 'IWO' },
  { name: 'Vanguard Growth ETF', symbol: 'VUG' },
  { name: 'iShares Core S&P U.S. Growth ETF', symbol: 'IUSG' },
]

const cryptoList = [
  { name: 'Bitcoin', symbol: 'BTC/USD' },
  { name: 'Ethereum', symbol: 'ETH/USD' },
  { name: 'Ethereum/Bitcoin', symbol: 'ETH/BTC' },
  { name: 'Dodge Coin', symbol: 'DOGE/USD' },
  { name: 'Litecoin', symbol: 'LTC/USD' },
  { name: 'Shiba Inu', symbol: 'SHIB/USD' },
  { name: 'Sushi', symbol: 'SUSHI/USD' },
  { name: 'Uniswap', symbol: 'UNI/USD' },
  { name: 'Yearn', symbol: 'YFI/USD' },
  { name: 'Chainlink', symbol: 'LINK/USD' },
  { name: 'Aave', symbol: 'AAVE/USD' },
  { name: 'Avalache', symbol: 'AVAX/USD' },
  { name: 'Basic Attention Token', symbol: 'BAT/USD' },
  { name: 'Graph', symbol: 'GRT/USD' },
]

const bearList = [
  { name: 'ProShares UltraPro Short QQQ', symbol: 'SQQQ' },
  { name: 'Dow30 Short', symbol: 'SDOW' },
  { name: 'S&P', symbol: 'SPXU' },
  { name: 'ProShares UltraShort S&P', symbol: 'SDS' },
  { name: 'Bear 2X Shares', symbol: 'DUST' },
  { name: 'Bear 3X Shares', symbol: 'TZA' },
  { name: 'ProShares Short QQQ', symbol: 'PSQ' },
  { name: 'ProShares Short S&P500', symbol: 'SH' },
  { name: 'ProShares UltraShort Dow30', symbol: 'DXD' },
]

const etfList = [
  { name: 'ProShares UltraPro QQQ', symbol: 'TQQQ' },
  { name: 'Dow30 Short', symbol: 'SDOW' },
  { name: 'S&P', symbol: 'SPXU' },
  { name: 'ProShares UltraPro QQQ', symbol: 'TQQQ' },
  { name: 'Direxion Daily Semiconductor Bull 3x Shares', symbol: 'SOXL' },
  { name: 'Direxion Daily S&P 500 Bull 3X Shares', symbol: 'SPXL' },
  { name: 'SPDR S&P 500 ETF Trust', symbol: 'SPY' },
  { name: 'iShares MSCI Emerging Markets ETF', symbol: 'EEM' },
  { name: 'Vanguard Total Stock Market ETF', symbol: 'VTI' },
]

const popularList = [
  { name: 'Apple', symbol: 'AAPL' },
  { name: 'Amazon', symbol: 'AMZN' },
  { name: 'NIO', symbol: 'NIO' },
  { name: 'Chevron Corp', symbol: 'CVX' },
  { name: 'Palantir', symbol: 'PLTR' },
  { name: 'NVIDIA Corp', symbol: 'NVDA' },
  { name: 'Bank of America', symbol: 'BAC' },
  { name: 'Coca-Cola', symbol: 'KO' },
  { name: 'Exxon Mobil', symbol: 'XOM' },
  { name: 'Ford Motor Company', symbol: 'F' },
]

const bioList = [
  { name: 'XBiotech Inc.', symbol: 'XBIT' },
  { name: 'Pfizer', symbol: 'PFE' },
  { name: 'AstraZeneca', symbol: 'AZN' },
  { name: 'Gilead Sciences', symbol: 'GILD' },
  { name: 'Novavax', symbol: 'NVAX' },
  { name: 'Neurocrine Biosciences Inc.', symbol: 'NBIX' },
  { name: 'Regeneron Pharmaceuticals', symbol: 'REGN' },
  { name: 'Vertex Pharmaceuticals', symbol: 'VRTX' },
  { name: 'Biogen', symbol: 'BIIB' },
]

const energyList = [
  { name: 'NextEra Energy Inc.', symbol: 'NEE' },
  { name: 'ONEOK Inc.', symbol: 'OKE' },
  { name: 'Baker Hughes Co.', symbol: 'BKR' },
  { name: 'Williams Companies Inc.', symbol: 'WMB' },
  { name: 'Antero Midstream Corp.', symbol: 'AM' },
  { name: 'Targa Resources Corp.', symbol: 'TRGP' },
  { name: 'Exxon Mobil', symbol: 'XOM' },
  { name: 'Chevron', symbol: 'CVX' },
  { name: 'Schlumberger', symbol: 'SLB' },
]


const estateList = [
  { name: 'American Tower Corporation', symbol: 'AMT' },
  { name: 'Prologis', symbol: 'PLD' },
  { name: 'Crown Castle International Corp.', symbol: 'CCI' },
  { name: 'Equinix, Inc.', symbol: 'EQIX' },
  { name: 'Public Storage ', symbol: 'PSA' },
  { name: 'Realty Income Corporation', symbol: 'O' },
  { name: 'Simon Property Group', symbol: 'SPG' },
  { name: 'Welltower', symbol: 'WELL' },
  { name: 'AvalonBay Communities', symbol: 'AVB' },
]

export {
  techList,
  bullList,
  cryptoList,
  bearList,
  estateList,
  energyList,
  bioList,
  etfList,
  popularList,
}
