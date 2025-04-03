import React, { memo, useState, useCallback, useMemo, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, RefreshControl, Platform, ActivityIndicator } from 'react-native'
import { CustomSearchBar, UserComponent } from '@components'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { useGetFriends, useSearchFriends } from '@hooks'
import { useReduxDispatch, useUserSelector, userActions } from '@store'

const Friends = React.memo(() => {
  const dispatch = useReduxDispatch()
  const { searchLoading, searchedUsers, handleSearch } = useSearchFriends()
  const { friendsListLoading, getFriendsList } = useGetFriends()
  const { friendsList, searchFriendString } = useUserSelector(state => state)
  const [isLoading, setIsLoading] = useState(false)

  const loadMoreItems = async () => {
    setIsLoading(true)
    if (memoizedData.length > 6) {
      setIsLoading(false)
    }
  }

  const renderItem = ({ item }) => <UserComponent data={item} />

  const memoizedData = useMemo(() => {
    return searchFriendString?.length > 0 ? searchedUsers : friendsList
  }, [searchedUsers, friendsList, searchFriendString])

  useEffect(() => {
    getFriendsList()
  }, [])

  return (
    <View>
      <CustomSearchBar
        searchString={searchFriendString}
        setSearchString={val =>
          dispatch(userActions.setSearchFriendString({ searchString: val }))
        }
        loading={searchLoading}
        onPress={handleSearch}
      />
      <Text style={styles.headingText}>
        {searchFriendString?.length > 0 ? 'Search' : 'Following'}
      </Text>
      <View style={{ height: Platform.isPad === false ? '62%' : '57%' }}>
        <FlatList
          data={memoizedData}
          renderItem={renderItem}
          keyExtractor={item => item.uid.toString()}
          initialNumToRender={5}
          maxToRenderPerBatch={3}
          removeClippedSubviews={true}
          onEndReached={loadMoreItems}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            isLoading ? <ActivityIndicator size="small" color="white" /> : null
          }
          refreshControl={
            <RefreshControl
              colors={[colors.offWhite]}
              tintColor={colors.offWhite}
              refreshing={friendsListLoading}
              onRefresh={getFriendsList}
            />
          }
        />
      </View>
    </View>
  )
})


const styles = StyleSheet.create({
  headingText: [
    textStyles.bigBold,
    {
      fontSize: actuatedNormalize(13.5),
      color: 'white',
      marginLeft: widthPercentageToDP(8),
      marginVertical: heightPercentageToDP(2),
    },
  ],
})
export { Friends }
