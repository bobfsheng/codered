import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import {
  textStyles,
  widthPercentageToDP,
  actuatedNormalize,
} from '@utils'
import { Icon } from '@components'

const NumberInput = ({ value, onChange, style }) => {
  // const [number, setNumber] = useState(initialNumber);

  return (
    <View style={[{ alignItems: 'center' }, style]}>
      {/* Up Icon */}
      <TouchableOpacity onPress={() => onChange(value + 1)}>
        <Icon
          type="Entypo"
          name={'chevron-up'}
          size={widthPercentageToDP(7)}
          color="gray"
          onPress={() => onChange(value + 1)}
        />
      </TouchableOpacity>

      {/* Number Display */}
      <Text
        style={[
          textStyles.smallBold,
          {
            fontSize: actuatedNormalize(20),
            color: 'white',
            marginVertical: widthPercentageToDP(2),
          },
        ]}>
        {value}
      </Text>

      {/* Down Icon */}
      <TouchableOpacity onPress={() => onChange(Math.max(1, value - 1))}>
        <Icon
          type="Entypo"
          name={'chevron-down'}
          size={widthPercentageToDP(7)}
          color="gray"
          onPress={() => onChange(Math.max(1, value - 1))}
        />
      </TouchableOpacity>
    </View>
  )
}

export { NumberInput }
