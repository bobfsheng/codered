const moneyArray = [
  // 'Ad Free Monthly',
  // 'Ad Free Weekly',
  //  'Ad Free Yearly',
  '10,000',
  '30,000',
  '50,000',
  '100,000',
  '250,000',
  '500,000',
  '1,000,000',
]

const k20 = require('@assets/images/Purchases/1.png')
const k30 = require('@assets/images/Purchases/2.png')
const k50 = require('@assets/images/Purchases/3.png')
const k100 = require('@assets/images/Purchases/4.png')
const k250 = require('@assets/images/Purchases/5.png')
const k500 = require('@assets/images/Purchases/6.png')
const m1 = require('@assets/images/Purchases/7.png')

const plans = [
  { money: '10,000', image: k20, price: '0.99', level: 'Level1' },
  { money: '30,000', image: k30, price: '1.99', level: 'Level2' },
  { money: '50,000', image: k50, price: '2.99', level: 'Level3' },
  { money: '100,000', image: k100, price: '4.99', level: 'Level4' },
  { money: '250,000', image: k250, price: '9.99', level: 'Level5' },
  { money: '500,000', image: k500, price: '13.99', level: 'Level6' },
  { money: '1,000,000', image: m1, price: '19.99', level: 'Level7' },
  // { money: 'Ad Free Weekly', image: k500, price: '13.99', level: 'Level8' },
  // { money:  'Ad Free Monthly', image: m1, price: '19.99', level: 'Level9' },
  //  { money:  'Ad Free Yearly', image: m1, price: '19.99', level: 'Level10' },
]
const imagesArray = [k20, k30, k50, k100, k250, k500, m1]

const productSkus = Platform.select({
  ios: { skus: ['Level1', 'Level2', 'Level3', 'Level4', 'Level5', 'Level6', 'Level7'] },
  android: {
    skus: ['level1', 'level2', 'level3', 'level4', 'level5', 'level6', 'level7'],
  },
})

export { moneyArray, plans, imagesArray, productSkus }
