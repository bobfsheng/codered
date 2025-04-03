import React, { memo, useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native'

import { hasDynamicIsland, hasNotch } from 'react-native-device-info'
import { useReduxDispatch, useUserSelector, userActions } from '@store'
import { BottomSheet, BottomSheetRefProps } from './BottomSheet'
import {
  actuatedNormalize,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  colors,
} from '@utils'

const BOTTOMSHEETHEIGHT = 85
const InfoBottomSheet = memo(() => {
  const dispatch = useReduxDispatch()
  const { information } = useUserSelector(state => state)
  const ref = useRef(null)
  useEffect(() => {
    if (!information.info) {
      ref?.current?.scrollTo(0)
    } else {
      ref?.current?.scrollTo(
        hasDynamicIsland()
          ? -heightPercentageToDP(String(BOTTOMSHEETHEIGHT + 2))
          : hasNotch()
          ? -heightPercentageToDP(String(BOTTOMSHEETHEIGHT))
          : -heightPercentageToDP(String(BOTTOMSHEETHEIGHT)),
      )
    }
  }, [information.info])
  const removeInfoFromReducer = () => {
    dispatch(userActions.removeInformation())
  }
  return (
    <BottomSheet
      ref={ref}
      height={
        hasDynamicIsland()
          ? BOTTOMSHEETHEIGHT + 2
          : hasNotch()
          ? BOTTOMSHEETHEIGHT
          : BOTTOMSHEETHEIGHT + 1.5
      }
      onClose={removeInfoFromReducer}
      closeBottomSheet={removeInfoFromReducer}>
      <View style={styles.topSection}>
        <View>
          <Text
            style={[
              textStyles.bigRegular,
              {
                fontSize: actuatedNormalize(14),
                color: 'white',
                marginBottom: heightPercentageToDP('5'),
              },
            ]}>
            {information?.info}
          </Text>
        </View>
        <View>
          {information?.pic && (
            <Image source={information?.pic} style={styles.imageBelow} />
          )}
        </View>
      </View>
    </BottomSheet>
  )
})

const styles = StyleSheet.create({
  topSection: {
    height: heightPercentageToDP('55'),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.darkBackground,
    minHeight: Math.round(Dimensions.get('window').height / 2),
    paddingHorizontal: widthPercentageToDP(5),
    marginTop: heightPercentageToDP(2),
  },
  imageBelow: {
    resizeMode: 'contain',
    marginTop: heightPercentageToDP('10'),
    width: widthPercentageToDP('80'),
    height: heightPercentageToDP('60'),
    alignSelf: 'center',
  },
})

export { InfoBottomSheet }
