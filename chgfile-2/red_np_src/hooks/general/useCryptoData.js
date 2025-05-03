import { useState, useEffect } from 'react'
import { alpacaMarketApi } from '@services'
import { getCrypto, getLastQuoteCrypto } from '@services'

const useCryptoData = () => {
  const [cryptoStatus, setCryptoStatus] = useState(null)
  const [lastQuoteCrypto, setLastQuoteCrypto] = useState(null)

  useEffect(() => {
    const fetchCryptoData = async () => {
      let lastClosePrice // Declare here so it's accessible throughout the function

      try {
        const response = await getCrypto('BTC/USD')
        const btcUsdData = response['BTC/USD']
          // console.log(btcUsdData[0], 'ddd') 

        if (btcUsdData && btcUsdData.length > 0) {
          lastClosePrice = btcUsdData[0].c
       // Should log the value of "c" from the first object
        }
      } catch (error) {
        console.log('Error fetching Crypto data:', error)
      }

      try {
        const quoteResponse = await getLastQuoteCrypto('BTC/USD')
        if (quoteResponse) {
          // console.log(quoteResponse, lastClosePrice,'ssss')
          const currentQuote = quoteResponse?.trade?.p
          if (lastClosePrice && currentQuote > lastClosePrice) {
            setCryptoStatus('up')
          } else if (lastClosePrice && currentQuote < lastClosePrice) {
            setCryptoStatus('down')
          } else {
            setCryptoStatus('flat')
          }
          setLastQuoteCrypto(currentQuote)
        } else {
          setLastQuoteCrypto(0)
        }
      } catch (error) {
        console.log('Error getting last quote =>', error)
      }
    }

    fetchCryptoData()
  }, [])

  return {
    cryptoStatus,
    lastQuoteCrypto,
  }
}

export { useCryptoData }
