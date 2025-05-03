import React, { useEffect, useState, useCallback  } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Button, 
  Platform,
  ActivityIndicator
} from 'react-native'
import { AnimatedTyping } from '../../components/general/AnimatedTyping'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  localSaveItem,
  StorageKeys,
} from '@utils'
import axios from 'axios'
import { CustomStockCircle, CustomAmount, CustomButton, Icon } from '@components'
import { NavigationService } from '@navigation'
import store, { useReduxDispatch, userActions, useUserSelector } from '@store'
import { GiftedChat, Send } from 'react-native-gifted-chat'
const YOUR_API_KEY = 'your-api-keyn' 

const ChatBot = () => {

  const CHATGPT_API_URL = 'https://api.openai.com/v1/engines/davinci-codex/completions'
  const USER = { _id: 1, name: 'User' } // Replace with your user's info
// Replace with your actual OpenAI API key

  const BOT_USER = { _id: 2, name: 'AI' }
const API_URL = 'https://api.openai.com/v1/engines/davinci-codex/completions'

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

   const onSend = useCallback((newMessages = []) => {
     setIsLoading(true) // Start loading
     setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
     const text = newMessages[0].text

     axios
       .post(
         CHATGPT_API_URL,
         {
           prompt: `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. AI: ${text}`,
           max_tokens: 150,
           temperature: 0.7,
           n: 1,
           stop: ['Human:', 'AI:'],
         },
         {
           headers: {
             'Content-Type': 'application/json',
             Authorization: `Bearer ${YOUR_API_KEY}`,
           },
         },
       )
       .then(response => {
         setIsLoading(false) // Stop loading
         const botMessage = {
           _id: Math.round(Math.random() * 1000000),
           text: response.data.choices[0].text.trim(),
           createdAt: new Date(),
           user: BOT_USER,
         }
         setMessages(previousMessages =>
           GiftedChat.append(previousMessages, [botMessage]),
         )
       })
       .catch(error => {
         setIsLoading(false) // Stop loading on error
         console.error(error)
       })
   }, [])

  return (
    <View style={{ flex: 1, backgroundColor: colors.darkBackground }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={USER}
        renderSend={props => (
          <Send {...props}>
            <View style={styles.sendButton}>
              <Icon
                type="AntDesign"
                name={'up'}
                size={actuatedNormalize(14)}
                style={{ marginRight: widthPercentageToDP(2) }}
                color={'black'}
              />
            </View>
          </Send>
        )}
        renderLoading={() =>
          isLoading && <ActivityIndicator size="large" color="#5BC0EB" />
        }
        renderChatFooter={() => (
          <Text style={{ textAlign: 'center' }}>Powered by ChatGPT</Text>
        )}
        placeholder="Type your message here..."
        alwaysShowSend
        scrollToBottom
        scrollToBottomComponent={() => (
          <Icon
            type="AntDesign"
            name={'up'}
            size={actuatedNormalize(14)}
            style={{ marginRight: widthPercentageToDP(2) }}
            color={'black'}
          />
        )}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  symbol: [
    textStyles.normalBold,
    {
      color: '#B9CC00',
      alignContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: actuatedNormalize(30),
    },
  ],
  overlay: {
    position: 'absolute',
    backgroundColor: colors.darkBackground,
    width: '100%',
    height: '100%',
    borderRadius: actuatedNormalize(100),
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: heightPercentageToDP(70),
  },
   chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatHeader: {
    height: 60,
    backgroundColor: '#5BC0EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeaderText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sendButton: {
    backgroundColor: '#5BC0EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    height: 50,
    width: 50,
  },
  sendIcon: {
    color: '#fff',
    fontSize: 24,
  },
})

export { ChatBot }
