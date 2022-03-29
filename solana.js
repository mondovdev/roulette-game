//To interact with a Solana node inside a Javascript application, we use the solana-web3.js library
const web3=require("@solana/web3.js");

//Getting Wallet Balance
const getWalletBalance=async (pubk)=>{
    try{
        const connection=new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
        const balance=await connection.getBalance(new web3.PublicKey(pubk));
        return balance/web3.LAMPORTS_PER_SOL;
    }catch(err){
        console.log(err);
    }
}

const transferSOL=async (from,to,transferAmt)=>{
    try{
        //Establishing Connection
        const connection=new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");

        //Creating Transaction
        //SystemProgram.transfer() method is responsible for sending the funds from one account to another. It takes several arguments:
        //fromPubkey: the public key of the account that we are sending funds from
        //toPubkey: the public key of the account that is receiving funds from the transaction
        //lamports: the amount of lamports to be sent. ( 1 SOL = 1000000000 lamports)
        const transaction=new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey:new web3.PublicKey(from.publicKey.toString()),
                toPubkey:new web3.PublicKey(to.publicKey.toString()),
                lamports:transferAmt*web3.LAMPORTS_PER_SOL
            })
        )

        //Signing the Transaction
        /*
        We will create a signature constant, which will store the result from sendAndConfirmTransaction() function.
        This function accepts several arguments:
        connection: the connection instance
        transaction: the transaction constant created at the top
        [signers]: the wallet instance of all the signers for the transaction
        */
        const signature=await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        )
        return signature;
    }catch(err){
        console.log(err);
    }
}

const airDropSol=async (wallet,transferAmt)=>{
    try{
        const connection=new web3.Connection(web3.clusterApiUrl("devnet"),"confirmed");
        // const walletKeyPair=await web3.Keypair.fromSecretKey(Uint8Array.from())
        const fromAirDropSignature=await connection.requestAirdrop(new web3.PublicKey(wallet.publicKey.toString()),transferAmt*web3.LAMPORTS_PER_SOL);
        await connection.confirmTransaction(fromAirDropSignature);
    }catch(err){
        console.log(err);
    }
}

module.exports={
    getWalletBalance,
    transferSOL,
    airDropSol
}