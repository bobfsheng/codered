import axios from 'axios'
import { validationServer } from '@hooks'

const sendBetNotification = async (title, body, receiverUserId) => {
  try {
    await axios.post(`${validationServer}/bet/sendNotification`, {
      title,
      body,
      receiverUserId,
    })
  } catch (error) {
    console.log('error sendBetNotification=>', error)
  }
}

export { sendBetNotification }
