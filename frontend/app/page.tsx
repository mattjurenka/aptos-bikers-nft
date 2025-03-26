"use client"
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { MINT_FN_ID } from "./constants";

export default function Home() {
  const { connected } = useWallet();
  return (
    <div className="min-h-screen w-full p-8 flex justify-center items-center bg-black">
      {connected &&
        <div className="absolute top-4 sm:top-8 right-4 sm:right-8 flex-row justify-end">
          <WalletSelector />
        </div>
      }
      {connected ? <Mint /> : <ConnectWallet />}
    </div>
  );
}

function Mint() {
  const { signAndSubmitTransaction } = useWallet()
  return (
    <div className="gap-8 p-4 sm:p-8 rounded-lg max-w-full xl:min-w-lg border border-white flex flex-col">
      <div className="flex items-center justify-center gap-2">
        <h1 className="font-sans font-extrabold text-2xl sm:text-3xl xl:text-5xl text-center">Mint Biker NFT</h1>
        <div className="flex flex-col">
          <a
            href="https://wapal.io/collection/0xe093d16b45e00b1c37cea71cf9890570fe4a20c7ee0553a4fd8cb17d1d241f98"
            className="underline text-blue-500"
            target="_blank"
          >
            Wapal
          </a>
          <a
            className="underline text-blue-500"
          >
            Tradeport
          </a>
        </div>

      </div>
      <div>
        <p className="text-center font-bold mb-2">Example IMG: (Bikers #0)</p>
        <img src="https://bikers.jurenka.software/0.jpeg" className="md:max-w-md lg:max-w-lg max-w-full" />
      </div>
      <button
        className="bg-blue-600 rounded-md p-1 font-extrabold text-lg cursor-pointer"
        onClick={() => {
          signAndSubmitTransaction({
            data: {
              function: MINT_FN_ID,
              functionArguments: [],
            },
          })
        }}
      >
        Mint for 0.1 APT
      </button>
    </div>
  )
}

function ConnectWallet() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="font-sans font-bold text-xl">Connect Your Wallet to Mint</h1>
      <WalletSelector />
    </div>
  )
}