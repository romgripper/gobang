import Head from "next/head";
//import Image from "next/image";
//import { Inter } from "next/font/google";
//import styles from "@/styles/Home.module.css";
import Board from "./App.js";

export default function Home() {
    return (
        <>
            <Head>
                <title>Gobang</title>
                <link rel="icon" href="favicon.ico" />
            </Head>
            <Board />
        </>
    );
}
