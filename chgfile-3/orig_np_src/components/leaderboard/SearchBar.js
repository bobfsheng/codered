import React, { useState } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'

const SearchBar = ({ data, searchTerm, setSearchTerm }) => {
  const [searchResults, setSearchResults] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const searchFilterFunction = text => {
    const filteredData = data.filter(item => {
      const itemData = item.toUpperCase()
      const textData = text.toUpperCase()
      return itemData.indexOf(textData) > -1
    })
    setSearchResults(filteredData)
    setSearchTerm(text)
    setIsDropdownOpen(true) // Open dropdown when typing
  }

  const handleSelection = item => {
    setSearchTerm(item)
    setIsDropdownOpen(false) // Close dropdown on selection
  }

  const renderCollegeItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelection(item)}>
      <Text style={styles.searchItems}>{item}</Text>
    </TouchableOpacity>
  )

  return (
    <View>
      <TextInput
        style={[
          textStyles.normalRegular,
          {
            borderColor: 'white',
            borderRadius: heightPercentageToDP(20),
            color: 'white',
            borderWidth: 1,
            marginBottom: heightPercentageToDP(2),
            paddingHorizontal: widthPercentageToDP(10),
            marginHorizontal: widthPercentageToDP(5),
            paddingVertical: heightPercentageToDP(2),
          },
        ]}
        color="white"
        placeholder="Search for an organization..."
        placeholderTextColor="gray"
        onChangeText={text => searchFilterFunction(text)}
        value={searchTerm}
      />
      {isDropdownOpen && (
        <View style={{ height: heightPercentageToDP(25) }}>
          <FlatList
            data={searchResults}
            renderItem={renderCollegeItem}
            keyExtractor={item => item}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  searchItems: {
    color: 'white',
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    paddingHorizontal: widthPercentageToDP(10),
    paddingVertical: heightPercentageToDP(0.7),
  },
  textInput: [
    textStyles.normalRegular,
    {
      //   width: '70%',
      //   height: '100%',
      color: colors.white,
      fontSize: actuatedNormalize(11),
    },
  ],
})

export { SearchBar }
