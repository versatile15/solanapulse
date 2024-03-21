import styles from "./content.module.css";
import {useAccount, useWaitForTransactionReceipt, useWriteContract, type BaseError} from "wagmi";
import {useEffect, useState} from "react";
import {signMessage} from "@wagmi/core";
import {config} from '@/config';
import {abi} from "@/app/abis/solregister";
import {toast} from "react-toastify";

export default function Content() {
    const {address, isConnected} = useAccount();
    const [transactionValue, setTransactionValue] = useState("");
    const [solValue, setSolValue] = useState("");
    const [solConnected, setSolConnected] = useState("false");
    const contractAddress = "0x3bbe86f770395025c78adde37d3f5abb885de6b1";
    const {data: hash, error, isPending, writeContract} = useWriteContract();

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
                        <p>Reserve your Tard Sol</p>
                    </div>
                    <div className={styles.reservePanelContent}>
                        <div className={styles.panelDescription}>
                            <p>1. Generate a Solana address with https://phantom.app</p>
                            <p>2. Send ETH, PLS, eHEX, pHEX, INC, PLSX, or Tard on either chain to
                                0x35e4D6E3C61C3d8D19F2575355d0a3Eca0Da1944</p>
                            <p>3. Copy the tx hash receipt from your transaction and your Solana address and paste them
                                below. Click submit and complete the signature generation process. This signature is
                                what proves the link between your SOL address and your Ethereum/pulsechain address.</p>
                            <p>4. Once TARD Sol is launched, you will receive your TARD to your Solana address
                                provided.</p>
                        </div>
                        <div className={styles.addressSection}>
                            <p>Address you sent ETH, PLS, or TARD from:</p>
                            <p>{!isConnected ? "Connect Wallet To Address You Sent From" : address}</p>
                        </div>
                        <div className={styles.transactionSection}>
                            <p>Transaction Hash - this is the block explorer receipt of your transaction</p>
                            <textarea className={styles.textSection}
                                      onChange={e => setTransactionValue(e.target.value)} value={transactionValue}/>
                            <w3m-button />
                        </div>
                        <div className={styles.solSection}>
                            <p>Solana Address - this is where your TARD Sol will be sent</p>
                            <textarea className={styles.textSection} onChange={e => setSolValue(e.target.value)}
                                      value={solValue}/>
                            <w3m-button/>
                        </div>
                        <div className={styles.buttonSection}>
                            <button type="button" onClick={handleClick}
                                    disabled={!isConnected || isConfirming || isPending}>{(isConfirming || isPending) ? "Confirming" : "Submit"}
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