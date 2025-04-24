import { useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { useAuthSelector, useReduxDispatch, userActions } from '@store'
import { StackActions, useNavigation } from '@react-navigation/native'
import { useGetFriends } from './Friends'
import { NavigationService } from '@navigation'

const useBlock = () => {
  const navigation = useNavigation()
  const dispatch = useReduxDispatch()
  const { userId } = useAuthSelector(state => state)
  const { getFriendsList } = useGetFriends()
  const [isLoading, setIsLoading] = useState(false)
  const popAction = StackActions.pop(2)

  const handleRemoveFollows = async reportedUserId => {
    try {
      const followedDoc = await firestore()
        .collection('Follows')
        .where('followerId', '==', userId)
        .where('uid', '==', reportedUserId)
        .get()
      if (followedDoc?.docs[0]?.id) {
        await firestore().collection('Follows').doc(followedDoc?.docs[0]?.id).delete()
      }
      const followerDoc = await firestore()
        .collection('Follows')
        .where('followerId', '==', reportedUserId)
        .where('uid', '==', userId)
        .get()
      if (followerDoc?.docs[0]?.id) {
        await firestore().collection('Follows').doc(followerDoc?.docs[0]?.id).delete()
      }
      getFriendsList()
    } catch (error) {
      console.log('handleRemoveFollows error =>', error)
    }
  }
  const updateOtherUserBlockDoc = async (blockUserId, addActionType) => {
    const blockDoc = await firestore().collection('Block').doc(blockUserId).get()
    if (blockDoc.exists) {
      if (addActionType) {
        const blockedByUsers = blockDoc.data().blockedBy
        blockedByUsers.push(userId)
        const uniqueBlocedBy = [...new Set(blockedByUsers)]
        await firestore().collection('Block').doc(blockUserId).update({
          blockedBy: uniqueBlocedBy,
        })
      } else {
        const blockedByUsers = blockDoc.data().blockedBy
        const uniqueBlocedBy = blockedByUsers.filter(id => id !== userId)
        await firestore().collection('Block').doc(blockUserId).update({
          blockedBy: uniqueBlocedBy,
        })
      }
    } else {
      await firestore()
        .collection('Block')
        .doc(blockUserId)
        .set({
          uid: blockUserId,
          blocked: [],
          blockedBy: [userId],
        })
    }
  }
  const handleBlock = async blockUserId => {
    try {
      const blockDoc = await firestore().collection('Block').doc(userId).get()
      if (blockDoc.exists) {
        const blockedUsers = blockDoc.data().blocked
        blockedUsers.push(blockUserId)
        const uniqueBloced = [...new Set(blockedUsers)]
        await firestore().collection('Block').doc(userId).update({
          blocked: uniqueBloced,
        })
      } else {
        await firestore()
          .collection('Block')
          .doc(userId)
          .set({
            uid: userId,
            blocked: [blockUserId],
            blockedBy: [],
          })
      }
      updateOtherUserBlockDoc(blockUserId, true)
    } catch (error) {
      console.log('handleRemoveFollows error =>', error)
    }
  }
  const handleUnblock = async blockUserId => {
    try {
      setIsLoading(true)
      const blockDoc = await firestore().collection('Block').doc(userId).get()
      if (blockDoc.exists) {
        const blockedUsers = blockDoc.data().blocked
        const uniqueBloced = blockedUsers.filter(id => id !== blockUserId)
        await firestore().collection('Block').doc(userId).update({
          blocked: uniqueBloced,
        })
      }
      updateOtherUserBlockDoc(blockUserId, false)
      setIsLoading(false)
    } catch (error) {
      console.log('handleRemoveFollows error =>', error)
      setIsLoading(false)
    }
  }
  const handleBlockOnly = async reportedUserId => {
    try {
      setIsLoading(true)
      await handleRemoveFollows(reportedUserId)
      await handleBlock(reportedUserId)
      dispatch(userActions.setSearchFriendString({ searchString: '' }))
      setIsLoading(false)
      NavigationService.goBack()
    } catch (error) {
      setIsLoading(false)
      console.log('handleBlock error =>', error)
    }
  }
  const handleReportAndBlock = async (reportedUserId, reportCause, description) => {
    try {
      handleRemoveFollows(reportedUserId)
      handleBlock(reportedUserId)
      setIsLoading(true)
      await firestore().collection('Reports').add({
        uid: userId,
        reportedUserId,
        reportCause,
        description,
        reportedData: new Date(),
      })
      dispatch(userActions.setSearchFriendString({ searchString: '' }))
      setIsLoading(false)
      NavigationService.dispatch(popAction)
    } catch (error) {
      setIsLoading(false)
      console.log('handleBlock error =>', error)
    }
  }
  return {
    isLoading,
    handleUnblock,
    handleBlockOnly,
    handleReportAndBlock,
  }
}

export { useBlock }
