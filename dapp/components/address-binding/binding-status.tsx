'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Shield, 
  RefreshCw,
  Link,
  Unlink,
  AlertTriangle
} from 'lucide-react'
import { AddressBindingFlow } from '@/lib/webauthn-client'

interface BindingStatusProps {
  walletAddress?: string
  onStartBinding?: () => void
  onRevokeBinding?: () => void
}

type BindingState = 'none' | 'pending' | 'verified' | 'revoked' | 'loading' | 'error'

export function BindingStatus({ walletAddress, onStartBinding, onRevokeBinding }: BindingStatusProps) {
  const [status, setStatus] = useState<BindingState>('loading')
  const [credentialInfo, setCredentialInfo] = useState<{
    createdAt: number
    credentialId: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const checkBindingStatus = async () => {
    if (!walletAddress) {
      setStatus('none')
      return
    }

    setIsRefreshing(true)
    try {
      const bindingFlow = new AddressBindingFlow()
      const result = await bindingFlow.checkStatus(walletAddress)
      
      setStatus(result.status)
      if (result.credential) {
        setCredentialInfo({
          createdAt: result.credential.createdAt,
          credentialId: result.credential.credentialId,
        })
      }
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to check binding status')
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    checkBindingStatus()
  }, [walletAddress])

  const handleRevoke = async () => {
    if (!walletAddress || status !== 'verified') return

    try {
      const bindingFlow = new AddressBindingFlow()
      await bindingFlow.revokeBinding(walletAddress)
      setStatus('revoked')
      setCredentialInfo(null)
      if (onRevokeBinding) {
        onRevokeBinding()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke binding')
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'revoked':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Shield className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'revoked':
        return <Badge className="bg-red-100 text-red-800">Revoked</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'loading':
        return <Badge variant="secondary">Loading...</Badge>
      default:
        return <Badge variant="outline">Not Bound</Badge>
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const truncateCredentialId = (id: string) => {
    if (id.length <= 20) return id
    return `${id.slice(0, 8)}...${id.slice(-8)}`
  }

  if (!walletAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Address Binding
          </CardTitle>
          <CardDescription>
            Connect your wallet to view binding status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Please connect your wallet to check address binding status.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              Address Binding
            </CardTitle>
            {getStatusBadge()}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={checkBindingStatus}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>
          Secure binding between your address and DAO account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Address */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Connected Address</p>
          <div className="p-3 bg-muted rounded-lg font-mono text-xs break-all">
            {walletAddress}
          </div>
        </div>

        {/* Status Details */}
        {status === 'verified' && credentialInfo && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Binding Details</p>
            <div className="p-3 bg-muted rounded-lg space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Credential ID:</span>
                <span className="font-mono">
                  {truncateCredentialId(credentialInfo.credentialId)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created:</span>
                <span>{formatDate(credentialInfo.createdAt)}</span>
              </div>
            </div>
          </div>
        )}

        {status === 'pending' && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Your address binding is pending on-chain confirmation. This usually takes 1-2 minutes.
            </AlertDescription>
          </Alert>
        )}

        {status === 'none' && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              This address is not bound to your DAO account. Bind it to enable wallet-free governance actions.
            </AlertDescription>
          </Alert>
        )}

        {status === 'revoked' && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              This address binding has been revoked. You can create a new binding if needed.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {(status === 'none' || status === 'revoked') && (
            <Button 
              onClick={onStartBinding}
              className="flex-1"
            >
              <Link className="mr-2 h-4 w-4" />
              Bind Address
            </Button>
          )}

          {status === 'verified' && (
            <Button 
              variant="destructive"
              onClick={handleRevoke}
              className="flex-1"
            >
              <Unlink className="mr-2 h-4 w-4" />
              Revoke Binding
            </Button>
          )}

          {status === 'pending' && (
            <Button 
              variant="secondary"
              disabled
              className="flex-1"
            >
              <Clock className="mr-2 h-4 w-4" />
              Confirming...
            </Button>
          )}
        </div>

        {/* Info Text */}
        <div className="text-xs text-muted-foreground">
          {status === 'verified' && (
            <p>✓ You can now submit proposals and vote without connecting your wallet each time.</p>
          )}
          {status === 'none' && (
            <p>ℹ️ Binding your address enables seamless governance participation.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}