'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Wallet, ChevronDown, LogOut, Copy, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ccc } from '@ckb-ccc/connector-react'
import { useToast } from '@/hooks/use-toast'

export function WalletConnectButton() {
  const signer = ccc.useSigner()
  const { open, disconnect } = ccc.useCcc()
  const [address, setAddress] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (signer) {
      // Get the internal address when signer is available
      signer.getInternalAddress().then((addr) => {
        setAddress(addr)
      }).catch(console.error)
    } else {
      setAddress('')
    }
  }, [signer])

  const handleConnect = async () => {
    try {
      await open()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect wallet. Please try again.',
      })
    }
  }

  const handleDisconnect = async () => {
    await disconnect()
    setAddress('')
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected.',
    })
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: 'Address Copied',
        description: 'Wallet address copied to clipboard.',
      })
    }
  }

  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`
  }

  if (!signer || !address) {
    return (
      <Button onClick={handleConnect} variant="default">
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Wallet className="mr-2 h-4 w-4" />
          {formatAddress(address)}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">Connected Wallet</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatAddress(address)}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress}>
          {copied ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? 'Copied!' : 'Copy Address'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDisconnect} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}