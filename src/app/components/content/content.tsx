import styles from "./content.module.css";
import {useAccount, useWaitForTransactionReceipt, useWriteContract, type BaseError} from "wagmi";
import {useEffect, useState} from "react";
import {signMessage} from "@wagmi/core";
import {config} from '@/config';
import {abi} from "@/app/abis/solregister";
import {toast} from "react-toastify";
import {useWallet} from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";

const Wallets = dynamic(() => import("../wallets/wallets"), {ssr: false});

export default function Content() {
    const {address, isConnected} = useAccount();
    const [transactionValue, setTransactionValue] = useState("");
    const [solValue, setSolValue] = useState("");
    const [solConnected, setSolConnected] = useState("false");
    const contractAddress = "0x3bbe86f770395025c78adde37d3f5abb885de6b1";
    const {data: hash, error, isPending, writeContract} = useWriteContract();

    const {select, wallets, publicKey, disconnect} = useWallet();
    const {isLoading: isConfirming, isSuccess: isConfirmed} =
        useWaitForTransactionReceipt({
            hash,
        });
    useEffect(() => {
        {
            error &&
            toast.error((error as BaseError).shortMessage || error.message, {
                autoClose: 2000,
            });
            setTransactionValue("");
            setSolValue("");
        }
    }, [error]);
    useEffect(() => {
        if (isConfirmed) {
            toast.success("Transaction and Sol address are saved!");
            setTransactionValue("");
            setSolValue("");
        }
    }, [isConfirmed]);

    async function handleClick() {
        const result = await signMessage(config, {message: transactionValue + '\n' + solValue});

        if (address) {
            writeContract({
                abi,
                address: contractAddress,
                functionName: "saveSignature",
                args: [
                    address,
                    result
                ],
                account: address,
            });
        }
    }

    return (
        <div className={styles.main}>
            <div className={styles.reserveSection}>
                <div className={styles.reservePanel}>
                    <div className={styles.reservePanelHeader}>
                        <p>LINK YOUR SOLANA ADDRESS TO YOUR PULSECHAIN ADDRESS TO RECEIVE TARD:</p>
                    </div>
                    <div className={styles.reservePanelContent}>
                        <div className={styles.panelDescription}>
                            <p>1. Generate a Solana address with https://phantom.app</p>
                            <p>2. Send SOL on Solana to [solana presale address]</p>
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            <p>3. Click "Connect Solana", connecting to the same Solana wallet that you sent funds from
                                in step (2).</p>
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            <p>4. Click "Connect Pulsechain", to connect to the pulsechain wallet which you want TARD
                                sent to - OR - manually enter the pulsechain wallet address you want <br></br> your TARD
                                sent to.</p>
                            <p>5. Once TARD is launched, you will receive your TARD to your Pulsechain address
                                provided.</p>
                        </div>
                        <div className={styles.transactionSection}>
                            <p>Solana address you sent SOL from:</p>
                            <Wallets/>
                        </div>
                        <div className={styles.solSection}>
                            <p>Pulsechain address you want to receive TARD on:</p>
                            <w3m-button/>
                        </div>
                        <div className={styles.buttonSection}>
                            <button type="button" onClick={handleClick}
                                    disabled={!isConnected || isConfirming || isPending || !publicKey}>{(isConfirming || isPending) ? "Confirming" : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.signaturePanel}>
                    <div className={styles.reservePanelHeader}>
                        <p>Check your Signatures</p>
                    </div>
                    <div className={styles.reservePanelContent}>
                        <p>if something doesnt look right, just resubmit. If you have any trouble, reach out to Dip
                            Catcher on twitter. @TantoNomini. Do not be victimized by impostors. I will not send you to
                            any other webpage except for gofursdelsol.anvil.app.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}