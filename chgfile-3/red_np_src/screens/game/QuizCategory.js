import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  Platform,
  Animated
} from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  updateUserWithLevel,
  updateUserWithCoins,
  pushGameLeaderboardScore
} from '@utils'
import { authActions, useReduxDispatch, useAuthSelector } from '@store'
import { AdComponent, CustomButton } from '@components'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { questions } from '@constants/questions'
import { categoriesWithEmojis } from '@constants/categoriesWithEmojis'
import { Category, TopBar, Question, LevelUp } from '@components'
// import LottieView from 'lottie-react-native'
import checkmark from '@constants'

const QuizCategory = ({ route }) => {
  const { secretCode } = route.params ?? {}
  const { allCategories, categoryParam } = route?.params
  const dispatch = useReduxDispatch()

  const { userId, redCoins, userLevel } = useAuthSelector(state => state)


  const [selectedCategory, setSelectedCategory] = useState(categoryParam)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showAnswers, setShowAnswers] = useState(false)
  const [userSelectedAnswer, setUserSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [answeredQuestionIndexes, setAnsweredQuestionIndexes] = useState([])


  const filteredQuestions =
    selectedCategory === 'All Categories'
      ? questions
      : questions.filter(q => q.category === selectedCategory)

  const sortedQuestions = filteredQuestions.sort((a, b) => a.difficulty - b.difficulty)

  const handleAnswerSelect = answerIndex => {
    setUserSelectedAnswer(answerIndex)
  }

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

   const isCorrectAnswer = index => {
     const correct =
       showAnswers &&
       userSelectedAnswer !== null &&
       index === sortedQuestions[currentQuestionIndex]?.answer

     if (correct && showAnswers) triggerBounceAnimation()
     return correct
   }

   const isUserSelectedAnswer = index => {
     return (
       userSelectedAnswer === index &&
       (!showAnswers ||
         userSelectedAnswer === sortedQuestions[currentQuestionIndex]?.answer)
     )
   }

   const isUserSelectedIncorrectAnswer = index => {
     return (
       userSelectedAnswer === index &&
       userSelectedAnswer !== sortedQuestions[currentQuestionIndex]?.answer &&
       showAnswers
     )
   }
  const handleNextQuestion = () => {
   
   if (userSelectedAnswer === sortedQuestions[currentQuestionIndex]?.answer) {
     setScore(prevScore => prevScore + 10)
     const updatedRedCoins = redCoins + 10
     updateUserWithCoins(userId, updatedRedCoins)
     dispatch(authActions.setRedCoins({ redCoins: updatedRedCoins }))
     setAnsweredQuestionIndexes(prevIndexes => [...prevIndexes, currentQuestionIndex])
   }

   // Get the current level for the selected category or default to 0 if it's not defined yet
const currentLevel =
  userLevel[selectedCategory] !== undefined ? userLevel[selectedCategory] : 1


   // Increment and mod by the length of the sorted questions
   const updatedLevel = (currentLevel + 1) % sortedQuestions.length

   // Update the user level in the database
   updateUserWithLevel(userId,categoryParam, updatedLevel)

   dispatch(
     authActions.setUserLevel({
       userLevel: {
         ...userLevel,
         [selectedCategory]: updatedLevel,
       },
     }),
   )

   // Update the local component state
   setCurrentQuestionIndex(updatedLevel)
   setShowAnswers(false)
   setUserSelectedAnswer(null)
 }


  const [showCategory, setShowCategory] = useState(allCategories == false ? true : false)

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex - 1)
    setShowAnswers(false)
    setUserSelectedAnswer(null)
  }

  const handleGoBackToCategories = () => {
    setShowCategory(true)
    setSelectedCategory(null)
    setShowAnswers(false)
    setUserSelectedAnswer(null)
  }

  useEffect(() => {
    // When userLevel changes, set it to currentQuestionIndex
    if (userLevel !== undefined) {
      // setCurrentQuestionIndex(userLevel % sortedQuestions.length);
      setCurrentQuestionIndex(
       (userLevel[selectedCategory] || 1) % sortedQuestions.length,
      )
    }
    
  }, [userLevel, sortedQuestions.length])


  useEffect(() => {
    if (answeredQuestionIndexes.includes(currentQuestionIndex)) {
      handleNextQuestion()
    }
  }, [answeredQuestionIndexes, currentQuestionIndex])



  return (
    <View style={styles.mainView}>
      <TopBar
        score={score}
        currentQuestionIndex={currentQuestionIndex}
        showCategory={showCategory}
        handleGoBackToCategories={handleGoBackToCategories}
      />
      <SafeAreaView style={styles.mainView}>
        {/* <LottieView
          source={checkmark}
          autoPlay
          loop
          style={{ width: 150, height: 150 }} // Adjust size as needed
        /> */}
        <View
          style={{
            paddingHorizontal: widthPercentageToDP(5),
          }}>
          <View
            style={{
              marginTop: heightPercentageToDP(2),
            }}>
            {!(
              currentQuestionIndex > 0 &&
              currentQuestionIndex % 5 === 0 &&
              currentQuestionIndex < sortedQuestions.length
            ) && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                  marginTop: heightPercentageToDP(2),
                  paddingBottom: heightPercentageToDP(10),
                }}>
                <Text
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
                  {
                    sortedQuestions[
                      (userLevel[selectedCategory] || 1) % sortedQuestions.length
                    ]?.question
                  }
                </Text>

                {sortedQuestions[
                  (userLevel[selectedCategory] || 1) % sortedQuestions.length
                ]?.options?.map((option, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      isCorrectAnswer(index) && { transform: [{ scale: bounceAnim }] },
                    ]}>
                    <TouchableOpacity
                      onPress={() => handleAnswerSelect(index)}
                      disabled={showAnswers}
                      style={[
                        styles.buttonStyle,
                        isUserSelectedAnswer(index) && { backgroundColor: '#ddd' },
                        isCorrectAnswer(index) && { backgroundColor: colors.primary },
                        isUserSelectedIncorrectAnswer(index) && {
                          backgroundColor: colors.redError,
                        },
                      ]}>
                      <Text
                        style={[
                          textStyles.normalRegular,
                          {
                            color: isUserSelectedAnswer(index) ? 'black' : 'white',
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
                    {userSelectedAnswer ===
                    sortedQuestions[
                      (userLevel[selectedCategory] || 1) % sortedQuestions.length
                    ]?.answer ? (
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
                        ❌ Incorrect. The correct answer is:{' '}
                        {
                          sortedQuestions[
                            (userLevel[selectedCategory] || 1) % sortedQuestions.length
                          ]?.options[
                            sortedQuestions[
                              (userLevel[selectedCategory] || 1) % sortedQuestions.length
                            ]?.answer
                          ]
                        }
                      </Text>
                    )}
                  </View>
                )}

                <View
                  style={{ alignItems: 'center', marginTop: heightPercentageToDP(3) }}>
                  <CustomButton
                    text={showAnswers ? 'Next Question' : 'Submit Answer'}
                    onPress={() => {
                      if (showAnswers) {
                        handleNextQuestion()
                      } else {
                        setShowAnswers(true)
                      }
                    }}
                  />
                </View>
              </ScrollView>
            )}
            {currentQuestionIndex > 0 &&
              currentQuestionIndex % 5 === 0 &&
              currentQuestionIndex < sortedQuestions.length && (
                // show an ad
                <>
                  <LevelUp
                    level={userLevel[categoryParam]}
                    handleNextQuestion={handleNextQuestion}
                  />
                </>
              )}
          </View>
        </View>
      </SafeAreaView>
      {/* {(!isLoggedIn || (isSubscriptionLoaded === true && subscriptionName === '')) && (
      <AdComponent/>
      )} */}
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
    borderRadius: 300,
  },
})

export { QuizCategory }
