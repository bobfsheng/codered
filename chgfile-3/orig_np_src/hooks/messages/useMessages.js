import { useState, useEffect } from 'react'
import FirebaseChat from '@redkoteam/firebase-chat'
import { sendBetNotification } from '@utils'
import { useAuthSelector } from '@store'

const messagesLimit = 10

const useMessages = roomId => {
  const { userName } = useAuthSelector(state => state)
  const [_messages, _setMessages] = useState([])
  const messages = FirebaseChat.messages(roomId)
  const [isEndOfList, setIsEndOfList] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = messages.listenMessages({ limit: messagesLimit }, items => {
      _setMessages(items)
    })

    return () => unsubscribe()
  }, [])

  const sendMessage = async (text, friend) => {
    await messages.sendMessage(text)
    sendBetNotification(
      'New Message',
      `You have a new message from ${userName ?? 'Friend'}`,
      friend?.uid,
    )
  }

  const loadMore = async (limit = messagesLimit) => {
    const lastMessageDate = _messages[_messages.length - 1]?.date
    setLoading(true)
    if (!lastMessageDate || typeof lastMessageDate !== 'number') return
    const items =
      (await messages.getMessages({ startAfter: lastMessageDate, limit })) || []
    _setMessages(prev => [...prev, ...items])
    if (items.length === 0) setIsEndOfList(true)
    setLoading(false)
  }

  return {
    messages: _messages,
    sendMessage,
    loadMore,
    isEndOfList,
    loading,
  }
}

export { useMessages }
