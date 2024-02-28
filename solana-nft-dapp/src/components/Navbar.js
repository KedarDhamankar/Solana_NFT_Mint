import { AppBar, IconButton, Toolbar } from "@mui/material";
import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const [connected, toggleConnect] = useState(false);
    const [currAddress, updateAddress] = useState("0x");

    // async function getAddress() {
    //     const provider = new ethers.providers.Web3Provider(window.ethereum);
    //     const signer = provider.getSigner();
    //     const addr = await signer.getAddress();
    //     updateAddress(addr);
    // }

    function updateButton() {
        const ethereumButton = document.querySelector(".link-wallet");
        ethereumButton.textContent = "Connected";
        // ethereumButton.classList.remove("hover:bg-blue-70");
        // ethereumButton.classList.remove("bg-blue-500");
        // ethereumButton.classList.add("hover:bg-green-70");
        // ethereumButton.classList.add("bg-green-500");
    }

    async function connectAccount() {
        const chainId = await window.ethereum.request({
            method: "eth_chainId",
        });
        if (chainId !== "0xaa36a7") {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0xaa36a7" }],
            });
        }
        await window.ethereum
            .request({ method: "eth_requestAccounts" })
            .then(() => {
                updateButton();
            });
    }

    useEffect(() => {
        if (window.ethereum == undefined) return;
        let val = window.ethereum.isConnected();
        if (val) {
            toggleConnect(val);
            updateButton();
        }
    });

    return (
        <AppBar
            position="static"
            sx={{
                padding: "1rem",
                backgroundColor: "rgba(0,0,0,0)",
                fontFamily: "Roboto, sans-serif",
                boxShadow: "none",
            }}
        >
            <Toolbar
                sx={{
                    gap: "3rem",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <button className="link-wallet" onClick={connectAccount}>
                        Link Wallet
                    </button>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
