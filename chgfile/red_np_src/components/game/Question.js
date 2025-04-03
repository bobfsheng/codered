import React, { useRef } from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import {
  textStyles,
  actuatedNormalize,
  widthPercentageToDP,
  colors,
  heightPercentageToDP,
} from '@utils'
import { AdComponent, CustomButton } from '@components'

const Question = ({
  questions,
  userSelectedAnswer,
  handleAnswerSelect,
  showAnswers,
  currentQuestionIndex,
  selectedCategory,
  userLevel,
  handleNextQuestion,
  setShowAnswers,
}) => {
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

  const filteredQuestions =
    selectedCategory === 'All Categories'
      ? questions
      : questions.filter(q => q.category === selectedCategory)

  const sortedQuestions = filteredQuestions.sort((a, b) => a.difficulty - b.difficulty)

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

  console.log(
    sortedQuestions[userLevel[selectedCategory] % sortedQuestions.length]?.question,
    'helo',
    userLevel[selectedCategory],
  )

  return (
    <View>
      <View>
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
            // sortedQuestions[
            //   userLevel !== undefined ? userLevel % sortedQuestions.length : 0
            // ]?.question
            sortedQuestions[userLevel[selectedCategory] % sortedQuestions.length]
              ?.question
          }
        </Text>

        {sortedQuestions[
          userLevel[selectedCategory] % sortedQuestions.length
        ]?.options?.map((option, index) => (
          <Animated.View
            key={index}
            style={[isCorrectAnswer(index) && { transform: [{ scale: bounceAnim }] }]}>
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
            sortedQuestions[userLevel[selectedCategory] % sortedQuestions.length]
              ?.answer ? (
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
                  sortedQuestions[userLevel[selectedCategory] % sortedQuestions.length]
                    ?.options[
                    sortedQuestions[userLevel[selectedCategory] % sortedQuestions.length]
                      ?.answer
                  ]
                }
              </Text>
            )}
          </View>
        )}

        <View style={{ alignItems: 'center', marginTop: heightPercentageToDP(3) }}>
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
      </View>
    </View>
  )
}

const styles = {
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
}

export { Question }
