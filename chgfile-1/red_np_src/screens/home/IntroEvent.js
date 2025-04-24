import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Button, 
  Platform
} from 'react-native'
import { AnimatedTyping } from '../../components/general/AnimatedTyping'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  localSaveItem,
  StorageKeys,
} from '@utils'
import { CustomStockCircle, CustomAmount, CustomButton } from '@components'
import { NavigationService } from '@navigation'
import store, { useReduxDispatch, userActions, useUserSelector } from '@store'

const IntroEvent = () => {
  const dispatch = useReduxDispatch()
 const [isAnimating, setIsAnimating] = useState(false)
  const animationValue = new Animated.Value(0)
  const { onboardingGame } = useUserSelector(state => state)

 const startAnimation = () => {
   setIsAnimating(true)
   Animated.timing(animationValue, {
     toValue: 1,
     duration: 500, // Adjust the duration as needed
     easing: Easing.ease, // Choose an appropriate easing function
     useNativeDriver: false,
   }).start(async () => {
     // Make this function asynchronous
     // Animation completed
      try {
     dispatch(userActions.setOnboardingGame({ onboardingGame: true }))

       await localSaveItem(StorageKeys.onboardingGameShown, JSON.stringify(true)) // Await the saving
           NavigationService.navigate('Home', { screen: 'HomeScreen' })
      } catch (error) {
        console.error('Failed to save to local storage:', error)
      }
      console.log(onboardingGame)

   })
 }


  const [greetingCompleted0, setGreetingCompleted0] = useState(false)
  const [greetingCompleted, setGreetingCompleted] = useState(false)
  const [greetingCompleted2, setGreetingCompleted2] = useState(false)
  const [greetingCompleted3, setGreetingCompleted3] = useState(false)
  const [selected, setSelected] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(false)
  const stocks = [
    { stock: 'Amazon', symbol: 'AMZN' },
    { stock: 'Tesla', symbol: 'TSLA' },
    { stock: 'Netflix', symbol: 'NFLX' },
    { stock: 'Amazon', symbol: 'AMZN' },
    { stock: 'Tesla', symbol: 'TSLA' },
    { stock: 'Netflix', symbol: 'NFLX' },
    { stock: 'Amazon', symbol: 'AMZN' },
    { stock: 'Tesla', symbol: 'TSLA' },
    { stock: 'Netflix', symbol: 'NFLX' },
    { stock: 'Amazon', symbol: 'AMZN' },
    { stock: 'Tesla', symbol: 'TSLA' },
    { stock: 'Netflix', symbol: 'NFLX' },
  ]
  const amount = [{ amount: 100 }, { amount: 1000 }, { amount: 10000 }]
  const formatValue = value => {
    if (!value) return '0';
    return value
      ?.toFixed(0)
      ?.toString()
      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }



  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.darkBackground,
        justifyContent: 'center',
      }}>
      <View
        style={{
          marginHorizontal: widthPercentageToDP(6),
          marginTop: heightPercentageToDP(5),
        }}>
        <AnimatedTyping
          fontSize={actuatedNormalize(18)}
          bold={true}
          text={['Hi! Welcome to Redvest!']}
          onComplete={() => setGreetingCompleted0(true)}
        />
        <AnimatedTyping
          fontSize={actuatedNormalize(14)}
          text={[
            'Let’s play a game! This will take 5 seconds. It’s year 2011, choose a stock to invest ',
          ]}
          onComplete={() => setGreetingCompleted(true)}
        />
        {greetingCompleted && (
          <>
            {/* <Button title="Next" onPress={() => setNextPressed(true)} /> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginVertical: heightPercentageToDP(4),
              }}>
              {stocks?.map(
                (categoryItem, index) =>
                  // Check if selected is false or stock matches selected
                  (selected === false || categoryItem.stock === selected) && (
                    <TouchableOpacity
                      onPress={() => {
                        setSelected(categoryItem.stock)
                      }}
                      style={{ marginHorizontal: widthPercentageToDP(6) }}
                      key={index} // Make sure to provide a unique key for each item in the array
                    >
                      <CustomStockCircle
                        event={true}
                        selected={selected}
                        stock={categoryItem.stock}
                        symbol={categoryItem.symbol}
                        index={index}
                        onPress={() => {
                          setSelected(categoryItem.stock)
                        }}
                      />
                    </TouchableOpacity>
                  ),
              )}
            </View>
          </>
        )}
        {selected && (
          <AnimatedTyping
            fontSize={actuatedNormalize(14)}
            text={['Now select the amount']}
            onComplete={() => setGreetingCompleted2(true)}
          />
        )}
        {greetingCompleted2 && (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginVertical: heightPercentageToDP(4),
              }}>
              {amount?.map(
                (money, index) =>
                  (selectedAmount === false || money.amount === selectedAmount) && (
                    <TouchableOpacity
                      style={{ marginHorizontal: widthPercentageToDP(4) }}
                      onPress={() => {
                        setSelectedAmount(money.amount)
                      }}
                      key={index}>
                      <CustomAmount
                        amount={money.amount}
                        selectedAmount={selectedAmount}
                      />
                    </TouchableOpacity>
                  ),
              )}
            </View>
          </>
        )}
        {selectedAmount && (
          <AnimatedTyping
            fontSize={actuatedNormalize(14)}
            text={[
              'In 2021, you would have made. Drum roll please 🥁 🥁 🥁',
              // `$${nextPressed2 * 10}`,
            ]}
            onComplete={() => setGreetingCompleted3(true)}
          />
        )}
      </View>
      {greetingCompleted3 && (
        <>
          <Text style={[styles.symbol, { marginTop: heightPercentageToDP(2) }]}>
            {' '}
            $
            {formatValue(
              selectedAmount *
                (selected == 'Amazon' ? 15.3 : selected == 'Tesla' ? 189.47 : 53.08),
            )}
          </Text>
          <CustomButton
            text={`Let's Start!`}
            style={{
              alignContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: heightPercentageToDP(3),
            }}
            onPress={startAnimation}
          />
        </>
      )}
      {isAnimating && (
        <Animated.View
          style={[
            styles.overlay,
            {
              transform: [
                {
                  scaleX: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 50], // Adjust the final value for the desired size
                  }),
                },
                {
                  scaleY: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 100], // Adjust the final value for the desired size
                  }),
                },
              ],
              opacity: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1], // Fading out
              }),
            },
          ]}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  symbol: [
    textStyles.normalBold,
    {
      color: '#B9CC00',
      alignContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: actuatedNormalize(10),
    },
  ],
  overlay: {
    position: 'absolute',
    backgroundColor: colors.darkBackground,
    width: '100%',
    height: '100%',
    borderRadius: actuatedNormalize(100),
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: heightPercentageToDP(70),
  },
})

export { IntroEvent }