import React, { memo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { heightPercentageToDP, textStyles, widthPercentageToDP } from '@utils'
import { NavigationService } from '@navigation'
import Carousel from 'react-native-reanimated-carousel'

const CustomCarousel = memo(({ array }) => {
  return (
    <Carousel
      loop
      width={widthPercentageToDP(169)}
      height={heightPercentageToDP(14)}
      autoPlay={true}
      style={{ marginLeft: widthPercentageToDP(0) }}
      data={array}
      scrollAnimationDuration={40000}
      onSnapToItem={index => null}
      renderItem={({ index }) => (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              alignItems: 'center',
              marginBottom: heightPercentageToDP(1.5),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}
              onPress={() =>
                NavigationService.navigate('ExploreCategory', {
                  category: array[3]?.category,
                  catString: array[3]?.catString,
                  mainHeader: array[3]?.mainHeader,
                })
              }>
              <View style={styles.categoryStyle}>
                <Text
                  numberOfLines={1}
                  style={[
                    textStyles.normalRegular,
                    {
                      color: 'white',
                      marginHorizontal: widthPercentageToDP(5),
                      marginVertical: heightPercentageToDP(1),
                    },
                  ]}>
                  {array[3]?.fullString}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginLeft: widthPercentageToDP(4),
              }}
              onPress={() =>
                NavigationService.navigate('ExploreCategory', {
                  category: array[1]?.category,
                  catString: array[1]?.catString,
                  mainHeader: array[1]?.mainHeader,
                })
              }>
              <View style={styles.categoryStyle}>
                <Text
                  numberOfLines={1}
                  style={[
                    textStyles.normalRegular,
                    {
                      color: 'white',
                      marginHorizontal: widthPercentageToDP(5),
                      marginVertical: heightPercentageToDP(1),
                    },
                  ]}>
                  {array[1]?.fullString}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginLeft: widthPercentageToDP(4),
              }}
              onPress={() =>
                NavigationService.navigate('ExploreCategory', {
                  category: array[6]?.category,
                  catString: array[6]?.catString,
                  mainHeader: array[6]?.mainHeader,
                })
              }>
              <View style={styles.categoryStyle}>
                <Text
                  numberOfLines={1}
                  style={[
                    textStyles.normalRegular,
                    {
                      color: 'white',
                      marginHorizontal: widthPercentageToDP(5),
                      marginVertical: heightPercentageToDP(1),
                    },
                  ]}>
                  {array[6]?.fullString}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginLeft: widthPercentageToDP(4),
              }}
              onPress={() =>
                NavigationService.navigate('ExploreCategory', {
                  category: array[4]?.category,
                  catString: array[4]?.catString,
                  mainHeader: array[4]?.mainHeader,
                })
              }>
              <View style={styles.categoryStyle}>
                <Text
                  numberOfLines={1}
                  style={[
                    textStyles.normalRegular,
                    {
                      color: 'white',
                      marginHorizontal: widthPercentageToDP(5),
                      marginVertical: heightPercentageToDP(1),
                    },
                  ]}>
                  {array[4]?.fullString}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              marginLeft: widthPercentageToDP(3),
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}
              onPress={() =>
                NavigationService.navigate('ExploreCategory', {
                  category: array[0]?.category,
                  catString: array[0]?.catString,
                  mainHeader: array[0]?.mainHeader,
                })
              }>
              <View style={styles.categoryStyle}>
                <Text
                  numberOfLines={1}
                  style={[
                    textStyles.normalRegular,
                    {
                      color: 'white',
                      marginHorizontal: widthPercentageToDP(5),
                      marginVertical: heightPercentageToDP(1),
                    },
                  ]}>
                  {array[0]?.fullString}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginLeft: widthPercentageToDP(4),
              }}
              onPress={() =>
                NavigationService.navigate('ExploreCategory', {
                  category: array[2]?.category,
                  catString: array[2]?.catString,
                  mainHeader: array[2]?.mainHeader,
                })
              }>
              <View style={styles.categoryStyle}>
                <Text
                  numberOfLines={1}
                  style={[
                    textStyles.normalRegular,
                    {
                      color: 'white',
                      marginHorizontal: widthPercentageToDP(5),
                      marginVertical: heightPercentageToDP(1),
                    },
                  ]}>
                  {array[2]?.fullString}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginLeft: widthPercentageToDP(4),
              }}
              onPress={() =>
                NavigationService.navigate('ExploreCategory', {
                  category: array[5]?.category,
                  catString: array[5]?.catString,
                  mainHeader: array[5]?.mainHeader,
                })
              }>
              <View style={styles.categoryStyle}>
                <Text
                  numberOfLines={1}
                  style={[
                    textStyles.normalRegular,
                    {
                      color: 'white',
                      marginHorizontal: widthPercentageToDP(5),
                      marginVertical: heightPercentageToDP(1),
                    },
                  ]}>
                  {array[5]?.fullString}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginLeft: widthPercentageToDP(4),
              }}
              onPress={() =>
                NavigationService.navigate('ExploreCategory', {
                  category: array[7]?.category,
                  catString: array[7]?.catString,
                  mainHeader: array[7]?.mainHeader,
                })
              }>
              <View style={styles.categoryStyle}>
                <Text
                  numberOfLines={1}
                  style={[
                    textStyles.normalRegular,
                    {
                      color: 'white',
                      marginHorizontal: widthPercentageToDP(5),
                      marginVertical: heightPercentageToDP(1),
                    },
                  ]}>
                  {array[7]?.fullString}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
    // null
  )
})
const styles = StyleSheet.create({
  categoryStyle: {
    borderRadius: 10,
    borderColor: '#648C38',
    borderWidth: widthPercentageToDP(0.5),
  },
})
export { CustomCarousel }