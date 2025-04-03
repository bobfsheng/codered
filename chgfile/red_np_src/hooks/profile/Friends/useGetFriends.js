import { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { useAuthSelector, useReduxDispatch, userActions } from '@store'

const useGetFriends = () => {
  const { userId } = useAuthSelector(state => state)
  const dispatch = useReduxDispatch()
  const [friendsListLoading, setFriendsListLoading] = useState(false)

  const getFriendsList = async () => {
    if (!userId) return
    setFriendsListLoading(true)
    try {
      const followedDocs = await firestore()
        .collection('Follows')
        .where('followerId', '==', userId)
        .get()
      const friends = followedDocs.docs.map(doc => ({ ...doc.data(), docId: doc.id }))
      dispatch(userActions.setFriendsList({ friendsList: friends }))
    } catch (error) {
      console.error('getFriendsList error =>', error)
    } finally {
      setFriendsListLoading(false)
    }
  }

  useEffect(() => {
    getFriendsList()
  }, [userId]) // Dependency on userId to refetch when it changes

  return { friendsListLoading, getFriendsList }
}

export { useGetFriends }
