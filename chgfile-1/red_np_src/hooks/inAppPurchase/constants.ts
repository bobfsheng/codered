import { Platform } from 'react-native'
const m1 = require('@assets/images/Purchases/7.png')
const k250 = require('@assets/images/Purchases/5.png')
const k20 = require('@assets/images/Purchases/1.png')
const k30 = require('@assets/images/Purchases/2.png')
const k50 = require('@assets/images/Purchases/3.png')
const subscriptionSkus = Platform.select({
  ios: { skus: ['Weekly', 'Monthly', 'Yearly'] },
  android: {
    skus: ['week', 'month', 'year'],
  },
})
const imagesArray = [k30, k250, m1, k50, k20]
const subscriptionPlans = [
  { price: '1.99', level: 'Weekly', image: k250 },
  { price: '3.99', level: 'Monthly', image: k30 },
  { price: '9.99', level: 'Yearly', image: m1 },
  // { price: '3.99', level: 'NoAds', image: k50 },
  // { price: '12.99', level: 'NoAdsYearly', image: k20 },
]
// const validationServer = 'http://192.168.1.121:3000'
// const validationServer = 'http://192.168.100.46:3000'
// const validationServer = 'https://master.d14pmzfjbgiz16.amplifyapp.com/'
const validationServer = 'https://redvest-server.herokuapp.com'
export { subscriptionPlans, subscriptionSkus, imagesArray, validationServer }
