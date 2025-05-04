import React from 'react'
import { View, TextInput, StyleSheet, ActivityIndicator } from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { Icon } from '@components'

const CustomSearchBar = ({
  searchString,
  setSearchString,
  loading,
  onPress,
  mainScreen,
  messages,
}) => {
  return (
    <View style={{ width: '100%' }}>
      <View
        style={
          mainScreen == true ? styles.textInputContainer2 : styles.textInputContainer
        }>
        <Icon
          type="FontAwesome"
          name={'search'}
          color={colors.offWhite}
          size={widthPercentageToDP(5)}
          style={{ marginHorizontal: widthPercentageToDP(5) }}
        />
        <TextInput
          placeholder={
            messages == false
              ? 'Search user or email to chat'
              : 'Search by username or email'
          }
          placeholderTextColor={colors.offWhite}
          value={searchString}
          style={styles.textInput}
          onChangeText={setSearchString}
        />
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Icon
            type="AntDesign"
            name={'caretright'}
            color={colors.offWhite}
            size={widthPercentageToDP(3.4)}
            onPress={onPress}
          />
        )}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  textInputContainer: {
    alignSelf: 'center',
    width: '90%',
    height: heightPercentageToDP(5.3),
    backgroundColor: '#3A3A3A',
    marginVertical: heightPercentageToDP(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
  },
  textInput: [
    textStyles.normalRegular,
    {
      width: '70%',
      height: '100%',
      color: colors.white,
      fontSize: actuatedNormalize(11),
    },
  ],
  textInputContainer2: {
    width: '100%',
    height: heightPercentageToDP(6),
    backgroundColor: '#3A3A3A',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
  },
})
export { CustomSearchBar }
