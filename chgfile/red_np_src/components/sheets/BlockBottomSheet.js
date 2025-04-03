import React, { memo, useEffect, useRef, useState } from 'react'
import { hasDynamicIsland, hasNotch } from 'react-native-device-info'
import { useReduxDispatch, useAuthSelector, useUserSelector, userActions } from '@store'
import { BottomSheet, BottomSheetRefProps } from './BottomSheet'
import { NavigationService } from '@navigation'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native'
import {
  colors,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
  actuatedNormalize,
} from '@utils'
import { CustomButton, CustomButtonUnselected, Icon } from '@components'
import { useBlock } from '@hooks'

const BOTTOMSHEETHEIGHT = 85
const BlockBottomSheet = memo(() => {
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
  const [selectedOption, setSelectedOption] = useState('')
  const tags = ['Block', 'Report & Block']
  const { reportedUserId } = route.params
  const { isLoading, handleBlockOnly } = useBlock()

  const tagLoop = tags.map((key, index) => {
    return (
      <View style={{ alignItems: 'center' }} key={index}>
        {selectedOption === key ? (
          <CustomButton text={key} onPress={() => setSelectedOption(key)} />
        ) : (
          <CustomButtonUnselected
            purple
            text={key}
            onPress={() => setSelectedOption(key)}
          />
        )}
      </View>
    )
  })
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        backgroundColor={colors.darkBackground}
        contentContainerStyle={{
          paddingBottom: heightPercentageToDP(10),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: heightPercentageToDP(10),
          }}>
          <View style={{ flexDirection: 'row' }}>
            <Icon
              type="Ionicons"
              name="ios-chevron-back"
              size={actuatedNormalize(19)}
              color={colors.offWhite}
              style={{
                marginLeft: widthPercentageToDP(5),
                marginTop: heightPercentageToDP(1),
                marginBottom: heightPercentageToDP(5),
              }}
              onPress={() => {
                NavigationService.goBack()
              }}
            />
          </View>
          <Text
            style={[
              textStyles.bigSemiBold,
              {
                color: 'white',
                marginBottom: heightPercentageToDP(2),
                marginRight: widthPercentageToDP(5),
              },
            ]}>
            Report & Block
          </Text>
        </View>

        <Text
          style={[
            textStyles.normalRegular,
            {
              color: 'white',
              marginBottom: heightPercentageToDP(5),
              marginLeft: widthPercentageToDP(5),
              marginRight: widthPercentageToDP(5),
            },
          ]}>
          We are very sorry you had an issue. Redvest is working hard to provide a safe
          space to our community. We will take care of it. Please select the issue.
        </Text>
        {tagLoop}
        <View style={{ alignSelf: 'center', marginTop: heightPercentageToDP(10) }}>
          <CustomButton
            text="Continue"
            primary
            shadow
            disabled={!selectedOption}
            loading={isLoading}
            onPress={() => {
              selectedOption == 'Block'
                ? //Block here
                  handleBlockOnly(reportedUserId)
                : //Block here & go to report screen with params
                  NavigationService.navigate('ReportScreen', {
                    reportedUserId,
                    doBlock: true,
                  })
            }}
          />
        </View>
      </ScrollView>
    </BottomSheet>
  )
})

const styles = StyleSheet.create({
  imagebg: {
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(100),
    resizeMode: 'contain',
  },
  safearea: {
    flex: 1,
    alignItems: 'flex-start',
    marginTop: heightPercentageToDP(4),
    minHeight: Math.round(Dimensions.get('window').height / 2),
  },
  logo: {
    position: 'relative',
    left: widthPercentageToDP(2),
    top: heightPercentageToDP(2),
  },
  orContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: widthPercentageToDP(90),
  },
  orText: {
    color: 'grey',
    paddingHorizontal: widthPercentageToDP(4),
  },
  bottomButtons: {
    position: 'absolute',
    bottom: heightPercentageToDP(Platform.OS === 'ios' ? -2 : 2),
    flexDirection: 'column',
    width: 195,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInputWrapper: {
    // justifyContent: 'center',
    // alignContent:'center',
    alignItems: 'flex-start',
    padding: heightPercentageToDP(2.5),
    alignSelf: 'center',
    backgroundColor: '#474747',
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(25),
    borderRadius: heightPercentageToDP(Platform.isPad !== true ? 1.5 : 0.5),
    marginTop: heightPercentageToDP(3),
  },
  textinputSyles: {
    color: 'white',
    fontSize: actuatedNormalize(15),
    fontFamily: 'DMSans-Medium',
    width: widthPercentageToDP(80),
  },
})

export { BlockBottomSheet }
