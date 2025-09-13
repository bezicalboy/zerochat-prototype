"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Loader2, Trash2, Zap } from "lucide-react"
import { use0GClient } from "@/hooks/use-0g-client"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useToast } from "@/hooks/use-toast"

export function ChatInterface() {
  const { isConnected } = useAccount()
  const {
    isInitialized,
    messages,
    isLoading,
    selectedModel,
    setSelectedModel,
    sendMessage,
    clearMessages,
    balance,
    availableModels,
  } = use0GClient()
  const { toast } = useToast()
  const [input, setInput] = useState("")

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput("")

    try {
      await sendMessage(message)
    } catch (error) {
      toast({
        title: "Message Failed",
        description: "Failed to send message. Please check your balance and try again.",
        variant: "destructive",
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isConnected) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
            <p className="text-muted-foreground">
              Connect your wallet to start chatting with AI models on the 0G network
            </p>
          </div>
          <ConnectButton />
        </CardContent>
      </Card>
    )
  }

  if (!isInitialized) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Initializing 0G Client</h3>
            <p className="text-muted-foreground">Setting up your connection to the 0G network...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Model Selection and Balance */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">AI Model & Account</CardTitle>
            <Badge variant="outline" className="font-mono">
              {balance.available} A0GI
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select AI Model</label>
              <Select
                value={selectedModel.name}
                onValueChange={(value) => {
                  const model = availableModels.find((m) => m.name === value)
                  if (model) setSelectedModel(model)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model.name} value={model.name}>
                      <div className="flex items-center justify-between w-full">
                        <span>{model.name}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {model.costPerRequest} A0GI
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Model Info</label>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{selectedModel.description}</p>
                <div className="flex items-center space-x-2">
                  <Zap className="h-3 w-3" />
                  <span>Verification: {selectedModel.verifiability}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Chat with {selectedModel.name}</CardTitle>
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearMessages}
                className="text-destructive hover:text-destructive bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Start a Conversation</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    Ask me anything! I'm powered by the {selectedModel.name} model running on the 0G decentralized
                    network.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 ${
                      message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`flex-1 space-y-1 ${message.role === "user" ? "text-right" : ""}`}>
                      <div
                        className={`inline-block max-w-[80%] p-3 rounded-lg text-sm ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="inline-block bg-muted p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Cost per message: {selectedModel.costPerRequest} A0GI</span>
              <span>Press Enter to send</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
