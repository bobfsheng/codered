import { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'

const useUpdateApp = () => {
  const newUpdateAvailable = 2
  // const [showUpdateModal, setShowUpdateModal] = useState(false)
  const checkForUpdate = async () => {
    try {
      const appVersion = await firestore()
        .collection('appUpdate')
        .doc('5tUEF0bGJPgx2hlYsgS7')
        .get()
      // if (appVersion.data().version >= newUpdateAvailable) {
      //   setTimeout(() => {
      //     setShowUpdateModal(true)
      //   }, 2500)
      // }
    } catch (error) {
      console.log('update error=>', error)
    }
  }
  useEffect(() => {
    checkForUpdate()
  }, [])
  // return { showUpdateModal, setShowUpdateModal }
}

export { useUpdateApp }
