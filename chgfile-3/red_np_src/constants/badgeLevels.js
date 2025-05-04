//Badge Levels are assigned according to weekly lowest - max and min refer to lowest range
const badgeLevels = [
  { name: "Gordon Gekko's Heir", lowest: 0, highest: 1, percent: 'Top 1' },
  { name: 'Investment Icon', lowest: 1, highest: 10, percent: 'Top 10' },
  { name: 'Portfolio Prodigy', lowest: 11, highest: 50, percent: 'Top 50' },
  { name: 'Wall Street Wolf', lowest: 51, highest: 100, percent: 'Top 100' },
  { name: 'Market Pool Shark', lowest: 101, highest: 500, percent: 'Top 500' },
  { name: 'Rising Trader', lowest: 501, highest: 1000000, percent: '' },
]

export { badgeLevels }
