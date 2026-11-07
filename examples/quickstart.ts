import { SynArcAgent } from "synarc-agent-sdk";

// Replace with your values
const config = {
  rpcUrl: process.env.RPC_URL || "https://rpc.mainnet.arc.io",          // or your RPC
  privateKey: (process.env.PRIVATE_KEY as `0x${string}`) || "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",   // wallet with sARC + gas
  treasuryAddress: "0x8205e9782Fe54fD2aaD895b436B695db169F3d7B" as `0x${string}`, // your mainnet treasury
  chainId: 5042,
};

async function main() {
  const agent = new SynArcAgent(config);

  // 1. Create a proposal
  console.log("Creating proposal...");
  const proposal = await agent.createProposal({
    title: "Pay invoice #42",
    description: "Milestone 1 deliverable",
    payee: "0x7f67D351Cc3A6e9695c0B8AA6DE2bE5Ce58b3d73", // example payee
    amount: "5",          // 5 USDC
    token: "USDC",
    deliverableCid: "bafybeic56p7jky57o6f7i7vub4u7y2a5vxgd", // real IPFS CID of the invoice/deliverable
  });
  console.log("Proposal created:", proposal.id);

  // 2. Check if it can be released (three-way match)
  console.log("Checking release conditions...");
  const check = await agent.checkRelease(proposal.id);
  console.log("Match result:", check);

  // 3. If under agent cap and match passes, release
  if (check.canRelease && check.amount <= 50) {
    console.log("Releasing via agent...");
    const tx = await agent.releaseMilestone(proposal.id);
    console.log("Released. Tx:", tx.hash);
  } else {
    console.log("Needs human review or match failed.");
  }
}

main().catch(console.error);
