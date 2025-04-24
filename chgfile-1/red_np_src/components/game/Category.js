// Category.js
import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import {
  textStyles,
  actuatedNormalize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '@utils'
import LinearGradient from 'react-native-linear-gradient'
import { NavigationService } from '@navigation'
import {  questions } from '@constants'

const colorsArray = [
  ['#81C784', '#66BB6A'], // Green shades
  ['#42A5F5', '#64B5F6'], // Blue shades
  ['#EC407A', '#F06292'], // Pink shades
  ['#FFAB40', '#FFCA28'], // Amber shades
  ['#FF7043', '#FF8A80'], // Coral shades
  ['#5C6BC0', '#7986CB'], // Purple shades
  ['#FF8A65', '#FFA726'], // Orange shades
  ['#26C6DA', '#4DD0E1'], // Cyan shades
  ['#AB47BC', '#BA68C8'], // Lavender shades
  ['#EF5350', '#EF9A9A'], // Red shades
  ['#C34D92', '#41A8F2'], // Yellow shades
  ['#FF5722', '#FF7043'], // Deep Orange shades
  ['#81C784', '#A5D6A7'], // Light Green shades
]

const Category = ({
  category,
  emoji,
  explanation,
  handleCategoryPress,
  index,
  gradientColors,
  userLevel,
  isLoggedIn
}) => {

  
  

   const getProgressPercentageForCategory = (category, userLevel) => {
     // Filter questions for the specified category
     let questionsForCategory = questions.filter(q => q.category === category)

     // If no questions are found for the category, default to all questions
     if (questionsForCategory.length === 0) {
       questionsForCategory = questions
     }

     // Get the number of questions for the category
     const totalQuestions = questionsForCategory.length


     // Get the user's level for the category
     const levelForCategory =
       (userLevel && (typeof userLevel === 'number' ? userLevel : userLevel[category])) ||
       0


     // Calculate and return the progress percentage
     return levelForCategory / totalQuestions
   }
  

  return (
    // <TouchableOpacity onPress={() => handleCategoryPress(category)}>
    <TouchableOpacity
      onPress={() => {
    
          const progressValue =
            typeof userLevel === 'number' 
              ? 0
              : getProgressPercentageForCategory(category, userLevel)

          NavigationService.navigate('QuizMap', {
            category,
            emoji,
            explanation,
            gradientColors,
            progress: progressValue,
          })
      }}>
      <LinearGradient
        key={index}
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.imageStyle, { alignItems: 'center' }]}>
        <Text
          style={{
            fontSize: actuatedNormalize(30),
            marginHorizontal: widthPercentageToDP(4),
          }}>
          {emoji}
        </Text>
        <View>
          <Text
            style={[
              textStyles.hugeRegular,
              { color: 'white', fontSize: actuatedNormalize(15) },
            ]}>
            {category}
          </Text>
          <Text
            style={[
              textStyles.mediumRegular,
              {
                color: 'white',
                fontSize: actuatedNormalize(11),
                width: widthPercentageToDP(63),
              },
            ]}>
            {explanation}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  imageStyle: {
    height: heightPercentageToDP(12),
    width: widthPercentageToDP(90),
    resizeMode: 'contain',
    marginBottom: heightPercentageToDP(2),
    borderRadius: actuatedNormalize(3),
    flexDirection: 'row',
  },
})

export { Category }
