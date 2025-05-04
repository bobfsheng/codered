import React, { useState } from 'react'
import { StyleSheet, Pressable, View, Text, TextInput, Platform } from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { CustomInputLabel } from '@components'
import { userActions, useReduxDispatch } from '@store'

const ChallengeAmount = ({ setBetAmount, betAmount }) => {
  const dispatch = useReduxDispatch()
  const [selectedBox, setSelectedBox] = useState(4)
  const handleBoxPress = (button, bettingAmount) => {
    setSelectedBox(button)
    setBetAmount(bettingAmount)
  }

  return (
    <>
      <Pressable
        style={{ marginTop: heightPercentageToDP(2) }}
        onPress={() => dispatch(userActions.setInformation({ infoId: 7 }))}>
        <CustomInputLabel text="Challenge Amount" big info />
      </Pressable>
      <View style={{ flexDirection: 'row', marginTop: heightPercentageToDP(1.5) }}>
        <Pressable onPress={() => handleBoxPress(1, '3')}>
          <View style={selectedBox === 1 ? styles.selectedBox : styles.unSelectedBox}>
            <Text
              style={
                selectedBox === 1 ? styles.selectedBoxText : styles.unSelectedBoxText
              }>
              $ 3
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={() => handleBoxPress(2, '5')}>
          <View style={selectedBox === 2 ? styles.selectedBox : styles.unSelectedBox}>
            <Text
              style={
                selectedBox === 2 ? styles.selectedBoxText : styles.unSelectedBoxText
              }>
              $ 5
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={() => handleBoxPress(3, '10')}>
          <View style={selectedBox === 3 ? styles.selectedBox : styles.unSelectedBox}>
            <Text
              style={
                selectedBox === 3 ? styles.selectedBoxText : styles.unSelectedBoxText
              }>
              $ 10
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={() => handleBoxPress(4, '25')}>
          <View style={selectedBox === 4 ? styles.selectedBox : styles.unSelectedBox}>
            <Text
              style={
                selectedBox === 4 ? styles.selectedBoxText : styles.unSelectedBoxText
              }>
              $ 25
            </Text>
          </View>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', marginTop: heightPercentageToDP(1.5) }}>
        <Pressable onPress={() => handleBoxPress(5, '50')}>
          <View style={selectedBox === 5 ? styles.selectedBox : styles.unSelectedBox}>
            <Text
              style={
                selectedBox === 5 ? styles.selectedBoxText : styles.unSelectedBoxText
              }>
              $ 50
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={() => handleBoxPress(6, '100')}>
          <View style={selectedBox === 6 ? styles.selectedBox : styles.unSelectedBox}>
            <Text
              style={
                selectedBox === 6 ? styles.selectedBoxText : styles.unSelectedBoxText
              }>
              $ 100
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={() => handleBoxPress(7)}>
          <View
            style={[
              Platform.OS === 'android'
                ? selectedBox === 7
                  ? styles.unSelectedInputBoxAndroid
                  : styles.selectedInputBoxAndroid
                : selectedBox === 7
                ? styles.unSelectedInputBox
                : styles.selectedInputBox,
            ]}>
            <TextInput
              textAlign="center"
              style={[
                styles.textinputSylesAndroid,
                { color: selectedBox === 7 ? 'black' : 'white' },
              ]}
              value={selectedBox === 7 ? betAmount : '0'}
              maxLength={6}
              onChangeText={text => setBetAmount(text)}
              placeholder={'$1000'}
              placeholderTextColor={'gray'}
            />
          </View>
        </Pressable>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  selectedText: [
    textStyles.bigBold,
    {
      fontSize: actuatedNormalize(15),
      color: 'white',
    },
  ],
  unSelectedText: [
    textStyles.bigRegular,
    {
      fontSize: actuatedNormalize(15),
      color: 'gray',
    },
  ],
  selectedBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: heightPercentageToDP(1),
    width: widthPercentageToDP(20),
    borderRadius: heightPercentageToDP(0.5),
    borderWidth: heightPercentageToDP(0.2),
    borderColor: 'white',
    marginHorizontal: widthPercentageToDP(1),
  },
  unSelectedBox: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: heightPercentageToDP(1),
    backgroundColor: 'black',
    width: widthPercentageToDP(20),
    borderRadius: heightPercentageToDP(0.5),
    borderColor: colors.primary,
    borderWidth: heightPercentageToDP(0.2),
    marginHorizontal: widthPercentageToDP(1),
  },
  selectedInputBox: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: heightPercentageToDP(1),
    backgroundColor: 'black',
    width: widthPercentageToDP(42),
    borderRadius: heightPercentageToDP(0.5),
    borderColor: colors.primary,
    borderWidth: heightPercentageToDP(0.2),
    marginHorizontal: widthPercentageToDP(1),
  },
  unSelectedInputBox: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: heightPercentageToDP(1),
    backgroundColor: 'white',
    width: widthPercentageToDP(42),
    borderRadius: heightPercentageToDP(0.5),
    borderColor: 'white',
    borderWidth: heightPercentageToDP(0.2),
    marginHorizontal: widthPercentageToDP(1),
  },

  selectedInputBoxAndroid: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    // padding: heightPercentageToDP(1),
    backgroundColor: 'black',
    width: widthPercentageToDP(42),
    borderRadius: heightPercentageToDP(0.5),
    borderColor: colors.primary,
    alignContent: 'center',
    borderWidth: heightPercentageToDP(0.2),
    height: heightPercentageToDP(5.3),
    marginHorizontal: widthPercentageToDP(1),
  },
  unSelectedInputBoxAndroid: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    // padding: heightPercentageToDP(1),
    backgroundColor: 'white',
    height: heightPercentageToDP(5.3),
    width: widthPercentageToDP(42),
    borderRadius: heightPercentageToDP(0.5),
    borderColor: 'white',
    borderWidth: heightPercentageToDP(0.2),
    marginHorizontal: widthPercentageToDP(1),
  },

  selectedBoxText: [
    textStyles.bigBold,
    {
      fontSize: actuatedNormalize(15),
      color: 'black',
    },
  ],
  unSelectedBoxText: [
    textStyles.bigRegular,
    {
      fontSize: actuatedNormalize(15),
      color: 'white',
    },
  ],
  textinputSyles: {
    fontSize: actuatedNormalize(15),
    fontFamily: 'DMSans-Medium',
  },
  textinputSylesAndroid: {
    fontSize: actuatedNormalize(15),
    fontFamily: 'DMSans-Medium',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
  },
})
export { ChallengeAmount }
