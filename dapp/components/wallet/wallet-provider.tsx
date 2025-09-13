'use client'

import { ccc } from '@ckb-ccc/connector-react'
import { ReactNode, useMemo } from 'react'

export function WalletProvider({ children }: { children: ReactNode }) {
  const defaultClient = useMemo(() => {
    return new ccc.ClientPublicTestnet()
  }, [])

  return (
    <ccc.Provider
      connectorProps={{
        style: {
          "--background": "#232323",
          "--divider": "rgba(255, 255, 255, 0.1)",
          "--btn-primary": "#00d4aa",
          "--btn-primary-hover": "#00b894",
          "--btn-secondary": "#2D2F2F",
          "--btn-secondary-hover": "#515151",
          "--icon-primary": "#FFFFFF",
          "--icon-secondary": "rgba(255, 255, 255, 0.6)",
          color: "#ffffff",
          "--tip-color": "#666",
        }
      }}
      defaultClient={defaultClient}
      clientOptions={[
        {
          name: "CKB Testnet",
          client: new ccc.ClientPublicTestnet(),
        },
        {
          name: "CKB Mainnet",
          client: new ccc.ClientPublicMainnet(),
        },
      ]}
    >
      {children}
    </ccc.Provider>
  )
}

// Export hooks for use in components
export const useSigner = ccc.useSigner
export const useCcc = ccc.useCcc