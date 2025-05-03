import { useEffect, useState } from 'react'
// import { loadModel, calculateSimilarities } from './tfUtils';
import { loadModel, calculateSimilarities } from '@utils'

const useRankedStocks = (stockInfo, positions) => {
  const [rankedStocks, setRankedStocks] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRankedStocks = async () => {
      try {
        await loadModel()
        const sortedStocks = await calculateSimilarities(stockInfo, positions)
        setRankedStocks(sortedStocks)
      } catch (err) {
        setError(err)
      }
    }

    fetchRankedStocks()
  }, [stockInfo, positions])

  return { rankedStocks, error }
}

export { useRankedStocks }
