import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'

function useRefreshHookExplore() {
  const [refreshing, setRefreshing] = useState(false)
  const [positionsExplore, setPositionsExplore] = useState(null)
  const dispatch = useDispatch()

  const handleRefreshExplore = React.useCallback(async () => {
    setRefreshing(true)
    const alpacaMarketApi = axios.create({
      baseURL: 'https://paper-api.alpaca.markets/',
      headers: {
        // Authorization: `Bearer d674ec3c-077b-41c3-b712-3b17d997079d`,
        // config.headers = {
        'APCA-API-KEY-ID': 'PKI4FE040C9SF0UEI6QS',
        'APCA-API-SECRET-KEY': '5aEKhKeebyYk3hV0R14B0xZiBHAanDRAZg27m2QT',
      },
    })
    try {
      const response = await alpacaMarketApi.get('v2/positions')
      if (response.status === 200) {
        setPositionsExplore(response.data)
      }
    } catch (error) {
      // console.log('getPositions explore =>', error.response)
      null
    }
    setRefreshing(false)
  }, [])
  return { refreshing, handleRefreshExplore, positionsExplore }
}

export { useRefreshHookExplore }
