import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { widthPercentageToDP, heightPercentageToDP, colors } from '@utils'

const LoadingModal = ({}) => {
  return (
    <View
      style={{
        position: 'absolute',
        width: widthPercentageToDP('100'),
        height: heightPercentageToDP('100'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
      }}>
      <ActivityIndicator
        size="small"
        color={colors.primary}
        style={{ marginBottom: heightPercentageToDP(25) }}
      />
    </View>
  )
}

export { LoadingModal }