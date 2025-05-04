import { colors } from '@utils'
import React from 'react'
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native'

const CustomLoader = ({ loading }) => {
  return (
    <>
      {loading && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            width: Dimensions.get('window').width,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}>
          <ActivityIndicator size="large" color={colors.primary2} />
        </View>
      )}
    </>
  )
}
export { CustomLoader }
