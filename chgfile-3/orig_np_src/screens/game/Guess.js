import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  Animated,
} from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  updateUserWithCoins,
} from '@utils'
import { authActions, useReduxDispatch, useAuthSelector } from '@store'
import {  CustomButton } from '@components'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { TopBar } from '@components'
import { stockInfo } from '@constants/stockInfo'

const Guess = ({ route }) => {
  const bounceAnim = useRef(new Animated.Value(1)).current

  const triggerBounceAnimation = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const dispatch = useReduxDispatch()
  const { userId, redCoins, userLevel } = useAuthSelector(state => state)

  const shuffleArray = array => {
    let arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

const [shuffledStockInfo, setShuffledStockInfo] = useState(() =>
  shuffleArray(
    stockInfo.filter(
      stock => stock.info && stock.info.longName && stock.info.longBusinessSummary,
    ),
  ),
)

  const [selectedStock, setSelectedStock] = useState(() => shuffledStockInfo[0])
  const [options, setOptions] = useState([])

  const correctLongName = selectedStock.info.longName
  const transformedSummary = selectedStock.info.longBusinessSummary.replace(
    new RegExp(correctLongName, 'g'),
    '___________',
  )

const generateOptions = correctAnswer => {
  let options = [correctAnswer]
  const filteredStockInfo = shuffledStockInfo.filter(
    stock => stock.info && stock.info.longName && stock.info.longBusinessSummary,
  )

  while (options.length < 4) {
    const randomStock =
      filteredStockInfo[Math.floor(Math.random() * filteredStockInfo.length)].info
        .longName
    if (!options.includes(randomStock)) {
      options.push(randomStock)
    }
  }
  return shuffleArray(options)
}


  useEffect(() => {
    setOptions(generateOptions(correctLongName))
  }, [selectedStock])

  // Local State Variables
  const [score, setScore] = useState(0)
  const [userSelectedAnswer, setUserSelectedAnswer] = useState(null)
  const [showAnswers, setShowAnswers] = useState(false)

  const handleAnswerSelect = option => {
    setUserSelectedAnswer(option)
  }

  const isCorrectAnswer = option => {
    const correct = showAnswers && userSelectedAnswer === correctLongName
    if (correct && showAnswers) triggerBounceAnimation()
    return correct
  }

  const isUserSelectedAnswer = option => {
    return userSelectedAnswer === option && !showAnswers
  }

  const isUserSelectedIncorrectAnswer = option => {
    return (
      showAnswers &&
      userSelectedAnswer === option &&
      userSelectedAnswer !== correctLongName
    )
  }

  const handleNextQuestion = () => {
    if (userSelectedAnswer === correctLongName) {
      setScore(prevScore => prevScore + 10)
      const updatedRedCoins = redCoins + 10
      updateUserWithCoins(userId, updatedRedCoins)
      dispatch(authActions.setRedCoins({ redCoins: updatedRedCoins }))
      // Handle coin update logic...
    }
    setSelectedStock(
      () => shuffledStockInfo[Math.floor(Math.random() * shuffledStockInfo.length)],
    )
    setShowAnswers(false)
    setUserSelectedAnswer(null)
  }

  // useEffect(() => {
  //   console.log(
  //     correctLongName,
  //     userSelectedAnswer,
  //     userSelectedAnswer === correctLongName,
  //   )
  // }, [userSelectedAnswer])

  return (
    <View style={styles.mainView}>
      <TopBar
        score={score}
        showCategory={false}
      />
      {/* ... TopBar Component and the rest of your UI components ... */}
      <SafeAreaView style={styles.mainView}>
        <View style={{ paddingHorizontal: widthPercentageToDP(5) }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              marginTop: heightPercentageToDP(2),
              paddingBottom: heightPercentageToDP(10),
            }}>
            <Text
              numberOfLines={7}
              style={[
                textStyles.normalBoldRegular,
                {
                  color: 'white',
                  fontSize: actuatedNormalize(14),
                  width: widthPercentageToDP(90),
                  marginBottom: heightPercentageToDP(2),
                  textAlign: 'center',
                },
              ]}>
              {transformedSummary}
            </Text>
            {options?.map((option, index) => (
              <Animated.View
                key={index}
                style={[
                  isCorrectAnswer(option) && { transform: [{ scale: bounceAnim }] },
                ]}>
                <TouchableOpacity
                  onPress={() => handleAnswerSelect(option)}
                  disabled={showAnswers}
                  style={[
                    styles.buttonStyle,
                    isUserSelectedAnswer(option) && { backgroundColor: '#ddd' },
                    isCorrectAnswer(option) &&
                      option === correctLongName && { backgroundColor: colors.primary },
                    isUserSelectedIncorrectAnswer(option) && {
                      backgroundColor: colors.redError,
                    },
                  ]}>
                  <Text
                    style={[
                      textStyles.normalRegular,
                      {
                        color: 'white',
                        color: isUserSelectedAnswer(option) ? 'black' : 'white',
                        marginHorizontal: widthPercentageToDP(4),
                      },
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
            {showAnswers && (
              <View>
                {userSelectedAnswer === correctLongName ? (
                  <Text
                    style={[
                      textStyles.normalRegular,
                      {
                        color: 'white',
                        fontSize: actuatedNormalize(11),
                        width: widthPercentageToDP(90),
                        margin: heightPercentageToDP(2),
                        textAlign: 'center',
                      },
                    ]}>
                    ✅ Correct!
                  </Text>
                ) : (
                  <Text
                    style={[
                      textStyles.normalRegular,
                      {
                        color: 'white',
                        fontSize: actuatedNormalize(11),
                        width: widthPercentageToDP(85),
                        margin: heightPercentageToDP(2),
                        textAlign: 'center',
                      },
                    ]}>
                    ❌ Incorrect. The correct answer is: {correctLongName}
                  </Text>
                )}
              </View>
            )}
            <View style={{ alignItems: 'center', marginTop: heightPercentageToDP(3) }}>
              <CustomButton
                text={showAnswers ? 'Next Question' : 'Submit Answer'}
                onPress={() =>
                  showAnswers ? handleNextQuestion() : setShowAnswers(true)
                }
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  mainView: { backgroundColor: colors.darkBackground, flex: 1 },
  welcomeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonStyle: {
    fontSize: actuatedNormalize(11),
    borderWidth: 2,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.primary,
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(8),
    borderRadius: 3,
  },
})

export { Guess }