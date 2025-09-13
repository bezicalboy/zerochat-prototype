"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wallet,
  TrendingUp,
  Clock,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"
import { use0GClient } from "@/hooks/use-0g-client"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  type: "deposit" | "usage"
  amount: string
  timestamp: number
  status: "pending" | "completed" | "failed"
  description: string
}

export function FundingDashboard() {
  const { balance, addFunds, updateBalance, getWebWalletAddress } = use0GClient()
  const { toast } = useToast()
  const [amount, setAmount] = useState("0.1")
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const webWalletAddress = getWebWalletAddress()

  // Mock transaction history (in a real app, this would come from the 0G network)
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        type: "deposit",
        amount: "1.0",
        timestamp: Date.now() - 3600000,
        status: "completed",
        description: "Manual deposit",
      },
      {
        id: "2",
        type: "usage",
        amount: "0.001",
        timestamp: Date.now() - 1800000,
        status: "completed",
        description: "AI chat with llama-3.3-70b-instruct",
      },
      {
        id: "3",
        type: "usage",
        amount: "0.0015",
        timestamp: Date.now() - 900000,
        status: "completed",
        description: "AI chat with deepseek-r1-70b",
      },
    ]
    setTransactions(mockTransactions)
  }, [])

  const handleQuickFund = async (quickAmount: string) => {
    setAmount(quickAmount)
    await handleFund(quickAmount)
  }

  const handleFund = async (fundAmount?: string) => {
    const amountToFund = fundAmount || amount

    if (!amountToFund || Number.parseFloat(amountToFund) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const success = await addFunds(amountToFund)
      if (success) {
        toast({
          title: "Funds Added Successfully",
          description: `Added ${amountToFund} A0GI to your account`,
        })

        // Add transaction to history
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          type: "deposit",
          amount: amountToFund,
          timestamp: Date.now(),
          status: "completed",
          description: "Manual deposit",
        }
        setTransactions((prev) => [newTransaction, ...prev])

        setAmount("0.1")
      } else {
        toast({
          title: "Failed to Add Funds",
          description: "Please check your balance and try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add funds. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await updateBalance()
      toast({
        title: "Balance Updated",
        description: "Account balance refreshed successfully",
      })
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to update balance",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const openFaucet = () => {
    window.open("https://faucet.0g.ai", "_blank")
  }

  const openExplorer = () => {
    if (webWalletAddress) {
      window.open(`https://chainscan-newton.0g.ai/address/${webWalletAddress}`, "_blank")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getTransactionIcon = (type: string) => {
    return type === "deposit" ? (
      <ArrowDownLeft className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowUpRight className="h-4 w-4 text-blue-500" />
    )
  }

  // Calculate usage statistics
  const totalDeposits = transactions
    .filter((t) => t.type === "deposit" && t.status === "completed")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)

  const totalUsage = transactions
    .filter((t) => t.type === "usage" && t.status === "completed")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)

  const usagePercentage = totalDeposits > 0 ? (totalUsage / totalDeposits) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{balance.available} A0GI</div>
            <p className="text-xs text-muted-foreground">Ready for AI conversations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{totalUsage.toFixed(4)} A0GI</div>
            <p className="text-xs text-muted-foreground">Across all conversations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage Rate</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usagePercentage.toFixed(1)}%</div>
            <Progress value={usagePercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Funding Interface */}
      <Tabs defaultValue="fund" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fund">Fund Account</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="fund" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Funds to Your Account</CardTitle>
              <CardDescription>Add A0GI tokens to your prepaid account for AI conversations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Fund Options */}
              <div className="space-y-3">
                <Label>Quick Fund Options</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { amount: "0.1", messages: "~100" },
                    { amount: "0.5", messages: "~500" },
                    { amount: "1.0", messages: "~1000" },
                    { amount: "5.0", messages: "~5000" },
                  ].map((option) => (
                    <Button
                      key={option.amount}
                      variant={amount === option.amount ? "default" : "outline"}
                      className="h-auto p-3 flex flex-col"
                      onClick={() => handleQuickFund(option.amount)}
                      disabled={isLoading}
                    >
                      <span className="font-semibold">{option.amount} A0GI</span>
                      <span className="text-xs opacity-70">{option.messages} msgs</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="space-y-3">
                <Label htmlFor="custom-amount">Custom Amount</Label>
                <div className="flex space-x-2">
                  <Input
                    id="custom-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount in A0GI"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleFund()}
                    disabled={isLoading || !amount || Number.parseFloat(amount) <= 0}
                    className="px-8"
                  >
                    {isLoading ? "Adding..." : "Add Funds"}
                  </Button>
                </div>
              </div>

              {/* External Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={openFaucet} className="flex-1 bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get Test Tokens
                </Button>
                <Button variant="outline" onClick={openExplorer} className="flex-1 bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
              </div>

              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                <strong>Note:</strong> Send A0GI tokens directly to your web wallet address to fund your account. The
                balance will update automatically once the transaction is confirmed on the 0G network.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent deposits and usage on your account</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-mono ${
                            transaction.type === "deposit" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.type === "deposit" ? "+" : "-"}
                          {transaction.amount} A0GI
                        </span>
                        {getStatusIcon(transaction.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
