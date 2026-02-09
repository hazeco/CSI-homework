import { useState, useEffect, useRef } from 'react'

function Chat() {
  const [clientId, setClientId] = useState(null)
  const [clientName, setClientName] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)

  const displayRef = useRef()
  const messageRef = useRef()
  const wsRef = useRef(null)

  // Initialize client name and connect to WebSocket
  useEffect(() => {
    messageRef.current?.focus()

    // Connect to WebSocket forwardServer
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.hostname}:3003`
    
    console.log(`[Connecting] to WebSocket:`, wsUrl)
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log(`[WebSocket] Connected to forwardServer`)
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      console.log(`[WebSocket] Received from server:`, event.data)
      try {
        const incomingMsg = JSON.parse(event.data)
        
        // Handle server-assigned client ID
        if (incomingMsg.type === 'CLIENT_ID_ASSIGNED') {
          console.log(`[ClientID] Assigned as ${incomingMsg.clientId}`)
          setClientId(incomingMsg.clientId)
          setClientName(incomingMsg.clientId)
          return
        }
        
        // Add all messages from server (single source of truth)
        setMessages((prevMessages) => [...prevMessages, incomingMsg])
      } catch (e) {
        console.error('Error parsing message:', e)
      }
    }

    ws.onerror = (error) => {
      console.error(`[WebSocket] error:`, error)
      setIsConnected(false)
    }

    ws.onclose = () => {
      console.log(`[WebSocket] disconnected from forwardServer`)
      setIsConnected(false)
    }

    wsRef.current = ws

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  // Auto scroll to bottom
  useEffect(() => {
    displayRef.current?.scrollTo(0, displayRef.current.scrollHeight)
  }, [messages])

  // Send connection message when clientId is assigned
  useEffect(() => {
    if (clientId && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const connectionMsg = {
        id: `${clientId}-${Date.now()}`,
        clientId: clientId,
        name: clientId,
        message: `${clientId} joined the chat`,
        timestamp: new Date().toISOString(),
        isSystemMessage: true,
      }
      wsRef.current.send(JSON.stringify(connectionMsg))
      console.log(`[${clientId}] Connection message sent`)
    }
  }, [clientId])

  const sendClick = () => {
    if (!clientId || message.trim() === '') return

    const newMessage = {
      id: `${clientId}-${Date.now()}`,
      clientId: clientId,
      name: clientName,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      isSystemMessage: false,
    }

    // Send message to WebSocket server
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(newMessage))
      console.log(`[${clientId}] Message sent to server:`, newMessage)
    } else {
      console.warn('WebSocket is not connected')
    }

    setMessage('')
    messageRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendClick()
    }
  }

  return (
    <div className="flex flex-col w-full h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="text-2xl flex-shrink-0">💬</div>
          <div className="min-w-0">
            <h1 className="font-bold text-base truncate">Direct Messages</h1>
            <p className="text-xs text-gray-500 truncate">{clientId || 'Connecting...'}</p>
          </div>
        </div>
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </div>

      {/* Messages Display */}
      <div 
        ref={displayRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-white"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">👋</div>
              <p>No messages yet</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.clientId === clientId
            return (
              <div key={msg.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-xs px-4 py-2 rounded-full text-sm break-words ${
                    isOwnMessage 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {msg.isSystemMessage && (
                    <p className="text-xs text-gray-600 italic text-center">{msg.message}</p>
                  )}
                  {!msg.isSystemMessage && (
                    <>
                      <p className="text-xs font-semibold mb-1 opacity-70">{msg.name}</p>
                      <p>{msg.message}</p>
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 sticky bottom-0 shrink-0">
        <div className="flex items-end gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={messageRef}
            className="flex-1 bg-gray-100 text-black rounded-full px-4 py-2 outline-none focus:bg-gray-200 text-sm min-h-10"
          />
          <button
            onClick={sendClick}
            disabled={!isConnected || message.trim() === ''}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full p-2 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16412026 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99701575 L3.03521743,10.4380088 C3.03521743,10.5951061 3.19218622,10.7521035 3.50612381,10.7521035 L16.6915026,11.5375905 C16.6915026,11.5375905 17.1624089,11.5375905 17.1624089,12.0088827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
