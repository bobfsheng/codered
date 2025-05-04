import { useState } from 'react'
import { Share } from 'react-native'
import dynamicLinks from '@react-native-firebase/dynamic-links'

const useFriendOption = () => {
  const [showFriendOptionId, setShowFriendOptionId] = useState('')
  const handleShareUserProfile = async shareUserId => {
    try {
      const linkUrl = `https://redvest.app?userId=${shareUserId}&apn=app.redvest&isi=1609301338&ibi=com.redko.redvest`

      const link = await dynamicLinks().buildShortLink(
        {
          link: linkUrl,
          domainUriPrefix: 'https://redvest.page.link',
          android: {
            packageName: 'com.redko.redvest',
          },
        },
        dynamicLinks.ShortLinkType.SHORT,
      )
      const result = await Share.share({
        message: `${link}`,
        // message: `Amazing trader on Redvest! Please checkout their profile\n${link}`,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log('error =>', error)
    }
  }
  return {
    showFriendOptionId,
    setShowFriendOptionId,
    handleShareUserProfile,
  }
}

export { useFriendOption }
