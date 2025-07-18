import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "./contract-config";
import { uploadFileToIPFS } from "./ipfs";
import bgImage from "./bg.jpeg"; // Import the background image

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [landId, setLandId] = useState("");
  const [owner, setOwner] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask.");
    console.log("🦊 Connecting MetaMask...");
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setAccount(address);
    console.log("✅ Connected:", address);

    // ✅ FIX: Use ABI directly (not ABI.abi)
    const landContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    setContract(landContract);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadAndRegister = async () => {
    if (!contract || !landId || !owner || !location || !file) {
      return setMessage("⚠️ All fields and file are required.");
    }
    try {
      console.log("📤 Uploading file to IPFS...");
      const cidUrl = await uploadFileToIPFS(file);
      console.log("✅ File uploaded. CID:", cidUrl);
      console.log("📦 Calling contract.registerLand...");
      const tx = await contract.registerLand(
        BigInt(landId),
        owner,
        location,
        cidUrl
      );
      const receipt = await tx.wait();
      console.log("✅ Land registered in block:", receipt.blockNumber);
      setMessage("✅ Land registered with IPFS file!");
    } catch (err) {
      console.error("❌ Error:", err);
      setMessage("❌ Error: " + (err.reason || err.message));
    }
  };

  return (
    <div style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem"
    }}>
      <div style={{
        maxWidth: "500px",
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "10px",
        padding: "2rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>🏠 Land Registry DApp (with IPFS)</h2>

        {!account ? (
          <button 
            onClick={connectWallet}
            style={{
              display: "block",
              width: "100%",
              padding: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              marginBottom: "1.5rem"
            }}
          >
            🔌 Connect MetaMask
          </button>
        ) : (
          <p style={{ 
            backgroundColor: "#e8f5e9", 
            padding: "10px", 
            borderRadius: "5px",
            textAlign: "center",
            marginBottom: "1.5rem"
          }}>
            ✅ Connected as: {account}
          </p>
        )}

        <h3 style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>📄 Register New Land</h3>
        <div style={{ marginTop: "1.5rem" }}>
          <input
            placeholder="Land ID"
            value={landId}
            onChange={(e) => setLandId(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "1rem",
              borderRadius: "5px",
              border: "1px solid #ddd"
            }}
          />
          <input
            placeholder="Owner Address"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "1rem",
              borderRadius: "5px",
              border: "1px solid #ddd"
            }}
          />
          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "1rem",
              borderRadius: "5px",
              border: "1px solid #ddd"
            }}
          />
          <div style={{ 
            marginBottom: "1.5rem", 
            padding: "10px", 
            border: "1px dashed #ddd",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9"
          }}>
            <input 
              type="file" 
              onChange={handleFileChange} 
              style={{ width: "100%" }}
            />
          </div>
          <button 
            onClick={uploadAndRegister}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            📤 Upload File & Register Land
          </button>
        </div>

        {message && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: message.startsWith("✅") ? "#e8f5e9" : "#ffebee",
              color: message.startsWith("✅") ? "#2e7d32" : "#c62828",
              textAlign: "center",
              fontWeight: "500"
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
