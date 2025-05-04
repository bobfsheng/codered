import { Share } from 'react-native'
import dynamicLinks from '@react-native-firebase/dynamic-links'

function useInviteFriend(userId) {
  const onShare = async () => {
    try {
      const linkUrl = `https://redvest.app?stockticker=null&referrerId=${userId}&apn=app.redvest&isi=1609301338&ibi=com.redko.redvest`

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
      console.log('error =>', error)
    }
  }

  return { onShare }
}

export { useInviteFriend }
