import React, { memo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native'
import {
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  actuatedNormalize,
} from '@utils'
import { Icon } from '@components'

const CustomNewsFeeds = memo(({ newsHeadline, newsContent }) => {
  const [feedBoxModal, setFeedBoxModal] = useState(false)

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
        onPress={() => setFeedBoxModal(false)}
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
        <Text
          style={[
            styles.feedBoxTextBody,
            { color: 'black', width: widthPercentageToDP(90) },
          ]}>
          {newsContent}
        </Text>
      </ScrollView>
    </View>
  )
})
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
export { CustomNewsFeeds }
