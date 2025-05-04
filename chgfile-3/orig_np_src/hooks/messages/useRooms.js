import FirebaseChat from '@redkoteam/firebase-chat'
import { useEffect, useState } from 'react'

const useRooms = currentUserId => {
  const [_rooms, _setRooms] = useState([])
  const rooms = FirebaseChat.rooms()
  const createNewRoom = async otherUserId => {
    await rooms.createRoom(otherUserId)
  }
  useEffect(() => {
    const unsubscribe = rooms.listenRooms(items => {
      if (items.length === 0) {
        if (_rooms.length === 0) return
        else return _setRooms([])
      }
      const data = items.map(item => {
        const otherUserId =
          String(item.user1Id) === String(currentUserId) ? item.user2Id : item.user1Id
        item.otherUserId = otherUserId
        return item
      })
      _setRooms(data)
    })

    return () => unsubscribe()
  }, [])

  const getRoomId = async otherUserId => {
    const room = await rooms.getRoom(otherUserId, { createIfNotExists: true })
    return room.id
  }

  return {
    rooms: _rooms,
    getRoomId,
    createNewRoom,
  }
}

export { useRooms }
