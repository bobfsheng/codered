import React from 'react'
import { View, Text } from 'react-native'

const Share = () => {
  const onLinkPress = async () => {
    try {
      const linkUrl = `https://redvest.app?redvestId=${stockTicker}&apn=app.redvest&isi=1551871735&ibi=com.redko.redvest`
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
      // console.log({ link })
      onShare(link)
      // Clipboard.setString(link)
    } catch (err) {
      console.log('error > ', err)
    }
  }
  const onShare = async redvestLink => {
    try {
      const result = await Share.share({
        message: `, ${redvestLink} `,
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
      console.log('share error', error.message)
    }
  }

  return (
    <View>
      <View>
        <Text>ExploreStocks - will give you the design</Text>
      </View>
    </View>
  )
}

export { Share }
