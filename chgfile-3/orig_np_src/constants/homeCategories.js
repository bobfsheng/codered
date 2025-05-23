const homeCategories = [
  {
    category: 'Games',
    emoji: '🎮',
    gradientColors: ['#B9CC00', '#FAA2A1'],
    screen: ['Games', { screen: 'BuyorSell' }],
    button: 'Play',
    info: 'Top P&L',
    component: 'Highest Score',
    title: 'Beat your highest score!',
  },
  {
    category: 'Quizzes',
    emoji: '🧠',
    gradientColors: ['#AECF2A', '#388E3C'],
    screen: [
      'Games',
      {
        screen: 'QuizCategory',
        params: {
          allCategories: true,
          categoryParam: 'All Categories',
        },
      },
    ],
    button: 'Quiz',
    info: 'Level',
    component: '',
    title: 'Learn & Earn!',
  },
  {
    category: 'Friends',
    emoji: '👯‍♀️',
    gradientColors: ['#4A7E45', '#9ECB8E'],
    screen: ['Games', { screen: 'BuyorSell' }],
    button: 'Invite',
    info: '',
    component: '',
    title: 'Invite Friends Win $1000 Redvest coins',
  },
  {
    category: 'Leaderboard',
    emoji: '🏆',
    gradientColors: ['#4287f5', '#7d53de'],
    screen: 'Leaderboard',
    button: 'Invest',
    info: '',
    component: 'Weekly Rank',
    title: 'Leaderboard Rank',
  },
  {
    category: 'Invest',
    emoji: '💵',
    gradientColors: ['#E07E7D', '#1976D2'],
    screen: ['Invest', { screen: 'InvestTab' }],
    button: 'Invest',
    info: 'Profit',
    component: 'Profit & Loss',
    title: 'Your portfolio is ',
  },
  {
    category: 'Explore',
    emoji: '📈',
    gradientColors: ['#FC6F43', '#6AC259'],
    screen: ['Explore', { screen: 'ExploreSelectTicker' }],
    button: 'Explore',
    info: '',
    component: '',
    title: 'Market is ',
  },
  {
    category: 'Crypto',
    emoji: '💎',
    gradientColors: ['#066B9F', '#9DD39F'],
    screen: ['Invest', { screen: 'EasyCryptoInvestScreen' }],
    button: 'Invest',
    info: '',
    component: '',
    title: 'Crypto is ',
  },
]

export { homeCategories }
