"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { AccountFunding } from "./account-funding"

export function WalletHeader() {
  const [showFunding, setShowFunding] = useState(false)

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">0G</span>
              </div>
              <span className="font-semibold text-foreground">AI Chat</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>0G Newton Testnet</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => setShowFunding(true)}>
              Fund Account
            </Button>
            <ConnectButton />
          </div>
        </div>
      </div>

      {showFunding && <AccountFunding onClose={() => setShowFunding(false)} />}
    </header>
  )
}
