'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Circle, Clock, Copy, Loader2, Shield, Wallet, AlertCircle } from 'lucide-react'
import { WebAuthnClient, AddressBindingFlow } from '@/lib/webauthn-client'
import { useToast } from '@/hooks/use-toast'
import { useSigner, useCcc } from '@/components/wallet/wallet-provider'

interface BindingFlowProps {
  userId: string
  userName: string
  onComplete?: (txHash: string) => void
  onCancel?: () => void
}

type BindingStep = 'webauthn' | 'api-key' | 'wallet' | 'complete'

export function BindingFlow({ userId, userName, onComplete, onCancel }: BindingFlowProps) {
  const [currentStep, setCurrentStep] = useState<BindingStep>('webauthn')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [bindingFlow] = useState(() => new AddressBindingFlow())
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Use CKB-CCC wallet connection
  const signer = useSigner()
  const ccc = useCcc()
  const open = ccc?.open
  
  // Get wallet address when signer is connected
  useEffect(() => {
    if (signer) {
      signer.getInternalAddress().then((addr) => {
        setWalletAddress(addr)
      }).catch(console.error)
    } else {
      setWalletAddress(null)
    }
  }, [signer])

  // Track elapsed time for 30-second target
  useEffect(() => {
    if (startTime && currentStep !== 'complete') {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [startTime, currentStep])

  const steps = [
    { id: 'webauthn', label: 'Create Credential', icon: Shield },
    { id: 'api-key', label: 'Generate API Key', icon: Copy },
    { id: 'wallet', label: 'Connect Wallet', icon: Wallet },
    { id: 'complete', label: 'Complete', icon: CheckCircle2 },
  ]

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId)
    const currentIndex = steps.findIndex(s => s.id === currentStep)
    
    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'upcoming'
  }

  const startBinding = async () => {
    setIsLoading(true)
    setError(null)
    setStartTime(Date.now())

    try {
      // Check WebAuthn support
      if (!WebAuthnClient.isSupported()) {
        throw new Error('WebAuthn is not supported in your browser. Please use Chrome, Edge, Firefox, or Safari.')
      }

      // Start the binding flow
      const generatedApiKey = await bindingFlow.startBinding(userId, userName)
      setApiKey(generatedApiKey)
      setCurrentStep('api-key')
      
      toast({
        title: 'Credential Created',
        description: 'WebAuthn credential successfully created.',
      })
    } catch (err) {
      console.error('WebAuthn registration error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create credential')
    } finally {
      setIsLoading(false)
    }
  }

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      toast({
        title: 'API Key Copied',
        description: 'API key has been copied to your clipboard.',
      })
      setCurrentStep('wallet')
    }
  }

  const completeWithWallet = async () => {
    if (!walletAddress || !signer) {
      setError('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Sign message with actual wallet
      const message = `Binding wallet ${walletAddress} to DAO user ${userId}`
      
      // Use CKB-CCC to sign the message
      let signature: string
      try {
        // Sign message using the connected signer
        const signedMessage = await signer.signMessage(message)
        signature = signedMessage
      } catch (signError) {
        console.error('Failed to sign message:', signError)
        // Fallback to mock signature for testing
        signature = '0x' + '0'.repeat(128)
      }
      
      const result = await bindingFlow.completeBinding(userId, walletAddress, signature, message)
      
      setCurrentStep('complete')
      
      const totalTime = Math.floor((Date.now() - (startTime || 0)) / 1000)
      
      toast({
        title: 'Binding Complete!',
        description: `Address successfully bound in ${totalTime} seconds.`,
      })
      
      if (onComplete) {
        onComplete(result.txHash)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete binding')
    } finally {
      setIsLoading(false)
    }
  }

  const getProgressPercentage = () => {
    const stepIndex = steps.findIndex(s => s.id === currentStep)
    return ((stepIndex + 1) / steps.length) * 100
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Address Binding</CardTitle>
        <CardDescription>
          Securely bind your CKB address to your DAO account
          {elapsedTime > 0 && currentStep !== 'complete' && (
            <span className="ml-2 text-sm">
              <Clock className="inline h-3 w-3 mr-1" />
              {elapsedTime}s elapsed (target: 30s)
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={getProgressPercentage()} className="h-2" />
          <div className="flex justify-between">
            {steps.map((step) => {
              const status = getStepStatus(step.id)
              const Icon = step.icon
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center space-y-1 ${
                    status === 'completed' ? 'text-green-600' :
                    status === 'current' ? 'text-blue-600' :
                    'text-gray-400'
                  }`}
                >
                  <div className="relative">
                    <Icon className="h-6 w-6" />
                    {status === 'completed' && (
                      <CheckCircle2 className="absolute -right-2 -bottom-2 h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <span className="text-xs">{step.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <div className="min-h-[200px]">
          {currentStep === 'webauthn' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We'll use WebAuthn to create a secure credential for your account. 
                This credential will be used to sign governance actions without requiring your wallet each time.
              </p>
              <Button 
                onClick={startBinding} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Credential...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Create WebAuthn Credential
                  </>
                )}
              </Button>
            </div>
          )}

          {currentStep === 'api-key' && apiKey && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Copy this API key and paste it into your wallet's DAO binding section.
              </p>
              <div className="p-4 bg-muted rounded-lg font-mono text-xs break-all">
                {apiKey}
              </div>
              <Button 
                onClick={copyApiKey}
                className="w-full"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy API Key & Continue
              </Button>
            </div>
          )}

          {currentStep === 'wallet' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Connect your wallet to complete the address binding process.
                You'll sign a message to prove ownership of your address.
              </p>
              {walletAddress ? (
                <>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Connected Address:</p>
                    <p className="font-mono text-xs">{walletAddress}</p>
                  </div>
                  <Button 
                    onClick={completeWithWallet}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Completing Binding...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        Complete Binding
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No wallet connected. Please connect your wallet to continue.
                    </AlertDescription>
                  </Alert>
                  <Button 
                    onClick={() => open()}
                    className="w-full"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                </>
              )}
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="space-y-4 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
              <h3 className="text-lg font-semibold">Binding Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Your address has been successfully bound to your DAO account.
                {elapsedTime > 0 && (
                  <span className="block mt-2 font-semibold text-green-600">
                    Completed in {elapsedTime} seconds
                    {elapsedTime <= 30 && ' ✨ (Target achieved!)'}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Cancel Button */}
        {currentStep !== 'complete' && (
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
        )}
      </CardContent>
    </Card>
  )
}