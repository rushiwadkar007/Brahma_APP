import "../App.css";
import MetaMaskSDK from "@metamask/sdk";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { walletDetails } from "../redux/actions";
import data from "../contractdetails/Brahma.json"
import Web3 from "web3";
const ABI = data.abi
const ADDRESS = data.networks[3].address
new MetaMaskSDK({
  useDeeplink: false,
  communicationLayerPreference: "socket",
});

export function Wallet() {
  const navigate = useNavigate()
  const [chain, setChain] = useState("");
  const [response, setResponse] = useState("");
  const [wallet, setWallet] = useState({})
  const dispatch = useDispatch()
  const walletData = useSelector((wallet) => wallet);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");

  const connect = async () => {
    await dispatch(walletDetails(window.ethereum))
    window.ethereum
      .request({
        method: "eth_requestAccounts",
        params: [],
      })
      .then((res) => {setAccount(res[0])})
      .catch((e) => console.log("request accounts ERR", e));
  };

  const addEthereumChain = () => {
    window.ethereum
      .request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x13881",
            chainName: "matic-mumbai",
            blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
            nativeCurrency: { symbol: "MATIC", decimals: 18 },
            rpcUrls: ["https://rpc.ankr.com/polygon_mumbai"],
          },
        ],
      })
      .then((res) => console.log("add", res))
      .catch((e) => console.log("ADD ERR", e));
  };

  // const getRole = async() =>{
  //   const currentRole =  await  contract.methods.getUserRole("0x9A712b4980B474F9Edc6eD6599E4AdF2E6f8bc31").call();
  //   console.log("currentRole",currentRole)
  //   }

  useEffect(() => {
    connect()

    const initWeb3 = async () => {
      // Connect to the blockchain
      const web3 = new Web3(Web3.givenProvider);

      // Get the contract instance
      const contract = new web3.eth.Contract(ABI, ADDRESS);
      web3.setProvider("https://rpc.ankr.com/polygon_mumbai");
      setWeb3(web3);
      setContract(contract);
    };
    initWeb3();
    
    window.ethereum.on("chainChanged", (chain) => {
      console.log(chain);
      setChain(chain);
    });
    window.ethereum.on("accountsChanged", (accounts) => {
      console.log(accounts);
      setAccount(accounts?.[0]);
    });
  }, []);

  const sendTransaction = async () => {
    const to = "0x0000000000000000000000000000000000000000";
    const transactionParameters = {
      to, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      value: "0x5AF3107A4000", // Only required to send ether to the recipient from the initiating external account.
    };

    try {
      // txHash is a hex string
      // As with any RPC call, it may throw an error
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      setResponse(txHash);
    } catch (e) {
      console.log(e);
    }
  };

  const sign = async () => {
    const msgParams = JSON.stringify({
      domain: {
        // Defining the chain aka Rinkeby testnet or Ethereum Main Net
        chainId: parseInt(window.ethereum.chainId, 16),
        // Give a user friendly name to the specific contract you are signing for.
        name: "Ether Mail",
        // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
        // Just let's you know the latest version. Definitely make sure the field name is correct.
        version: "1",
      },

      // Defining the message signing data content.
      message: {
        /*
         - Anything you want. Just a JSON Blob that encodes the data you want to send
         - No required fields
         - This is DApp Specific
         - Be as explicit as possible when building out the message schema.
        */
        contents: "Hello, Bob!",
        attachedMoneyInEth: 4.2,
        from: {
          name: "Cow",
          wallets: [
            "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
            "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
          ],
        },
        to: [
          {
            name: "Bob",
            wallets: [
              "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
              "0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57",
              "0xB0B0b0b0b0b0B000000000000000000000000000",
            ],
          },
        ],
      },
      // Refers to the keys of the *types* object below.
      primaryType: "Mail",
      types: {
        // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        // Not an EIP712Domain definition
        Group: [
          { name: "name", type: "string" },
          { name: "members", type: "Person[]" },
        ],
        // Refer to PrimaryType
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person[]" },
          { name: "contents", type: "string" },
        ],
        // Not an EIP712Domain definition
        Person: [
          { name: "name", type: "string" },
          { name: "wallets", type: "address[]" },
        ],
      },
    });

    var from = window.ethereum.selectedAddress;

    var params = [from, msgParams];
    var method = "eth_signTypedData_v4";

    try {
      const resp = await window.ethereum.request({ method, params });
      setResponse(resp);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="App">
        <button className="btn btn-success" style={{ padding: 10, margin: 10 }} onClick={connect}>
          {account ? "Connected" : "Connect"}
        </button>

        <button className="btn btn-info" style={{ padding: 10, margin: 10 }} onClick={sign}>
          Sign
        </button>

        <button  className="btn btn-warning" style={{ padding: 10, margin: 10 }} onClick={sendTransaction}>
          Send transaction
        </button>

        <button className="btn btn-success" style={{ padding: 10, margin: 10 }} onClick={addEthereumChain}>
          Add ethereum chain
        </button>

        <button className="btn btn-success" style={{ padding: 10, margin: 10 }} onClick={ () => {navigate("/dashboard")}}>
          Go to Dashboard
        </button>

        {chain && `Connected chain: ${chain}`}
        <p></p>
        {account && `Connected account: ${account}`}
        <p></p>
        {response && `Last request response: ${response}`}
    </div>
  );
}