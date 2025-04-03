import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import {
  View,
  Text,
  Button,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
  BackHandler,
  PanResponder,
  Animated,
  Modal,
} from 'react-native'
import { NavigationService } from '@navigation'
import { CustomButton, Icon } from '@components'
import {
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  actuatedNormalize,
  colors,
} from '@utils'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useCustomAccountData, useSPYData } from '@hooks'

const PopupComponent = forwardRef((props, ref) => {
  const {
    message,
    emoji,
    buttonText,
    onPress,
    title,
    isLoggedIn,
    onClose,
    level,
    topThreePL,
    onPressLoggedOut,
  } = props
  const { portfolio_value, yesterday, today, pnL } = useCustomAccountData()
    const stocksArray = ['TSLA', 'AAPL', 'NIO']
    const { spyStatus } = useSPYData()
  const SCREEN_HEIGHT = heightPercentageToDP('100%')
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current
  const isOpen = useRef(false)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        translateY.setValue(SCREEN_HEIGHT - gestureState.dy)
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          closePopup()
        } else if (gestureState.dy < -100) {
          openPopup()
        } else {
          snapToPreviousState()
        }
      },
    }),
  ).current

  const openPopup = () => {
    isOpen.current = true
    Animated.spring(translateY, {
      toValue: 0,
      damping: 50,
      useNativeDriver: false,
    }).start()
  }

  const closePopup = () => {
    isOpen.current = false
    Animated.spring(translateY, {
      toValue: SCREEN_HEIGHT,
      damping: 50,
      useNativeDriver: false,
    }).start(() => {
      onClose && onClose()
    })
  }

  const snapToPreviousState = () => {
    if (isOpen.current) {
      openPopup()
    } else {
      closePopup()
    }
  }

  useImperativeHandle(
    ref,
    () => ({
      openPopup,
      closePopup,
    }),
    [],
  )

  useEffect(() => {
    const handleBackButtonClick = () => {
      if (isOpen.current) {
        closePopup()
        return true
      }
      return false
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)
    }
  }, [])

  useEffect(() => {
    return () => {
      closePopup()
      translateY.stopAnimation()
    }
  }, [])

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen.current}
      onRequestClose={() => {
        isOpen.current = false
      }}>
      <View style={styles.overlayContainer}>
        <TouchableWithoutFeedback onPress={closePopup}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: translateY.interpolate({
                  inputRange: [0, SCREEN_HEIGHT],
                  outputRange: [0.7, 0],
                }),
              },
            ]}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.bottomSheetContainer,
            {
              transform: [{ translateY }],
            },
          ]}>
          <TouchableOpacity onPress={closePopup}>
            <View style={styles.line} />
          </TouchableOpacity>
          {isLoggedIn ? (
            <View style={styles.content}>
              <View style={styles.circle}>
                <Text style={styles.headerBig}>{emoji}</Text>
              </View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>
                <Icon
                  type="AntDesign"
                  name="checkcircle"
                  size={widthPercentageToDP(6)}
                  color={colors.primary}
                />
                {`  You ${today - yesterday < 0 ? 'lost ' : 'made '}`}
                <Text
                  style={[
                    styles.message,
                    {
                      color: today - yesterday < 0 ? colors.redError : colors.primary,
                      fontWeight: '900',
                    },
                  ]}>
                  ${!isNaN(today - yesterday) && `${(today - yesterday).toFixed(2)}`}{' '}
                </Text>
                today!{' '}
                {today - yesterday < 0 ? 'Invest more to hedge your portfolio.' : ''}
              </Text>
              <Text style={styles.message}>
                <Icon
                  type="AntDesign"
                  name="checkcircle"
                  size={widthPercentageToDP(6)}
                  color={colors.primary}
                />
                {`  Your most profitable assets are:`}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                }}>
                {topThreePL.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.stockContainer}
                    onPress={() =>
                      NavigationService.navigate('Home', {
                        screen: 'ExploreScreen',
                        params: {
                          stockTicker: item?.symbol,
                        },
                      })
                    }>
                    <Text
                      style={[
                        styles.message,
                        {
                          fontSize: actuatedNormalize(13),
                          color: 'black',
                          marginBottom: heightPercentageToDP(0),
                        },
                      ]}>
                      {item?.symbol}{' '}
                      <Text
                        style={[
                          styles.message,
                          {
                            color: colors.primary,
                            fontWeight: '900',
                            fontSize: actuatedNormalize(8),
                          },
                        ]}>
                        {parseFloat(item.unrealized_plpc)?.toFixed(2)}%{'   '}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.message}>
                <Icon
                  type="AntDesign"
                  name="checkcircle"
                  size={widthPercentageToDP(6)}
                  color={colors.primary}
                />
                {`  You’re at level `}
                <Text
                  style={[
                    styles.message,
                    {
                      color: colors.primary,
                      fontWeight: '900',
                    },
                  ]}>
                  {level}.
                </Text>{' '}
                Play to level up!
              </Text>
              <View style={{ alignSelf: 'center', marginTop: heightPercentageToDP(3) }}>
                <CustomButton text={buttonText} onPress={onPress} />
              </View>
            </View>
          ) : (
            <View style={styles.content}>
              <View style={styles.circle}>
                <Text style={styles.headerBig}>{emoji}</Text>
              </View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>
                <Icon
                  type="AntDesign"
                  name="checkcircle"
                  style={{}}
                  size={widthPercentageToDP(6)}
                  color={colors.primary}
                />
                {`  Market is `}
                <Text
                  style={[
                    styles.message,
                    {
                      color: spyStatus === 'down' ? colors.red : colors.primary3,
                      fontWeight: '900',
                    },
                  ]}>
                  {spyStatus === 'down' ? 'down' : 'up'}
                </Text>{' '}
                today. Based on the SPY ticker, which represents the S&P 500 index
              </Text>
              <Text style={styles.message}>
                <Icon
                  type="AntDesign"
                  name="checkcircle"
                  style={{}}
                  size={widthPercentageToDP(6)}
                  color={colors.primary}
                />
                {`  Popular stocks on Redvest:`}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                }}>
                {stocksArray.map((item, index) => (
                  <View key={index} style={styles.stockContainer}>
                    <Text
                      style={[
                        styles.message,
                        {
                          fontSize: actuatedNormalize(13),
                          color: 'black',
                          marginBottom: heightPercentageToDP(0),
                          paddingHorizontal: widthPercentageToDP(3),
                        },
                      ]}>
                      {item}
                      {'   '}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={{ alignSelf: 'center', marginTop: heightPercentageToDP(3) }}>
                <CustomButton text={buttonText} onPress={onPress} />
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  )
})
const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  bottomSheetContainer: {
    // backgroundColor: '#E8E5E2',
    backgroundColor: '#2A2727',
    borderTopRightRadius: heightPercentageToDP(3),
    borderTopLeftRadius: heightPercentageToDP(3),
    paddingBottom: heightPercentageToDP(5),
    padding: 20,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginBottom: heightPercentageToDP(4),
    borderRadius: 2,
  },
  content: {
    alignItems: 'flex-start',
  },
  circle: {
    height: heightPercentageToDP(11),
    width: heightPercentageToDP(11),
    borderRadius: heightPercentageToDP(10),
    backgroundColor: 'rgba(10,10,10,0.6)',
    borderWidth: heightPercentageToDP(0.3),
    borderColor: 'white',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: heightPercentageToDP(3),
  },
  stockContainer: {
    borderRadius: heightPercentageToDP(10),
    // backgroundColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'white',
    // borderWidth: heightPercentageToDP(0.1),
    marginHorizontal: widthPercentageToDP(2),
    borderColor: 'white',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: heightPercentageToDP(2),
    paddingVertical: heightPercentageToDP(1),
  },

  headerBig: [
    textStyles.bigSemiBold,
    { color: 'white', fontSize: actuatedNormalize(30) },
  ],
  title: {
    ...textStyles.bigMedium,
    fontSize: actuatedNormalize(20),
    color: 'white',
    marginLeft: widthPercentageToDP(4),
    // alignSelf: 'center',
    marginBottom: heightPercentageToDP(3),
  },
  message: {
    ...textStyles.bigRegular,
    fontSize: actuatedNormalize(14),
    marginLeft: widthPercentageToDP(4),
    color: 'white',
    marginBottom: heightPercentageToDP(2),
  },
})

export { PopupComponent }
