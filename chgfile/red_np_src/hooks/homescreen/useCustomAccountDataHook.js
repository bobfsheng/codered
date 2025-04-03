import { useEffect, useState } from 'react'
import { useUserSelector } from '@store'

export const useCustomAccountData = () => {
  const { accountHistory, portfolio_value, portfolio_equity } = useUserSelector(
    state => state,
  )
  const [yesterday, setYesterday] = useState(undefined) // Initialize to undefined
  const [today, setToday] = useState(undefined) // Initialize to undefined

  useEffect(() => {
    if (accountHistory && accountHistory.length > 0) {
      // Check if accountHistory has data
      setYesterday(accountHistory[accountHistory.length - 2]) // Set yesterday
      setToday(accountHistory[accountHistory.length - 1]) // Set today
    }
  }, [accountHistory])

  return { accountHistory, portfolio_value, yesterday, today }
}
