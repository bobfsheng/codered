import { Platform, StyleSheet } from 'react-native'
import { widthPercentageToDP, heightPercentageToDP } from './scaler'
import { actuatedNormalize } from './fontScaler'

const colors = {
  primary: '#78AC43',
  primary2: '#AED37F',
  primary3: '#B4D0B2',
  primary4: '#6CAE00',
  redError: '#EB5757',
  red: '#ff0000',
  white: '#EEEEEE',
  offWhite: '#E3E5E5',
  mediumGrey: '#C6CACC',
  darkGrey: '#5E6366',
  offBlack: '#1F1F1F',
  darkBackground: '#121212',
  mediumDarkBackground: '#212121',
  lightDarkBackground: '#242424',
  lightBrown: '#3E3E3E',
}

const textStyles = StyleSheet.create({
  // HUGE
  hugeRegular: {
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    fontSize: actuatedNormalize(25),
  },
  hugeMedium: {
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    fontSize: actuatedNormalize(25),
  },
  hugeSemiBold: {
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    fontSize: actuatedNormalize(25),
  },
  hugeBold: {
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    fontSize: actuatedNormalize(25),
  },
  // BIG
  bigRegular: {
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    fontSize: actuatedNormalize(15),
  },
  bigMedium: {
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    fontSize: actuatedNormalize(15),
  },
  bigSemiBold: {
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    fontSize: actuatedNormalize(15),
  },
  bigBold: {
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    fontSize: actuatedNormalize(15),
  },
  headerBold: {
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    fontSize: actuatedNormalize(17),
  },
  // NORMAL
  normalRegular: {
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    fontSize: actuatedNormalize(13),
  },
  normalMedium: {
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    fontSize: actuatedNormalize(13),
  },
  normalSemiBold: {
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    fontSize: actuatedNormalize(13),
  },
  normalBold: {
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    fontSize: actuatedNormalize(13),
  },
  // SMALL
  smallRegular: {
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    fontSize: actuatedNormalize(11),
  },
  smallMedium: {
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    fontSize: actuatedNormalize(11),
  },
  smallSemiBold: {
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    fontSize: actuatedNormalize(11),
  },
  smallBold: {
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    fontSize: actuatedNormalize(11),
  },
  // TINY
  tinyRegular: {
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    fontSize: actuatedNormalize(9),
  },
  tinyMedium: {
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    fontSize: actuatedNormalize(9),
  },
  tinySemiBold: {
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    fontSize: actuatedNormalize(9),
  },
  tinyBold: {
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
    fontSize: actuatedNormalize(9),
  },
})

const headerPaddings = {
  vertical: Platform.OS === 'ios' ? heightPercentageToDP(1) : 1,
}

const headerStyles = {
  backgroundColor: colors.darkBackground,
  shadowColor: 'transparent',
  elevation: 0,
  shadowOpacity: 0,
  borderBottomWidth: 0,
}

const headerOptions = {
  headerShown: false,
  headerTitle: '',
  headerStyle: headerStyles,
  // marginRight: widthPercentageToDP(4),
  // headerTitleAlign: 'center',
  // headerTitleStyle: [textStyles.bigSemiBold, { color: colors.offWhite }],
}

export { colors, textStyles, headerPaddings, headerStyles, headerOptions }
