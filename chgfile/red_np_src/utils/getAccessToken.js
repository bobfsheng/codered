import auth from '@react-native-firebase/auth'
import { localGetItem, StorageKeys } from './storage'
const getAccessToken = async () => {
  const userId = await auth()?._user?.uid
  if (!userId) {
    return null
  }
  const token = await localGetItem(StorageKeys.alpacaToken)
  return token ? token : null
  // 'd674ec3c-077b-41c3-b712-3b17d997079d'
}

export { getAccessToken }
