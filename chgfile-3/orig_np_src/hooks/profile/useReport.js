import { useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { useAuthSelector } from '@store'
import { NavigationService } from '@navigation'

const useReport = () => {
  const { userId } = useAuthSelector(state => state)
  const [isLoading, setIsLoading] = useState(false)

  const handleReport = async (reportedUserId, reportCause, description) => {
    try {
      setIsLoading(true)
      await firestore().collection('Reports').add({
        uid: userId,
        reportedUserId,
        reportCause,
        description,
        reportedData: new Date(),
      })
      setIsLoading(false)
      NavigationService.goBack()
    } catch (error) {
      setIsLoading(false)
      console.log('handleReport error =>', error)
    }
  }

  return {
    isLoading,
    handleReport,
  }
}

export { useReport }
