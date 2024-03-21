import styles from "./header.module.css";

export default function Head() {
    return (
        <div className={styles.navSection}>
            <div className={styles.description}>
                <h1>Tard Sol</h1>
            </div>
        </div>
    )
}