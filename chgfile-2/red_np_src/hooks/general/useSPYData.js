import { useState, useEffect } from 'react'
import { alpacaMarketApi } from '@services'
import { getSPYBars, getLastQuote } from '@services'

const useSPYData = () => {
  const [spyStatus, setSpyStatus] = useState(null)
  const [lastQuote, setLastQuote] = useState(null)

  useEffect(() => {
    const fetchSPYData = async () => {
      try {
        const response = await getSPYBars('SPY') // Using the helper function
        let lastClosePrice

        if (response?.bars?.length > 0) {
          lastClosePrice = response.bars[0].c
        }

        try {
          const quoteResponse = await getLastQuote('SPY')
          if (quoteResponse) {
            const currentQuote = quoteResponse?.trade?.p
            if (lastClosePrice && currentQuote > lastClosePrice) {
              setSpyStatus('up')
            } else if (lastClosePrice && currentQuote < lastClosePrice) {
              setSpyStatus('down')
            } else {
              setSpyStatus('flat')
            }
            setLastQuote(currentQuote)
          } else {
            setLastQuote(0)
          }
        } catch (error) {
          console.log('Error getting last quote =>', error)
        }
      } catch (error) {
        console.log('Error fetching SPY data:', error)
      }
    }

    fetchSPYData()
  }, [])

  return {
    spyStatus,
    lastQuote,
  }
}

export { useSPYData }
