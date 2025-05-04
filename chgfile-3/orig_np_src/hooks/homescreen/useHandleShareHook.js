import { Share } from 'react-native'
import React from 'react'

function useHandleShareHome() {
  const handleShareHome = async () => {
    try {
      const result = await Share.share({
        message: `Check out Redvest Stock Market Game!
          https://apps.apple.com/us/app/redvest/id1551871735`,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message)
    }
  }

  return { handleShareHome }
}

export { useHandleShareHome }
