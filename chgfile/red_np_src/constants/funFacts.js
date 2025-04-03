const funFacts = [
  {
    fact: '80% of people lose money in the stock market but 83% of Redvest users make a virtual profit!',
    emoji: '🚀',
  },
  {
    fact: 'Redvesters make an average virtual profit of $4000!',
    emoji: '🚀',
  },
  {
    fact: '80% of people lose money in the stock market but 83% of Redvest users make a virtual profit!',
    emoji: '🚀',
  },
  {
    fact: '80% of people lose money in the stock market but 83% of Redvest users make a virtual profit!',
    emoji: '🚀',
  },
  {
    fact: 'Did you know that the stock market has historically outperformed most other investment options, making it an exciting opportunity for growth?',
    emoji: '🚀',
  },
  {
    fact: 'The most expensive share in the world is from Berkshire Hathaway, currently priced at an astonishingly high value, showing the potential for wealth creation.',
    emoji: '🌟',
  },
  {
    fact: "Warren Buffett, one of the world's most successful investors, built his fortune primarily through stock market investments. You can take inspiration from his success story.",
    emoji: '💡',
  },
  {
    fact: "If you had invested just $1,000 in Amazon's IPO in 1997, it would be worth over $1 million today. Patience can pay off big time!",
    emoji: '💰',
  },
  {
    fact: 'The stock market is a global marketplace, offering you the chance to invest in companies from around the world and diversify your portfolio.',
    emoji: '🌐',
  },
  {
    fact: 'Investing in stocks can lead to financial independence and allow you to achieve your long-term financial goals.',
    emoji: '🏦',
  },
  {
    fact: "Historically, the stock market has shown an upward trend over time, even with occasional downturns. It's a ride worth taking!",
    emoji: '📊',
  },
  {
    fact: 'Stock market investments can help you build wealth, making your dreams and aspirations more achievable.',
    emoji: '🌈',
  },
  {
    fact: 'Setting clear investment goals can give you a sense of purpose and direction, motivating you to invest wisely.',
    emoji: '🎯',
  },
  {
    fact: 'Learning about stocks and investing can be a fun and intellectually stimulating hobby.',
    emoji: '💡',
  },
  {
    fact: 'Diversifying your portfolio by investing in different industries and sectors can reduce risk and increase potential rewards.',
    emoji: '💪',
  },
  {
    fact: 'Dividend-paying stocks can provide a steady stream of income, helping you achieve financial stability.',
    emoji: '💸',
  },
  {
    fact: 'Dollar-cost averaging, investing a fixed amount regularly, can help you benefit from market fluctuations over time.',
    emoji: '📈',
  },
  {
    fact: 'Stock market downturns can be opportunities to buy high-quality stocks at discounted prices.',
    emoji: '📉',
  },
  {
    fact: 'Investing in multinational corporations can make you a part-owner of companies with a global impact.',
    emoji: '🌐',
  },
  {
    fact: 'Owning stock in renowned companies can make you feel like a part of their success story.',
    emoji: '🏆',
  },
  {
    fact: 'Stock markets have a long history of rebounding from challenging times, showing resilience in the face of adversity.',
    emoji: '🌄',
  },
  {
    fact: "You don't need a large sum of money to start investing; many brokerages allow you to begin with as little as $100.",
    emoji: '💼',
  },
  {
    fact: 'Financial education gained through investing can positively impact your overall financial decision-making.',
    emoji: '💡',
  },
  {
    fact: 'Legendary investors like Peter Lynch and Benjamin Graham achieved extraordinary success by sticking to their investment philosophies.',
    emoji: '🏆',
  },
  {
    fact: 'Successful investors often attribute their achievements to disciplined, long-term investing.',
    emoji: '🌟',
  },
  {
    fact: 'Investing can be a way to support companies that align with your values and beliefs.',
    emoji: '🌱',
  },
  {
    fact: 'Stock market investments can provide a source of capital for starting your own business or pursuing other ventures.',
    emoji: '💼',
  },
  {
    fact: 'Investing in stocks can help you stay ahead of inflation, preserving the purchasing power of your money.',
    emoji: '💸',
  },
  {
    fact: 'Historical data shows that bear markets are usually followed by bull markets, emphasizing the cyclical nature of the stock market.',
    emoji: '📈',
  },
  {
    fact: 'Learning about financial markets can expand your knowledge and make you more financially literate.',
    emoji: '🤓',
  },
  {
    fact: 'Many famous investors, like George Soros and Ray Dalio, started with modest amounts and grew their wealth over time.',
    emoji: '💰',
  },
  {
    fact: 'Investing in environmentally conscious companies can contribute to a greener and more sustainable future.',
    emoji: '🌱',
  },
  {
    fact: 'The stock market rewards innovation, making it an exciting place to invest in cutting-edge technologies.',
    emoji: '🚀',
  },
  {
    fact: "Some of the world's most successful entrepreneurs, like Elon Musk and Jeff Bezos, are closely associated with publicly traded companies.",
    emoji: '🏢',
  },
  {
    fact: 'Investing in real estate investment trusts (REITs) can provide exposure to the real estate market without directly buying property.',
    emoji: '🏢',
  },
  {
    fact: 'Universities and educational institutions often invest their endowments in the stock market to fund scholarships and research.',
    emoji: '🎓',
  },
  {
    fact: 'Investing in global companies can provide insights into different cultures and economies.',
    emoji: '🌎',
  },
  {
    fact: "Stock ownership can give you a say in a company's decisions through voting rights.",
    emoji: '💼',
  },
  {
    fact: 'A well-planned and diversified stock portfolio can be a valuable legacy to pass on to future generations.',
    emoji: '🌟',
  },
  {
    fact: 'Investing can be a path to financial security, helping you build a safety net for unexpected expenses.',
    emoji: '🏦',
  },
  {
    fact: 'Stock market downturns can be a great time to reevaluate your portfolio and make strategic adjustments.',
    emoji: '📉',
  },
  {
    fact: 'Understanding market psychology can help you make rational investment decisions in volatile times.',
    emoji: '💡',
  },
  {
    fact: 'There are many investment strategies to choose from, so you can find one that suits your risk tolerance and goals.',
    emoji: '🌟',
  },
  {
    fact: 'Investing in renewable energy companies can support the transition to a more sustainable world.',
    emoji: '🌱',
  },
  {
    fact: 'The stock market is filled with individuals who know the price of everything but the value of nothing. Investing teaches you to see beyond the price.',
    emoji: '🏆',
  },
  {
    fact: 'Compound interest can turbocharge your investments over time, potentially turning small investments into substantial wealth.',
    emoji: '💰',
  },
  {
    fact: 'Stock market downturns can be a great time to reevaluate your portfolio and make strategic adjustments.',
    emoji: '📉',
  },
  {
    fact: 'History is filled with stories of individuals who turned modest investments into substantial fortunes by embracing the opportunities presented by the stock market. Why not be the next success story?',
    emoji: '🌟',
  },
]

export { funFacts }
