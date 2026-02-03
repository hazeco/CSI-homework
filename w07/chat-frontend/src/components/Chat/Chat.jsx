import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import './Chat.css'

const defaultName = 'สมชาย'
const defaultMessage = 'พิมพ์อะไรต่อดี...'
const dummyMessages = [
  { id: 1, name: 'สมชาย', message: `สวัสดี เราสมชายนะ` },
  { id: 2, name: 'Alice', message: `Hi, I'm Alice` },
  { id: 3, name: 'Zoe', message: `How are you, today?` },
  { id: 4, name: 'สมชาย', message: `ฝุ่นเยอะม๊าก แต่ยังรอดชีวิตอยู่` },
  { id: 5, name: 'Zoe', message: `How about front-end and back-end?` },
  { id: 6, name: 'Alice', message: `I like both ^_^` },
  { id: 7, name: 'สมชาย', message: `เราไม่ชอบทั้งคู่เลยอะ... 555` },
]

useEffect(() => {
  // Example of using axios to fetch initial data
  axios.get('/api/initial-messages')
    .then(response => {
      console.log('Initial messages fetched:', response.data);
    })
    .catch(error => {
      console.error('Error fetching initial messages:', error);
    });
}, []);

function Chat() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const displayRef = useRef()
  const messageRef = useRef()

  useEffect(() => {
    setName(defaultName)
    setMessage(defaultMessage)
    setMessages(dummyMessages)
    messageRef.current.focus()
  }, [])

  useEffect(() => {
    displayRef.current.scrollTop = displayRef.current.scrollHeight
  }, [messages])

  const sendClick = () => {
    if (name.trim() === '') return console.error('Error: empty name')
    if (message.trim() === '') return console.error('Error: empty message')
    const newMessage = {
      id: messages.reduce((max, msg) => Math.max(max, msg.id), 0) + 1,
      name: name.trim(),
      message: message.trim(),
    }
    setMessages([...messages, newMessage])
    setMessage('')
    messageRef.current.focus()
  }

  const nameMatch = { color: 'blue' }

  return (
    <div className='chat-container'>
      {/* Header */}
      <h2>
        <big>&#128563;</big>&nbsp;SELF CHATTING&nbsp;<big>&#128563;</big>
      </h2>

      {/* History */}
      <div className='chat-display' ref={displayRef}>
        {messages.map((msg) => (
          <div key={msg.id}>
            <b style={msg.name === name.trim() ? nameMatch : {}}>{msg.name}</b>
            :&nbsp;
            <span style={msg.name === name.trim() ? nameMatch : {}}>
              {msg.message}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className='chat-input'>
        <input
          className='name'
          placeholder='Your name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendClick(e)}
        ></input>
        <input
          className='message'
          placeholder='Your message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendClick(e)}
          ref={messageRef}
        ></input>
        <button className='send' onClick={() => sendClick()}>
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat
