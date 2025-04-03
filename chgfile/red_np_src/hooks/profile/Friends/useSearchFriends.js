import { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { useAuthSelector, useUserSelector } from '@store'
import { useDebounce } from '@utils'
import _ from 'lodash'
const useSearchFriends = searchString => {
  const { userId } = useAuthSelector(state => state)
  const { searchFriendString: reduxSearchFriendString } = useUserSelector(state => state)
  const searchFriendString = searchString ?? reduxSearchFriendString

  const [searchLoading, setSearchLoading] = useState(false)
  const [searchedUsers, setSearchUsers] = useState([])
  const handleSearch = async () => {
    try {
      if (searchFriendString.length <= 0) return
      setSearchLoading(true)
      const searchedUserByName = await firestore()
        .collection('User')
        .where('userName', '>=', searchFriendString.toLowerCase())
        .where('userName', '<=', searchFriendString.toLowerCase() + '\uf8ff')
        .get()
      const searchedUserByEmail = await firestore()
        .collection('User')
        .where('userEmail', '>=', searchFriendString.toLowerCase())
        .where('userEmail', '<=', searchFriendString.toLowerCase() + '\uf8ff')
        .get()
      const blockedByDoc = await firestore().collection('Block').doc(userId).get()
      const allPromise = await Promise.all([searchedUserByName, searchedUserByEmail])
      const byUserNames = []
      const byEmails = []
      allPromise[0].forEach(doc => {
        byUserNames.push(doc.data())
      })
      allPromise[1].forEach(doc => {
        byEmails.push(doc.data())
      })
      const mergedUser = byUserNames.concat(byEmails)
      const uniqueByUidArray = _.uniqBy(mergedUser, function (e) {
        return e.uid
      })
      const uniqueArray = []
      const temp = uniqueByUidArray.map(item => {
        if (item.uid !== userId) {
          if (blockedByDoc?.data()?.blockedBy?.length > 0) {
            if (!blockedByDoc?.data()?.blockedBy.includes(item?.uid)) {
              uniqueArray.push(item)
            }
          } else {
            uniqueArray.push(item)
          }
        }
      })
      setSearchUsers(uniqueArray.slice(0, 50))
      setSearchLoading(false)
    } catch (error) {
      console.log('error =>', error.message)
      setSearchLoading(false)
    }
  }
  useEffect(() => {
    if (searchFriendString.length === 0) {
      setSearchUsers([])
    }
  }, [searchFriendString])
  useDebounce(handleSearch, [searchFriendString], 1000)

  return {
    searchLoading,
    searchedUsers,
    handleSearch,
  }
}

export { useSearchFriends }