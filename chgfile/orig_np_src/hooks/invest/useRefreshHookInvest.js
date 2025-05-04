import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { getAccountPositions } from '@store'

function useRefreshHookInvest() {
  const [refreshing, setRefreshing] = useState(false)
  const dispatch = useDispatch()

  const handleRefreshInvest = React.useCallback(() => {
    setRefreshing(true)
    dispatch(getAccountPositions())
    setTimeout(() => {
      setRefreshing(false)
    }, 500)
  }, [])

  return { refreshing, handleRefreshInvest }
}

export { useRefreshHookInvest }
