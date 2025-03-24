// Update the TODOs below to customize this digital asset to your needs.
// You will want to customize the Collection values and individual Digital Asset values.
// This example demonstrates creating a collection, populating it with digital assets, and transferring them.
 
import "dotenv/config";
import {
    Account,
    Aptos,
    AptosConfig,
    Network,
    NetworkToNetworkName,
    Ed25519PrivateKey
} from "@aptos-labs/ts-sdk";
 
// Verify environment variables are loaded
console.log("Environment variables loaded:", {
    APTOS_NETWORK: process.env.APTOS_NETWORK || "not set"
});
 
const INITIAL_BALANCE = 100_000_000;
 
console.log("Step 1: Setting up a client to connect to Aptos");
const APTOS_NETWORK = NetworkToNetworkName[process.env.APTOS_NETWORK!] || Network.DEVNET;
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);
 
async function example() {
    console.log("\n=== Step 2: Creating and funding accounts ===\n");
    const alice = Account.fromPrivateKey({
        privateKey: new Ed25519PrivateKey(process.env.APTOS_PRIVKEY)
    });
    const bob = Account.fromPrivateKey({
        privateKey: new Ed25519PrivateKey(process.env.APTOS_PRIVKEY2)
    });
 
    console.log(`Alice's address: ${alice.accountAddress}`);
    console.log(`Bob's address: ${bob.accountAddress}`)

    //console.log("Funding Alice's account...");
    //await aptos.fundAccount({ accountAddress: alice.accountAddress, amount: INITIAL_BALANCE });
    //console.log("Alice's account funded!");
 
    //console.log("Funding Bob's account...");
    //await aptos.fundAccount({ accountAddress: bob.accountAddress, amount: INITIAL_BALANCE });
    //console.log("Bob's account funded!");
 
    console.log("\n=== Step 3: Creating a collection ===\n");
    // TODO: Update these values to customize your Digital Asset!
    const collectionName = "Example Collection";
    const collectionDescription = "This is an example collection.";
    const collectionURI = "aptos.dev";
 
    console.log("Building the collection creation transaction...");
    const createCollectionTransaction = await aptos.createCollectionTransaction({
        creator: alice,
        description: collectionDescription,
        name: collectionName,
        uri: collectionURI,
    });
 
    console.log("Submitting the collection creation transaction...");
    const committedTxn = await aptos.signAndSubmitTransaction({
        signer: alice,
        transaction: createCollectionTransaction,
    });
 
    console.log("Waiting for the collection creation transaction to complete...");
    await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    console.log("Collection created successfully!");
 
    console.log("\n=== Step 4: Minting a digital asset ===\n");
    // TODO: Update the values of the Digital Assets you are minting!
    const tokenName = "Example Asset";
    const tokenDescription = "This is an example digital asset.";
    const tokenURI = "aptos.dev/asset";
 
    console.log("Building the mint transaction...");
    const mintTokenTransaction = await aptos.mintDigitalAssetTransaction({
        creator: alice,
        collection: collectionName,
        description: tokenDescription,
        name: tokenName,
        uri: tokenURI,
    });
    console.log(mintTokenTransaction)
 
    console.log("Submitting the mint transaction...");
    const mintTxn = await aptos.signAndSubmitTransaction({
        signer: alice,
        transaction: mintTokenTransaction,
    });
    console.log(mintTxn)
 
    console.log("Waiting for the mint transaction to complete...");
    await aptos.waitForTransaction({ transactionHash: mintTxn.hash });
    console.log("Digital asset minted successfully!");
 
    console.log("\n=== Step 5: Transferring the digital asset ===\n");
    
    // Wait for the indexer to update with the latest data from on-chain
    await new Promise((resolve) => setTimeout(resolve, 5000));
    
    const aliceDigitalAssets = await aptos.getOwnedDigitalAssets({
        ownerAddress: alice.accountAddress,
    });
 
    // Check if Alice has any digital assets before accessing them
    if (aliceDigitalAssets.length === 0) {
        console.error("No digital assets found for Alice. Make sure the minting was successful.");
        return;
    }
 
    const digitalAssetAddress = aliceDigitalAssets[0].token_data_id;
 
    console.log("Building the transfer transaction...");
    const transferTransaction = await aptos.transferDigitalAssetTransaction({
        sender: alice,
        digitalAssetAddress,
        recipient: bob.accountAddress,
    });
 
    console.log("Submitting the transfer transaction...");
    const transferTxn = await aptos.signAndSubmitTransaction({
        signer: alice,
        transaction: transferTransaction,
    });
 
    console.log("Waiting for the transfer transaction to complete...");
    await aptos.waitForTransaction({ transactionHash: transferTxn.hash });
    console.log("Digital asset transferred successfully!");
 
    console.log("\n=== Step 6: Verifying digital asset balances ===\n");
    const aliceDigitalAssetsAfter = await aptos.getOwnedDigitalAssets({
        ownerAddress: alice.accountAddress,
    });
    const bobDigitalAssetsAfter = await aptos.getOwnedDigitalAssets({
        ownerAddress: bob.accountAddress,
    });
 
    console.log(`Alice's digital asset balance: ${aliceDigitalAssetsAfter.length}`);
    console.log(`Bob's digital asset balance: ${bobDigitalAssetsAfter.length}`);
    
    console.log("\n=== Step 7: Transaction hashes for explorer ===\n");
    console.log(`Collection creation transaction: ${committedTxn.hash}`);
    console.log(`Mint transaction: ${mintTxn.hash}`);
    console.log(`Transfer transaction: ${transferTxn.hash}`);
    console.log("\nYou can view these transactions on the Aptos Explorer:");
    console.log("https://explorer.aptoslabs.com/?network=devnet");
}
 
example();
