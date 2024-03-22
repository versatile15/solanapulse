import {useWallet} from "@solana/wallet-adapter-react";
import styles from "./wallet.module.css";

const Wallets = () => {
    const {select, wallets, publicKey, disconnect} = useWallet();

    return !publicKey ? (
        <div>
            {wallets.filter((wallet) => wallet.readyState === "Installed").length >
            0 ? (
                wallets
                    .filter((wallet) => wallet.readyState === "Installed")
                    .map((wallet) => (
                        <button
                            key={wallet.adapter.name}
                            onClick={() => select(wallet.adapter.name)}
                            className={styles.buttonSection}
                        >
                            Connect Solana ({wallet.adapter.name})
                        </button>
                    ))
            ) : (
                <p>No wallet found. Please download a supported Solana wallet</p>
            )}
        </div>
    ) : (
        <div>
            <p>{publicKey.toBase58()}</p>
            <button onClick={disconnect} className={styles.buttonSection}>Disconnect wallet</button>
        </div>
    );
};

export default Wallets;
