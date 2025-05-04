import LinearGradient from 'react-native-linear-gradient'
import React from 'react'
import {
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { colors, heightPercentageToDP, textStyles, widthPercentageToDP } from '@utils'

const CustomButtonUnselected = ({
  icon,
  text,
  onPress,
  primary = false,
  small = false,
  outline = false,
  disabled = false,
  skip = false,
  loading = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled}
      skip={skip}>
      <LinearGradient
        colors={['gray', 'lightgray']}
        style={[
          styles.button,
          small ? styles.buttonSmall : styles.buttonLarge,
          primary
            ? outline
              ? styles.buttonPrimaryOutline
              : styles.buttonPrimary
            : outline
            ? styles.buttonSecondaryOutline
            : styles.buttonSecondary,
          disabled && primary && styles.primaryDisabled,
          disabled && !primary && styles.secondaryDisabled,
          skip && !primary && styles.textSkip,
          style,
        ]}>
        {icon && <Image source={icon} style={styles.icon} />}
        {loading ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text
            style={[
              primary
                ? small
                  ? textStyles.normalMedium
                  : textStyles.bigMedium
                : small
                ? textStyles.normalRegular
                : textStyles.bigRegular,
              primary
                ? outline
                  ? styles.textPrimaryOutline
                  : styles.textPrimary
                : outline
                ? styles.textSecondaryOutline
                : styles.textSecondary,
              disabled && primary && styles.textPrimaryDisabled,
              disabled && !primary && styles.textSecondaryDisabled,
              skip && !primary && styles.textSkip,
            ]}>
            {text}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: heightPercentageToDP(1),
    borderRadius: heightPercentageToDP(0.5),
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSkip: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  buttonLarge: {
    width: widthPercentageToDP(80),
    height: heightPercentageToDP(Platform.OS === 'ios' ? 5.8 : 6.3),
  },
  buttonSmall: {
    width: widthPercentageToDP(30),
    height: heightPercentageToDP(Platform.OS === 'ios' ? 4.2 : 4.8),
  },
  buttonPrimary: {
    borderRadius: 50,
  },
  buttonSecondary: {
    borderRadius: 50,
  },
  buttonPrimaryOutline: {
    backgroundColor: colors.darkBackground,
    borderColor: colors.primary,
    borderWidth: 3,
  },
  buttonSecondaryOutline: {
    backgroundColor: colors.darkBackground,
    borderColor: colors.offWhite,
    borderWidth: 2,
  },
  primaryDisabled: {
    backgroundColor: '#ccc',
  },
  secondaryDisabled: {
    backgroundColor: '#f5f5f5',
  },
  icon: {
    resizeMode: 'contain',
    width: 35,
    height: heightPercentageToDP(2.5),
    marginRight: 8,
  },
  textPrimary: {
    color: 'black',
  },
  textPrimaryOutline: {
    color: colors.primary,
  },
  textSecondary: {
    color: colors.offBlack,
  },
  textSecondaryOutline: {
    color: colors.offWhite,
  },
  textPrimaryDisabled: {
    color: 'white',
  },
  textSecondaryDisabled: {
    color: '#939393',
  },
})

export { CustomButtonUnselected }
