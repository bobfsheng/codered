import { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'

import { useAuthSelector, useUserSelector } from '@store'
import { NavigationService } from '@navigation'
import { getLastQuoteCrypto, postOrder } from '@services'
import { pushOrderToFirestore } from '@utils'

function useHandleInvestHookCrypto() {
  const [orderQuantity, setOrderQuantity] = useState(0)
  const [selectedOrderType, setSelectedOrderType] = useState('market')
  const [selectedOrderClass, setSelectedOrderClass] = useState('/USD')
  const [orderClass, setOrderClass] = useState([
    { label: 'US Dollar', value: '/USD' },
    { label: 'USD Tether', value: '/USDT' },
    { label: 'Bitcoin', value: '/BTC' },
  ])

  const [stopLoss, setStopLoss] = useState('')
  const [limitPrice, setLimitPrice] = useState('')
  const [showInvestconfirmation, setShowInvestconfirmation] = useState(false)
  const [selectedCryptoType, setSelectedCryptoType] = useState('')
  const [selectedCryptoTypeS, setSelectedCryptoTypeS] = useState('')
  const [orderSide, setOrderSide] = useState('buy')
  const [errorMessage, setErrorMessage] = useState('')
  const [orderQty, setOrderQty] = useState(false)
  const [lastQuote, setLastQuote] = useState(0)
  const { portfolio_value } = useUserSelector(state => state)
  const { isLoggedIn, userId, alpacaToken } = useAuthSelector(state => state)

  const [cryptoTypeS, setCryptoTypeS] = useState([
    { label: 'Bitcoin', value: 'BTC' },
    { label: 'USD Tether', value: 'USDT' },
    { label: 'Dodge Coin', value: 'DOGE' },
    { label: 'Ethereum', value: 'ETH' },
    { label: 'Litecoin', value: 'LTC' },
    { label: 'Matic', value: 'MATIC' },
    { label: 'Sushi', value: 'SUSHI' },
    { label: 'Solana', value: 'SOL' },
    { label: 'Tron', value: 'TRX' },
    { label: 'Uniswap', value: 'UNI' },
    { label: 'Wrapped Coin', value: 'WBTC' },
    { label: 'Yearn', value: 'YFI' },
    { label: 'Dai', value: 'DAI' },
    { label: 'Chainlink', value: 'LINK' },
    { label: 'Aave', value: 'AAVE' },
    { label: 'Avalache', value: 'AVAX' },
    { label: 'Basic Attention Token', value: 'BAT' },
    { label: 'Bitcoin Cash', value: 'BCH' },
    { label: 'Graph', value: 'GRT' },
    { label: 'Paxos', value: 'PAXG' },
  ])

  useEffect(() => {
    ;(async () => {
      if (selectedCryptoTypeS) {
        try {
          // console.log('helre')
          const response = await getLastQuoteCrypto(
            selectedCryptoTypeS?.toString() + selectedOrderClass?.toString(),
          )
          // console.log('heressqq')
          if (response) {
            setLastQuote(
              response?.quotes?.[
                (
                  selectedCryptoTypeS?.toString() + selectedOrderClass?.toString()
                ).toString()
              ].ap,
            )
            // console.log('hereqaaq')
          } else {
            setLastQuote(0)
            // console.log('hello')
          }
        } catch (error) {
          console.log('error =>', error)
          // console.log('helloshshshshn')
        }
      } else {
        setLastQuote(0)
      }
    })()
  }, [selectedCryptoTypeS])

  const handleInvest = async () => {
    // if (subscriptionLoaded === true && subscriptionName === '') {
    //   setSubscriptionModal(true)
    //   return
    // }
    if (orderQuantity <= 0 || isNaN(orderQuantity)) {
      setErrorMessage('Order amount must be greater than 0')
      return
    }
    if (selectedOrderClass === 'crypto') {
      if (!selectedCryptoType) {
        setErrorMessage('Please select crypto currency')
        return
      }
    }
    if (orderQuantity < 1) {
      setErrorMessage('All orders need to be higher than $1.')
      return
    }
    if (selectedOrderType === 'limit') {
      if (limitPrice <= 0 || isNaN(limitPrice)) {
        setErrorMessage('Limit price must be greater than 1')
        return
      }
    }
    if (selectedOrderType === 'trailing_stop' || isNaN(orderQuantity)) {
      if (stopLoss <= 0 || isNaN(stopLoss)) {
        setErrorMessage('stop loss quantity must be greater than 1')
        return
      }
    }
    setShowInvestconfirmation(prev => !prev)
  }

  const onOrderSubmit = async () => {
    let requestBody = {
      symbol: selectedCryptoTypeS?.toString() + selectedOrderClass?.toString(),
      notional: orderQuantity,
      side: orderSide,
      type: selectedOrderType,
      time_in_force: 'gtc',
    }

    let requestBodyQty = {
      symbol: selectedCryptoTypeS?.toString() + selectedOrderClass?.toString(),
      qty: orderQuantity,
      side: orderSide,
      type: selectedOrderType,
      time_in_force: getDecimal(orderQuantity) > 0 ? 'day' : 'gtc',
    }

    let requestBodyType = orderQty == false ? requestBody : requestBodyQty

    if (portfolio_value < lastQuote * orderQuantity) {
      setErrorMessage('Your account balance is not sufficient yet.')
      return
    }
    try {
      const postResponse = await postOrder(JSON.stringify(requestBodyType))
      if (postResponse.status === 200) {
        if (postResponse.data.status === 'accepted' && alpacaToken) {
           const orderData = postResponse.data
           // Push game data to Firestore
           pushOrderToFirestore(userId, orderData).catch(error => {
             console.error('Failed to push game data:', error.message)
           })
          await firestore().collection('PendingOrders').doc(postResponse.data.id).set({
            uid: userId,
            token: alpacaToken,
            orderId: postResponse.data.id,
            status: postResponse.data.status,
          })
        }
        NavigationService.navigate('OrderConfirmation', {
          order: requestBodyType,
          lastQuote,
          orderCrypto: 'crypto',
          orderClass: 'crypto',
        })
      }
    } catch (error) {
      // setErrorMessage(response.data.message)
      console.log('error', error)
      setErrorMessage(error)
    }
  }

  return {
    handleInvest,
    cryptoTypeS,
    onOrderSubmit,
    errorMessage,
    lastQuote,
    orderQty,
    orderQuantity,
    orderSide,
    setOrderQty,
    setOrderSide,
    orderClass,
    orderClass,
    showInvestconfirmation,
    setOrderQuantity,
    setShowInvestconfirmation,
    selectedCryptoTypeS,
    setSelectedCryptoTypeS,
    selectedCryptoTypeS,
    setLastQuote,
    setErrorMessage,
  }
}

export { useHandleInvestHookCrypto }
