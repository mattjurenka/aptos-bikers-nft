"use client"
import "./globals.css";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

import { AptosWalletAdapterProvider, Network } from "@aptos-labs/wallet-adapter-react";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{ network: "mainnet" as Network.MAINNET }}
      onError={(error) => {
        console.log("error", error);
      }}
    >
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </AptosWalletAdapterProvider>
  );
}
