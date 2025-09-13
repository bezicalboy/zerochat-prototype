"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Copy, Check } from "lucide-react"
import { use0GClient } from "@/hooks/use-0g-client"
import { useToast } from "@/hooks/use-toast"

interface AccountFundingProps {
  onClose: () => void
}

export function AccountFunding({ onClose }: AccountFundingProps) {
  const { addFunds, balance, getWebWalletAddress } = use0GClient()
  const { toast } = useToast()
  const [amount, setAmount] = useState("0.1")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const webWalletAddress = getWebWalletAddress()

  const handleFund = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const success = await addFunds(amount)
      if (success) {
        toast({
          title: "Funds Added Successfully",
          description: `Added ${amount} A0GI to your account`,
        })
        onClose()
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

  const copyAddress = async () => {
    if (webWalletAddress) {
      await navigator.clipboard.writeText(webWalletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Address Copied",
        description: "Web wallet address copied to clipboard",
      })
    }
  }

  const openFaucet = () => {
    window.open("https://faucet.0g.ai", "_blank")
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-playfair">Fund Your 0G Account</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Balance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Available:</span>
                  <span className="font-mono">{balance.available} A0GI</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Locked:</span>
                  <span className="font-mono">{balance.locked} A0GI</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Web Wallet Address */}
          {webWalletAddress && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Web Wallet Address</CardTitle>
                <CardDescription>Send A0GI tokens to this address to fund your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 text-xs bg-muted p-2 rounded font-mono break-all">{webWalletAddress}</code>
                  <Button size="sm" variant="outline" onClick={copyAddress} className="shrink-0 bg-transparent">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Fund Options */}
          <div className="space-y-4">
            <Label>Quick Fund Amount</Label>
            <div className="grid grid-cols-3 gap-2">
              {["0.1", "0.5", "1.0"].map((value) => (
                <Button
                  key={value}
                  variant={amount === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAmount(value)}
                >
                  {value} A0GI
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-amount">Custom Amount</Label>
              <Input
                id="custom-amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount in A0GI"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={handleFund} disabled={isLoading} className="w-full">
              {isLoading ? "Adding Funds..." : `Add ${amount} A0GI`}
            </Button>

            <Button variant="outline" onClick={openFaucet} className="w-full bg-transparent">
              <ExternalLink className="h-4 w-4 mr-2" />
              Get Test Tokens from Faucet
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">Estimated cost: ~1000 messages per 1 A0GI</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
