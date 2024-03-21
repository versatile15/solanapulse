"use client";
import styles from "./page.module.css";
import Head from "./components/header/header"
import Content from "@/app/components/content/content";

export default function Home() {
    return (
        <main className={styles.main}>
            <Head/>
            <Content/>
        </main>
    );
}
