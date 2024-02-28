import { useState } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";
import { signAndConfirmTransactionFe } from "./utilityfunc";
import "./App.css";

function App() {
    const getProvider = () => {
        if ("solana" in window) {
            // console.log("solana");
            const provider = window.solana;
            if (provider.isPhantom) {
                return provider;
            }
        }
    };

    // const walletAddress = getProvider();

    // console.log(walletAddress);

    const [file, setfile] = useState();
    const [network, setnetwork] = useState("devnet");
    const [publicKey, setPublicKey] = useState("");
    const [name, setName] = useState();
    const walletAddress = "8cTSbEYV15e6f7HfkTkmTLFUZ2KZszdSEUcfYGMcdA9r";
    const [symbol, setSymbol] = useState();
    const [roy, setRoy] = useState();

    const [minted, setMinted] = useState();
    const [saveMinted, setSaveMinted] = useState();
    const [errorRoy, setErrorRoy] = useState();

    const [status, setStatus] = useState("Awaiting Upload");
    const [dispResponse, setDispResp] = useState("");

    const [connStatus, setConnStatus] = useState(true);

    const callback = (signature, result) => {
        console.log("Signature ", signature);
        console.log("result ", result);
        if (signature.err === null) {
            setMinted(saveMinted);
            setStatus("success: Successfully Signed and Minted.");
        }
    };

    const mintNow = (e) => {
        e.preventDefault();
        setStatus("Loading");
        let formData = new FormData();
        formData.append("network", "devnet");
        formData.append(
            "creator_wallet",
            "8cTSbEYV15e6f7HfkTkmTLFUZ2KZszdSEUcfYGMcdA9r"
        );
        formData.append("name", name);
        formData.append("symbol", "SOL");
        formData.append("image", file);
        formData.append("royalty", roy);
        // console.log(formData);

        axios({
            // Endpoint to send files
            url: "https://api.shyft.to/sol/v2/nft/create",
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
                "x-api-key": "JIi0xwgw7jaxMvr4",
                Accept: "*/*",
                "Access-Control-Allow-Origin": "*",
            },
            // Attaching the form data
            data: formData,
        })
            .then(async (res) => {
                // Handle the response from backend here
                console.log(res);
                if (res.data.success === true) {
                    setStatus(
                        "success: Transaction Created. Signing Transactions. Please Wait."
                    );
                    const transaction = res.data.result.encoded_transaction; //encoded transaction
                    console.log(res.data);
                    setSaveMinted(res.data.result.mint);
                    const ret_result = await signAndConfirmTransactionFe(
                        network,
                        transaction,
                        callback
                    ); //signing the encoded transaction
                    // console.log(ret_result);
                    setDispResp(res.data);

                    const nftMint = dispResponse.result.mint;
                    setMinted(saveMinted);

                    console.log(nftMint);
                    console.log(walletAddress);

                    await axios.post("http://localhost:5000/post", {
                        nftMint,
                        walletAddress,
                    });
                }
            })
            // Catch errors if any
            .catch((err) => {
                console.warn(err);
                setStatus("success: false");
            });
    };

    return (
        <>
            <Navbar />
            <div className="whitetext">Keep your Phantom wallet Unlocked!</div>
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-7 ">
                <div className="px-6 py-4">
                    <h1 className="text-xl font-semibold text-gray-900">
                        Upload and Mint NFT
                    </h1>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="nft-name" className="text-gray-700">
                            NFT Name
                        </label>
                        <input
                            id="nft-name"
                            type="text"
                            placeholder="Enter the name of the NFT"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="nft-name" className="text-gray-700">
                            Royalty
                        </label>
                        <input
                            id="nft-royalty"
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                            value={roy}
                            onChange={(e) => setRoy(e.target.value)}
                            required
                        />
                    </div>

                    <div className="">
                        <div className="space-y-2">
                            <label
                                htmlFor="image-upload"
                                className="text-gray-700 block"
                            >
                                Image
                            </label>
                            <input
                                id="image-upload"
                                type="file"
                                accept=".png,.jpg,.jpeg"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                                onChange={(e) => {
                                    setfile(e.target.files[0]);
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 text-right">
                    <button
                        className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500"
                        onClick={mintNow}
                    >
                        Mint NFT
                    </button>
                </div>

                <div className="py-5">
                    <h2 className="text-center pb-3">Response</h2>
                    <div className="status text-center text-info p-3">
                        <b>{status}</b>
                    </div>
                    <textarea
                        className="form-control"
                        name=""
                        value={JSON.stringify(dispResponse)}
                        id=""
                        cols="53"
                        rows="10"
                    ></textarea>
                </div>
                <div className="p-3 text-center">
                    {dispResponse && (
                        <a
                            href={`https://explorer.solana.com/address/${minted}?cluster=devnet`}
                            target="_blank"
                            className="btn btn-warning m-2 py-2 px-4"
                        >
                            View on Explorer
                        </a>
                    )}
                </div>
            </div>
        </>
    );
}

export default App;
