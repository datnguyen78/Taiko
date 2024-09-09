const ethers = require("ethers");
const { readToArray } = require("./utils/file-util");
const { getChunks } = require("./utils/collection-util");
const { waitRandom } = require("./utils/timer-util"); // Use waitRandom from timer-util

const contractAddress = "0xa20a8856e00F5ad024a55A663F06DCc419FFc4d5";

// ABI for the send nft function
const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const options = {
  gasPrice: ethers.parseUnits("0.1", "gwei").toString(),
  gasLimit: 180000,
};

const separateBatch = () => {
  const testList = readToArray("./private.txt");
  const chunks = getChunks(testList, 2);
  return chunks;
};

async function sendNft(fromPrivateKey) {
  try {
    console.log(`Processing privateKey: ${fromPrivateKey}...`);
    
    // Create a provider instance
    const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/taiko");

    // Create a wallet instance from your private key
    const fromWallet = new ethers.Wallet(fromPrivateKey, provider);

    // Create a contract instance using the ABI and contract address
    const contract = new ethers.Contract(contractAddress, abi, fromWallet);

    // Query balance (assuming this is a necessary step for processing)
    await contract.balanceOf(fromWallet.address, options);

    // Add a random delay between transactions
    await waitRandom(30000, 60000); // Wait exactly 2 minutes (120 seconds)

    console.log(`Processed privateKey ${fromPrivateKey} successfully`);
  } catch (error) {
    console.error(`Error processing privateKey: ${fromPrivateKey}: ${error}`);
  }
}

const sendChunk = async (privateKeys) => {
  const txsToProcess = parseInt(process.argv[2], 10) || 500; // Default to 500 if not specified
  let count = 1;
  while (count <= txsToProcess) { // Adjusted to process up to the number specified
    console.log(`Processing chunk with size ${privateKeys.length} / Loop ${count++}`);
    for (let i = 0; i < privateKeys.length; i++) {
      const fromPrivateKey = privateKeys[i].replace("\r", "");
      await sendNft(fromPrivateKey);
    }
  }
};

const processBatch = async () => {
  const chunks = separateBatch();

  for (let i = 0; i < chunks.length; i++) {
    await sendChunk(chunks[i]); // Ensure batches are processed sequentially
  }
};

processBatch();