import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import {
  actuatedNormalize,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
} from '@utils'
import LinearGradient from 'react-native-linear-gradient'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ProgressCircle } from '@components'
import { NavigationService } from '@navigation'

const ProgressBar = React.memo(
  ({
    onPress,
    emoji,
    category,
    explanation,
    quiz,
    score,
    progress,
    gradientColors,
    isLoggedIn,
    setShowOrderconfirmationModal,
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (isLoggedIn) {
            NavigationService.navigate('QuizMap', {
              category,
              emoji,
              explanation,
              gradientColors,
              progress,
            })
          } else {
            setShowOrderconfirmationModal(true)
          }
        }}>
        <LinearGradient
          colors={gradientColors}
          style={[styles.cardContainer]}
          start={{ x: 0, y: 0 }} // Top-left corner
          end={{ x: 0.5, y: 0.7 }} // Bottom-right corner
        >
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: actuatedNormalize(20) }}>
              {emoji}
              {'   '}
            </Text>
            <View>
              <Text style={[styles.titleTextBold]} numberOfLines={2}>
                {category}
              </Text>
              <Text style={[styles.titleText]} numberOfLines={2}>
                {explanation}
              </Text>
            </View>
          </View>
          {quiz === true ? (
            <View style={{}}>
              <ProgressCircle
                radius={widthPercentageToDP(7)}
                progress={progress}
                color={'rgba(255,255,255,0.8)'}
              />
            </View>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Text style={[styles.highestScoreText]}>Highest Score</Text>
              <Text style={[styles.titleTextBold]}>{score}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
      //  <TouchableOpacity onPress={onPress}>
      //     <View style={[styles.button]}>
      //       {/* <Text style={[styles.buttonText]}>Get Now</Text> */}
      //       <Text style={[styles.buttonText]}>{buttonText}</Text>
      //     </View>
      //   </TouchableOpacity>
    )
  },
)
const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    paddingHorizontal: widthPercentageToDP(3),
    paddingVertical: heightPercentageToDP(0.5),
    borderRadius: heightPercentageToDP(7),
    marginTop: heightPercentageToDP(2),
  },
  cardContainer: {
    height: widthPercentageToDP(22),
    width: widthPercentageToDP(85),
    borderRadius: heightPercentageToDP(1),
    backgroundColor: 'rgba(101,191,255,0.3)',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: widthPercentageToDP(4),
    marginBottom: heightPercentageToDP(1.5),
    margin: heightPercentageToDP(1),
  },
  buttonText: [
    textStyles.bigRegular,
    { color: 'black', fontSize: actuatedNormalize(14) },
  ],
  titleText: [
    textStyles.bigRegular,
    { color: 'white', fontSize: actuatedNormalize(10), width: widthPercentageToDP(47) },
  ],
  titleTextBold: [
    textStyles.bigSemiBold,
    { color: 'white', fontSize: actuatedNormalize(12), width: widthPercentageToDP(47) },
  ],
  highestScoreText: [
    textStyles.bigRegular,
    { color: '#9C9C9C', fontSize: actuatedNormalize(11) },
  ],
  scoreText: [textStyles.bigRegular, { color: 'white', fontSize: actuatedNormalize(11) }],
})

export { ProgressBar }
