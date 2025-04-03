import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { StyleSheet, TouchableWithoutFeedback, View, BackHandler } from 'react-native'
import {  hasNotch } from 'react-native-device-info'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { heightPercentageToDP } from '@utils'

type BottomSheetProps = {
  children?: React.ReactNode
  onClose?: () => void
  height: number
  closeBottomSheet?: () => void
}

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void
  isActive: () => boolean
}

const BottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ children, onClose, height, closeBottomSheet }, ref) => {
    const SCREEN_HEIGHT = heightPercentageToDP(String(height))
    const MAX_TRANSLATE_Y = -SCREEN_HEIGHT
    const translateY = useSharedValue(0)
    const active = useSharedValue(false)
    const [isOpen, setIsOpen] = useState(false)

    const scrollTo = useCallback((destination: number) => {
      'worklet'
      active.value = destination !== 0
      if (destination !== 0) {
        runOnJS(setIsOpen)(true)
      } else {
        runOnJS(setIsOpen)(false)
      }
      translateY.value = withSpring(destination, { damping: 50 })
    }, [])

    const isActive = useCallback(() => {
      return active.value
    }, [])
    const handleDismiss = () => {
      onClose && onClose()
    }
    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [scrollTo, isActive])
    const context = useSharedValue({ y: 0 })
    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value }
      })
      .onUpdate(event => {
        translateY.value = event.translationY + context.value.y
        translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y)
        if (translateY.value > -SCREEN_HEIGHT / 1.5) {
        }
      })
      .onEnd(() => {
        if (translateY.value > -SCREEN_HEIGHT / 1.5) {
          scrollTo(0)
          runOnJS(handleDismiss)()
        } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
          scrollTo(MAX_TRANSLATE_Y)
        }
      })

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(
        translateY.value,
        [MAX_TRANSLATE_Y + 100, MAX_TRANSLATE_Y],
        [5, 30],
        Extrapolate.CLAMP,
      )

      return {
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
        transform: [{ translateY: translateY.value }],
      }
    })
    const rBottomSheetOverlayContainerStyle = useAnimatedStyle(() => {
      // const opacity = interpolate(
      //   translateY.value,
      //   [0, MAX_TRANSLATE_Y + SCREEN_HEIGHT * 0.99],
      //   [0, 1],
      //   Extrapolate.CLAMP,
      // )
      const backgroundColor = interpolateColor(
        translateY.value,
        [0, MAX_TRANSLATE_Y + SCREEN_HEIGHT * 0.19],
        ['transparent', 'rgba(0,0,0,0.7)'],
      )
      const zIndex = interpolate(
        translateY.value,
        [0, MAX_TRANSLATE_Y + SCREEN_HEIGHT * 0.99],
        [-9999, 0],
        Extrapolate.CLAMP,
      )
      return {
        zIndex,
        backgroundColor,
      }
    })
    function handleBackButtonClick() {
      closeBottomSheet && closeBottomSheet()
      return isOpen
    }
    useEffect(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)
      }
    }, [isOpen])
    return (
      <>
        <TouchableWithoutFeedback
          onPress={() => {
            scrollTo(0)
            setTimeout(() => {
              handleDismiss()
            }, 500)
          }}>
          <Animated.View
            style={[rBottomSheetOverlayContainerStyle, styles.overlayContainer]}
          />
        </TouchableWithoutFeedback>
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              styles.bottomSheetContainer,
              rBottomSheetStyle,
              {
                height: heightPercentageToDP(String(height)),
                top: hasNotch()
                  ? heightPercentageToDP('102')
                  : heightPercentageToDP('102'),
              },
            ]}>
            <View style={styles.line} />
            {children}
          </Animated.View>
        </GestureDetector>
      </>
    )
  },
)

const styles = StyleSheet.create({
  bottomSheetContainer: {
    zIndex: 1,
    width: '100%',
    backgroundColor: 'black',
    position: 'absolute',
    shadowColor: '#B9D094',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 10,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: '#B9D094',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
  overlayContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    bottom: 0,
    zIndex: -9999,
    opacity: 1,
  },
})

export { BottomSheet }
