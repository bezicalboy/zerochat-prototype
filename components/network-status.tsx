"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Globe, Server, Zap, ExternalLink, RefreshCw } from "lucide-react"
import { zgClient, AVAILABLE_MODELS } from "@/lib/0g-client"
import { useToast } from "@/hooks/use-toast"

interface NetworkStats {
  blockHeight: number
  networkLatency: number
  activeProviders: number
  totalRequests: number
  isConnected: boolean
}

export function NetworkStatus() {
  const { toast } = useToast()
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    blockHeight: 0,
    networkLatency: 0,
    activeProviders: 0,
    totalRequests: 0,
    isConnected: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [services, setServices] = useState<any[]>([])

  // Mock network stats (in a real app, this would come from the 0G network)
  const updateNetworkStats = async () => {
    setIsLoading(true)
    try {
      // Simulate network call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data - in production, fetch from 0G network APIs
      setNetworkStats({
        blockHeight: Math.floor(Math.random() * 1000000) + 5000000,
        networkLatency: Math.floor(Math.random() * 100) + 50,
        activeProviders: AVAILABLE_MODELS.length,
        totalRequests: Math.floor(Math.random() * 10000) + 50000,
        isConnected: zgClient.isInitialized(),
      })

      // Try to get real services if client is initialized
      if (zgClient.isInitialized()) {
        try {
          const serviceList = await zgClient.listServices()
          setServices(serviceList.slice(0, 5)) // Show first 5 services
        } catch (error) {
          console.error("Failed to fetch services:", error)
        }
      }

      toast({
        title: "Network Status Updated",
        description: "Successfully refreshed 0G network information",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to refresh network status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    updateNetworkStats()
    // Update every 30 seconds
    const interval = setInterval(updateNetworkStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const openExplorer = () => {
    window.open("https://chainscan-newton.0g.ai", "_blank")
  }

  const openDocs = () => {
    window.open("https://docs.0g.ai", "_blank")
  }

  return (
    <div className="space-y-6">
      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Status</CardTitle>
            <div className={`w-2 h-2 rounded-full ${networkStats.isConnected ? "bg-green-500" : "bg-red-500"}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkStats.isConnected ? "Connected" : "Disconnected"}</div>
            <p className="text-xs text-muted-foreground">0G Newton Testnet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Block Height</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{networkStats.blockHeight.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Latest block</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Latency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkStats.networkLatency}ms</div>
            <p className="text-xs text-muted-foreground">Average response time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkStats.activeProviders}</div>
            <p className="text-xs text-muted-foreground">AI service providers</p>
          </CardContent>
        </Card>
      </div>

      {/* Available AI Models */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Available AI Models</CardTitle>
            <CardDescription>AI models currently available on the 0G network</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={updateNetworkStats} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {AVAILABLE_MODELS.map((model, index) => (
              <div key={model.address} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold">{model.name}</h4>
                    <Badge variant="secondary">{model.verifiability}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{model.address}</code>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-semibold">{model.costPerRequest} A0GI</div>
                  <div className="text-xs text-muted-foreground">per request</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Information */}
      <Card>
        <CardHeader>
          <CardTitle>0G Network Information</CardTitle>
          <CardDescription>Learn more about the 0G decentralized AI network</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Network Details
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Chain ID:</span>
                  <code className="font-mono">16600</code>
                </div>
                <div className="flex justify-between">
                  <span>RPC URL:</span>
                  <code className="font-mono text-xs">https://evmrpc-testnet.0g.ai</code>
                </div>
                <div className="flex justify-between">
                  <span>Currency:</span>
                  <span>A0GI</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center">
                <Server className="h-4 w-4 mr-2" />
                AI Compute Stats
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Total Requests:</span>
                  <span className="font-mono">{networkStats.totalRequests.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Models:</span>
                  <span>{AVAILABLE_MODELS.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verification:</span>
                  <Badge variant="outline" className="text-xs">
                    TeeML
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button variant="outline" onClick={openExplorer} className="flex-1 bg-transparent">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Explorer
            </Button>
            <Button variant="outline" onClick={openDocs} className="flex-1 bg-transparent">
              <ExternalLink className="h-4 w-4 mr-2" />
              Read Documentation
            </Button>
          </div>

          <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
            <strong>About 0G Network:</strong> 0G is a decentralized AI network that provides scalable, verifiable, and
            cost-effective AI inference services. All computations are verified using Trusted Execution Environments
            (TEE) to ensure reliability and security.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
