import { Dimensions, Platform, PixelRatio } from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320

const actuatedNormalize = size => {
  const newSize = size * scale
  if (Platform.OS === 'ios') {
    {
      if (Platform.isPad === true)
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 7
      else return Math.round(PixelRatio.roundToNearestPixel(newSize))
    }
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}
export { actuatedNormalize }
