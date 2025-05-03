import { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { useAuthSelector } from '@store'
import { useGetFriends } from './useGetFriends'

const useFriend = data => {
  const { userId } = useAuthSelector(state => state)
  const { getFriendsList } = useGetFriends()
  const [followLoading, setFollowLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isBlockLoading, setIsBlockLoading] = useState(false)

  const [followDocId, setFollowDocId] = useState('')
  const [userInfo, setUserInfo] = useState({})
  const handleFollow = async followedId => {
    try {
      setFollowLoading(true)
      if (followDocId) {
        await firestore().collection('Follows').doc(followDocId).delete()
        setFollowDocId('')
        setIsFollowing(false)
        setFollowLoading(false)
        getFriendsList()
      } else {
        const respos = await firestore().collection('Follows').add({
          uid: followedId,
          followerId: userId,
          following: true,
        })
        setFollowDocId(respos.id)
        setIsFollowing(true)
        setFollowLoading(false)
        getFriendsList()
      }
    } catch (error) {
      setFollowLoading(false)
      console.log('handleFollow error =>', error)
    }
  }

  const handleCheckFollow = async () => {
    try {
      setFollowLoading(true)
      const followedDoc = await firestore()
        .collection('Follows')
        .where('followerId', '==', userId)
        .where('uid', '==', data?.uid)
        .get()
      if (followedDoc?.docs[0]?.id) {
        setFollowDocId(followedDoc.docs[0].id)
        setIsFollowing(true)
      }
      setFollowLoading(false)
    } catch (error) {
      setFollowLoading(false)
      console.log('handleCheckFollow error =>', error)
    }
  }

  const handleGetUserInfo = async () => {
    try {
      setIsBlockLoading(true)
      const userDoc = await firestore().collection('User').doc(data?.uid).get()
      const blockDoc = await firestore().collection('Block').doc(userId).get()
      const blockedUsers = blockDoc?.data()?.blocked
      if (blockedUsers?.includes(data.uid)) {
        setUserInfo({ ...userDoc?.data(), isBlocked: true })
      } else {
        setUserInfo(userDoc?.data())
      }
      setIsBlockLoading(false)
    } catch (error) {
      console.log('handleGetUserInfo e=>', error)
      setIsBlockLoading(false)
    }
  }

  useEffect(() => {
    handleCheckFollow()
  }, [])
  useEffect(() => {
    if (!data?.email) {
      handleGetUserInfo()
    } else {
      setUserInfo(data)
    }
  }, [data?.uid])
  return {
    userInfo,
    followLoading,
    isFollowing,
    isBlockLoading,
    handleFollow,
    handleGetUserInfo,
  }
}

export { useFriend }
