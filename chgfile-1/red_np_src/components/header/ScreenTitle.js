import React from 'react'
import { View, Text,  } from 'react-native'
import {
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { Icon } from '@components'
import { NavigationService } from '@navigation'
import { userActions, useReduxDispatch } from '@store'

const ScreenTitle = ({ title, style,info }) => {
  const dispatch = useReduxDispatch()
  return (
    <View style={style}>
      <Text style={[textStyles.headerBold, { color: 'white', marginRight:widthPercentageToDP(5) }]}>      
      {info==true &&
        <Icon
        type="Ionicons"
        name={'ios-information-circle'}
        onPress={() =>
          dispatch(userActions.setInformation({ infoId: 31}))
        }
        size={widthPercentageToDP(5)}
        color="gray"
        // style={{
        //   alignSelf: 'flex-end',
        // }}
      />}  {title}</Text>
    </View>
  )
}

export { ScreenTitle }
