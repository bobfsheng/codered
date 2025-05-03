import React, { memo } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, Platform } from 'react-native'
import {
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  actuatedNormalize,
} from '@utils'
import { Icon } from '@components'
import RenderHtml from 'react-native-render-html'

const CustomExploreNewsFeed = memo(
  ({ newsHeadline, newsContent, newsImageURL, setFeedBoxModal }) => {
    return (
      <View
        style={[
          styles.feedModal,
          {
            marginTop: heightPercentageToDP(30),
          },
        ]}>
        <Icon
          type="Ionicons"
          name={'close'}
          size={widthPercentageToDP(5)}
          color="black"
          onPress={() => setFeedBoxModal(prev => !prev)}
          style={{
            marginTop: heightPercentageToDP(1),
            paddingRight: widthPercentageToDP(2),
            alignSelf: 'flex-end',
          }}
        />
        <ScrollView
          style={{
            marginBottom: heightPercentageToDP(Platform.isPad !== true ? 0 : 10),
          }}>
          <Text
            style={[
              styles.feedBoxText,
              {
                color: 'black',
                marginTop: heightPercentageToDP(0),
                width: widthPercentageToDP(80),
              },
            ]}>
            {newsHeadline}
          </Text>
          {newsImageURL && (
            <Image
              style={{
                resizeMode: 'contain',
                alignSelf: 'center',
                borderRadius: 10,
                height: heightPercentageToDP(30),
                width: widthPercentageToDP(80),
                marginRight: widthPercentageToDP(4),
              }}
              source={{ uri: newsImageURL }}
            />
          )}
          <Text
            style={[
              styles.feedBoxTextBody,
              { color: 'black', width: widthPercentageToDP(90) },
            ]}>
            <RenderHtml
              contentWidth={widthPercentageToDP(90)}
              source={{ html: newsContent }}
            />
          </Text>
        </ScrollView>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  feedModal: {
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(50),
    backgroundColor: 'white',
    alignSelf: 'center',
    marginHorizontal: widthPercentageToDP(1),
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    position: 'absolute',
    paddingHorizontal: widthPercentageToDP(4),
    paddingVertical: heightPercentageToDP(1),
  },
  feedBoxText: [
    textStyles.bigBold,
    {
      color: 'white',
      width: widthPercentageToDP(65),
      fontSize: actuatedNormalize(12),
      marginBottom: heightPercentageToDP(1),
      marginTop: heightPercentageToDP(1),
    },
  ],
  feedBoxTextBody: [
    textStyles.bigRegular,
    {
      color: 'white',
      width: widthPercentageToDP(72),
      fontSize: actuatedNormalize(12),
      marginBottom: heightPercentageToDP(2),
    },
  ],
})
export { CustomExploreNewsFeed }
