import React from 'react'
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native'
import { actuatedNormalize, colors, textStyles, widthPercentageToDP } from '@utils'
import { NavigationService } from '@navigation'
import { Icon } from '@components'
import { TouchableOpacity } from 'react-native-gesture-handler'

function BackChevron({ text = '', onPress }) {
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        onPress ? onPress() : NavigationService.goBack()
      }}>
      <View style={styles.container}>
        <Icon
          type="Ionicons"
          name="ios-chevron-back"
          size={actuatedNormalize(Platform.isPad !== true ? 19 : 15)}
          color={colors.offWhite}
          onPress={() => {
            onPress ? onPress() : NavigationService.goBack()
          }}
        />
        <Text style={textStyles.normalMedium}>{text}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: widthPercentageToDP(3),

  },
  icon: {
    resizeMode: 'contain',
    width: widthPercentageToDP(5),
    marginRight: widthPercentageToDP(4),
  },
})

export { BackChevron }
