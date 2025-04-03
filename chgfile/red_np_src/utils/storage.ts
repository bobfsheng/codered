import AsyncStorage from '@react-native-async-storage/async-storage'

const StorageKeys = {
  alpacaToken: 'alpacaToken',
  firstStart: 'firstStart',
  timeInMinutes: 'timeInMinutes',
  timerExitStatus: 'timerExitStatus',
  getNotifications: 'getNotifications',
  toolTipShown1: 'toolTipShown1',
  toolTipShown2: 'toolTipShown2',
  toolTipShown3: 'toolTipShown3',
  toolTipShown4: 'toolTipShown4',
  toolTipShown5: 'toolTipShown5',
  toolTipShown6: 'toolTipShown6',
  toolTipShown7: 'toolTipShown7',
  toolTipShown8: 'toolTipShown8',
  onboardingGameShown: 'onboardingGameShown',
  // quizLevel:'quizLevel'
}

async function localSaveItem(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value).then()
    return true
  } catch (error) {
    // console.log('Error saving data')
    return false
  }
}

async function localRemoveItem(key: string) {
  try {
    await AsyncStorage.removeItem(key)
    return true
  } catch (exception) {
    return false
  }
}
async function localRemoveAll() {
  try {
    await AsyncStorage.clear()
    return true
  } catch (exception) {
    return false
  }
}

async function localGetItem(key: string) {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      return value
    } else {
      return false
    }
  } catch (error) {
    // console.log(error)
    return false
  }
}

export { localGetItem, StorageKeys, localRemoveAll, localSaveItem, localRemoveItem }
