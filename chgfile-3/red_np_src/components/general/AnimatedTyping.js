import React, { useRef, useState, useEffect } from 'react'
import { Text, StyleSheet } from 'react-native'
import { actuatedNormalize, colors, heightPercentageToDP, textStyles } from '@utils'

function AnimatedTyping(props) {

  const slowProp = props.slow
  const fastProp = props.fast
  const [text, setText] = useState('')
  const [cursorColor, setCursorColor] = useState('transparent')
  const [messageIndex, setMessageIndex] = useState(0)
  const [textIndex, setTextIndex] = useState(0)
  const [timeouts, setTimeouts] = useState({
    cursorTimeout: undefined,
    typingTimeout: undefined,
    firstNewLineTimeout: undefined,
    secondNewLineTimeout: undefined,
  })

  const textRef = useRef(text)
  
  textRef.current = text

  const cursorColorRef = useRef(cursorColor)
  cursorColorRef.current = cursorColor

  const messageIndexRef = useRef(messageIndex)
  messageIndexRef.current = messageIndex

  const textIndexRef = useRef(textIndex)
  textIndexRef.current = textIndex

  const timeoutsRef = useRef(timeouts)
  timeoutsRef.current = timeouts

  const typingAnimation = () => {
    if (textIndexRef.current < props.text[messageIndexRef.current].length) {
      setText(
        textRef.current +
        props.text[messageIndexRef.current].charAt(textIndexRef.current),
      )
      setTextIndex(textIndexRef.current + 1)

      const updatedTimeouts = { ...timeoutsRef.current }
      updatedTimeouts.typingTimeout = setTimeout(
        typingAnimation,
        slowProp ? 100 : fastProp ? 25 : 50,
      )
      setTimeouts(updatedTimeouts)
    } else if (messageIndexRef.current + 1 < props.text.length) {
      setMessageIndex(messageIndexRef.current + 1)
      setTextIndex(0)

      const updatedTimeouts = { ...timeoutsRef.current }
      updatedTimeouts.firstNewLineTimeout = setTimeout(
        newLineAnimation,
        slowProp ? 240 : fastProp ? 60 : 120,
      )
      updatedTimeouts.secondNewLineTimeout = setTimeout(
        newLineAnimation,
        slowProp ? 400 : fastProp ? 100 : 200,
      )
      updatedTimeouts.typingTimeout = setTimeout(
        typingAnimation,
        slowProp ? 480 : fastProp ? 140 : 280,
      )
      setTimeouts(updatedTimeouts)
    } else {
      clearInterval(timeoutsRef.current.cursorTimeout)
      setCursorColor('transparent')

      if (props.onComplete) {
        props.onComplete()
      }
    }
  }

  const newLineAnimation = () => {
    setText(textRef.current + '\n')
  }

  const cursorAnimation = () => {
    if (cursorColorRef.current === 'transparent') {
      setCursorColor('#8EA960')
    } else {
      setCursorColor('transparent')
    }
  }

  useEffect(() => {
    const updatedTimeouts = { ...timeoutsRef.current }
    updatedTimeouts.typingTimeout = setTimeout(
      typingAnimation,
      slowProp ? 1000 : fastProp ? 250:500,
    )
    updatedTimeouts.cursorTimeout = setInterval(
      cursorAnimation,
      slowProp ? 500 : fastProp ? 100 : 250,
    )
    setTimeouts(updatedTimeouts)

    return () => {
      clearTimeout(timeoutsRef.current.typingTimeout)
      clearTimeout(timeoutsRef.current.firstNewLineTimeout)
      clearTimeout(timeoutsRef.current.secondNewLineTimeout)
      clearInterval(timeoutsRef.current.cursorTimeout)
    }
  }, [])

  const boldProp = props.bold
  const fontSize = props.fontSize

  return (
    <Text
      style={
        boldProp === true
          ? [
            textStyles.normalBold,
            {
              color: 'white',
              fontSize: fontSize,
              marginBottom: heightPercentageToDP(2),
            },
          ]
          : [
            textStyles.normalRegular,
            {
              color: 'white',
              fontSize: fontSize,
            },
          ]
      }>
      {text}
      {!slowProp &&
        < Text
        style={[
        textStyles.normalRegular,
        {
          color: 'white',
          fontSize: fontSize,
        },
      ]}>
      |
    </Text>}
    </Text>
  )
}



export { AnimatedTyping }
