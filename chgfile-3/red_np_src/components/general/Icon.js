import React from 'react'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { TouchableOpacity, Pressable } from 'react-native'
const Icon = ({ type, name, size, color, style, onPress }) => {
  return (
    <>
      {type === 'MaterialCommunityIcons' ? (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={onPress === undefined ? 1 : 0.3}>
          <MaterialCommunityIcons
            name={`${name}`}
            size={size}
            color={`${color}`}
            style={style}
          />
        </TouchableOpacity>
      ) : type === 'Feather' ? (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={onPress === undefined ? 1 : 0.3}>
          <Feather name={`${name}`} size={size} color={`${color}`} style={style} />
        </TouchableOpacity>
      ) : type === 'AntDesign' ? (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={onPress === undefined ? 1 : 0.3}>
          <AntDesign name={`${name}`} size={size} color={`${color}`} style={style} />
        </TouchableOpacity>
      ) : type === 'Entypo' ? (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={onPress === undefined ? 1 : 0.3}>
          <Entypo name={`${name}`} size={size} color={`${color}`} style={style} />
        </TouchableOpacity>
      ) : type === 'EvilIcons' ? (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={onPress === undefined ? 1 : 0.3}>
          <EvilIcons name={`${name}`} size={size} color={`${color}`} style={style} />
        </TouchableOpacity>
      ) : type === 'FontAwesome' ? (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={onPress === undefined ? 1 : 0.3}>
          <FontAwesome name={`${name}`} size={size} color={`${color}`} style={style} />
        </TouchableOpacity>
      ) : type === 'Ionicons' ? (
        name == 'game-controller' ? (
          <Pressable onPress={onPress} activeOpacity={onPress === undefined ? 1 : 0.3}>
            <Ionicons name={`${name}`} size={size} color={`${color}`} style={style} />
          </Pressable>
        ) : (
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={onPress === undefined ? 1 : 0.3}>
            <Ionicons name={`${name}`} size={size} color={`${color}`} style={style} />
          </TouchableOpacity>
        )
      ) : type === 'MaterialIcons' ? (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={onPress === undefined ? 1 : 0.3}>
          <MaterialIcons name={`${name}`} size={size} color={`${color}`} style={style} />
        </TouchableOpacity>
      ) : type === 'SimpleLineIcons' ? (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={onPress === undefined ? 1 : 0.3}>
          <SimpleLineIcons
            name={`${name}`}
            size={size}
            color={`${color}`}
            style={style}
          />
        </TouchableOpacity>
      ) : type === 'Fontisto' ? (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={onPress === undefined ? 1 : 0.3}>
          <Fontisto name={`${name}`} size={size} color={`${color}`} style={style} />
        </TouchableOpacity>
      ) : type === 'FontAwesome5' ? (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={onPress === undefined ? 1 : 0.3}>
          <FontAwesome5 name={`${name}`} size={size} color={`${color}`} style={style} />
        </TouchableOpacity>
      ) : null}
    </>
  )
}
export { Icon }
