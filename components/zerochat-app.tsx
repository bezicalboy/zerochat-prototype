"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

interface Message {
  id: number
  sender: "user" | "ai"
  content: string
  timestamp: Date
  model?: string
  verified?: boolean
}

interface AIModel {
  name: string
  id: string
  provider: string
  description: string
  verifiability: string
  inputPrice: string
  outputPrice: string
}

const models: AIModel[] = [
  {
    name: "Llama 3.3 70B Instruct",
    id: "llama-3.3-70b-instruct",
    provider: "0xf07240Efa67755B5311bc75784a061eDB47165Dd",
    description: "State-of-the-art 70B parameter model for general AI tasks",
    verifiability: "TEE (TeeML)",
    inputPrice: "0.000001",
    outputPrice: "0.000002",
  },
  {
    name: "DeepSeek R1 70B",
    id: "deepseek-r1-70b",
    provider: "0x3feE5a4dd5FDb8a32dDA97Bed899830605dBD9D3",
    description: "Advanced reasoning model optimized for complex problem solving",
    verifiability: "TEE (TeeML)",
    inputPrice: "0.000001",
    outputPrice: "0.000002",
  },
]

const generateFakeResponse = (input: string): string => {
  const responses = [
    "0G is a modular AI-first blockchain that combines scalable execution with multi-consensus validation for high-performance AI applications. It features three main components: 0G Chain (EVM-compatible Layer 1), 0G Storage (decentralized storage network), and 0G DA (data availability layer).",
    "The 0G Compute Network enables developers to build censorship-resistant and verifiable AI applications with on-chain inference capabilities. It uses TEE (Trusted Execution Environment) technology to ensure computation integrity.",
    "0G's architecture is designed for AI workloads with features like parallel processing, efficient data availability, and seamless integration with existing blockchain infrastructure.",
    "The network supports various AI models including large language models, computer vision models, and specialized AI applications through its decentralized compute infrastructure.",
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

export function ZeroChatApp() {
  const [wallet, setWallet] = useState<{ address: string; balance: string } | null>(null)

  useEffect(() => {
    // Generate fake wallet address and balance
    const fakeAddress = "0x" + Math.random().toString(16).substr(2, 40)
    const fakeBalance = (Math.random() * 10 + 1).toFixed(4)
    setWallet({ address: fakeAddress, balance: fakeBalance })
  }, [])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "user",
      content: "What is 0G and how does it work?",
      timestamp: new Date("2025-09-13T12:15:00Z"),
    },
    {
      id: 2,
      sender: "ai",
      content:
        "0G is a modular AI-first blockchain that combines scalable execution with multi-consensus validation for high-performance AI applications. It features three main components: 0G Chain (EVM-compatible Layer 1), 0G Storage (decentralized storage network), and 0G DA (data availability layer). The platform enables developers to build censorship-resistant and verifiable AI applications with on-chain inference capabilities.",
      timestamp: new Date("2025-09-13T12:15:03Z"),
      model: "llama-3.3-70b-instruct",
      verified: true,
    },
  ])

  const [currentModel, setCurrentModel] = useState<AIModel>(models[0])
  const [messageInput, setMessageInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [messageIdCounter, setMessageIdCounter] = useState(3)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleSendMessage = async () => {
    if (isProcessing || !messageInput.trim() || !wallet) return

    const content = messageInput.trim()
    setIsProcessing(true)

    // Add user message
    const userMessage: Message = {
      id: messageIdCounter,
      sender: "user",
      content: content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setMessageIdCounter((prev) => prev + 1)
    setMessageInput("")

    // Simulate AI processing delay
    setTimeout(
      () => {
        const aiResponse = generateFakeResponse(content)

        const aiMessage: Message = {
          id: messageIdCounter + 1,
          sender: "ai",
          content: aiResponse,
          timestamp: new Date(),
          model: currentModel.id,
          verified: true,
        }

        setMessages((prev) => [...prev, aiMessage])
        setMessageIdCounter((prev) => prev + 2)
        setIsProcessing(false)
      },
      1500 + Math.random() * 1000,
    ) // Random delay between 1.5-2.5 seconds
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const estimatedCost = () => {
    const inputLength = messageInput.length
    const estimatedTokens = Math.max(10, Math.ceil(inputLength / 4))
    const inputCost = estimatedTokens * Number.parseFloat(currentModel.inputPrice)
    const outputCost = 50 * Number.parseFloat(currentModel.outputPrice)
    const totalCost = inputCost + outputCost
    return totalCost.toFixed(6)
  }

  const clearChat = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      setMessages([])
    }
  }

  const exportChat = () => {
    const chatData = {
      timestamp: new Date().toISOString(),
      model: currentModel.name,
      account: wallet?.address || "Not connected",
      messages: messages.map((msg) => ({
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        model: msg.model || null,
        verified: msg.verified || false,
      })),
    }

    const dataStr = JSON.stringify(chatData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(dataBlob)
    link.download = `zerochat-history-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAddFunds = () => {
    if (!wallet) return

    const currentBalance = Number.parseFloat(wallet.balance)
    const newBalance = (currentBalance + 0.1).toFixed(4)
    setWallet((prev) => (prev ? { ...prev, balance: newBalance } : null))
  }

  if (!wallet) {
    return (
      <div className="app">
        <div className="flex items-center justify-center flex-1 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Loading Wallet...</h2>
            <p className="text-gray-600">Setting up your demo wallet</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header__brand">
          <h1 className="brand-title">ZeroChat</h1>
          <span className="brand-subtitle">0G Compute Network</span>
        </div>

        <div className="header__controls">
          <div className="network-status">
            <span className="status-indicator status--success"></span>
            <span className="network-text">Connected</span>
          </div>

          <div className="account-info">
            <span className="account-balance">{wallet.balance} OG</span>
            <div className="wallet-display">
              <span className="wallet-address">{truncateAddress(wallet.address)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3>Account</h3>
            <div className="account-details">
              <div className="account-item">
                <label>Address</label>
                <span className="account-address">{truncateAddress(wallet.address)}</span>
              </div>
              <div className="account-item">
                <label>Balance</label>
                <span className="balance-amount">{wallet.balance} OG</span>
              </div>
              <div className="account-item">
                <label>Locked</label>
                <span className="locked-amount">0.0000 OG</span>
              </div>
            </div>
            <button className="btn btn--primary btn--full-width" onClick={handleAddFunds} style={{ marginTop: "1rem" }}>
              Add 0.1 OG Funds
            </button>
          </div>

          <div className="sidebar-section">
            <h3>AI Model</h3>
            <select
              className="form-control model-selector"
              value={currentModel.id}
              onChange={(e) => {
                const model = models.find((m) => m.id === e.target.value)
                if (model) setCurrentModel(model)
              }}
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>

            <div className="model-details">
              <div className="model-info">
                <p className="model-description">{currentModel.description}</p>
                <div className="model-specs">
                  <div className="spec-item">
                    <span className="spec-label">Provider:</span>
                    <span className="spec-value">{truncateAddress(currentModel.provider)}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Verifiability:</span>
                    <span className="spec-value">{currentModel.verifiability}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Input Price:</span>
                    <span className="spec-value">{currentModel.inputPrice} OG</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Output Price:</span>
                    <span className="spec-value">{currentModel.outputPrice} OG</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Actions</h3>
            <button className="btn btn--secondary btn--full-width clear-chat-btn" onClick={clearChat}>
              Clear Chat
            </button>
            <button className="btn btn--outline btn--full-width export-chat-btn" onClick={exportChat}>
              Export History
            </button>
          </div>
        </aside>

        {/* Chat Area */}
        <main className="chat-container">
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message message--${message.sender}`}>
                <div className="message__content">{message.content}</div>
                <div className="message__meta">
                  <span className="message__time">{formatTime(message.timestamp)}</span>
                  {message.sender === "ai" && (
                    <>
                      <span className="message__model">
                        {models.find((m) => m.id === message.model)?.name.split(" ")[0]}{" "}
                        {models.find((m) => m.id === message.model)?.name.split(" ")[1]}
                      </span>
                      {message.verified && <span className="status status--success">Verified</span>}
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Loading indicator */}
          {isProcessing && (
            <div className="loading-indicator">
              <div className="loading-message">
                <span className="loading-dots"></span>
                <span>AI is thinking...</span>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="chat-input-container">
            <div className="chat-input">
              <textarea
                className="form-control message-input"
                placeholder="Type your message here..."
                rows={2}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
              />
              <button
                className="btn btn--primary send-btn"
                onClick={handleSendMessage}
                disabled={isProcessing || !messageInput.trim()}
              >
                <span>Send</span>
              </button>
            </div>
            <div className="input-stats">
              <span className="estimated-cost">Est. cost: ~{estimatedCost()} OG</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
