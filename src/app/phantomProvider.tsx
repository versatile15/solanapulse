'use client'

import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import {ReactNode, useMemo} from "react";
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    MathWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {clusterApiUrl} from "@solana/web3.js";


export default function Web3PhantomProvider
({
     children,
 }: {
    children: ReactNode
}) {
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new MathWalletAdapter(),
        ],
        []
    );

    const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                {children}
            </WalletProvider>
        </ConnectionProvider>
    )
}