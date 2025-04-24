const gameCategories = [
  {
    category: 'Quizzes',
    emoji: '🧠',
    gradientColors: ['#AECF2A', '#388E3C'],
    screen: 'QuizCategory',
    button: 'Quiz',
    info: '',
    component: '',
  },
  {
    category: 'Buy or Sell',
    emoji: '📈',
    gradientColors: ['#8E44AD', '#FAA2A1'],
    screen: 'BuyorSell',
    button: 'Play',
    info: 'Level',
    component: 'Highest Score',
  }, // Pink Shades
  {
    category: 'Stock Swipe',
    emoji: '👍',
    gradientColors: ['orange', 'red'],
    screen: 'SwipeScreen',
  },
  {
    category: 'Bull or Bear',
    emoji: '📰',
    gradientColors: ['#E07E7D', '#1976D2'],
    screen: 'BullorBear',
  },

  {
    category: 'What If?',
    // emoji: '⏳',
    emoji: '🔒',
    gradientColors: ['#03A9F4', '#81C784'],
    screen: 'SwipeScreen',
  }, // Orange to Amber
  {
    category: `Let's Guess`,
    // emoji: '💵',
    emoji: '🔒',
    gradientColors: ['#945DB5', '#6D00F9'],
    screen: 'SwipeScreen',
  }, // Purple Shades
]

export { gameCategories }
