"use clinet";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const TokenTransfer = () => {
  const { address: connectedAddress } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const { writeAsync: writeMyTokenAsync } = useScaffoldContractWrite({
    contractName: "MyToken",
    functionName: "transfer",
    args: [recipient, parseEther(amount)],
  });

  const handleTransfer = async () => {
    if (!recipient || !amount) {
      notification.error("Please enter recipient address and amount");
      return;
    }
    try {
      await writeMyTokenAsync({
        args: [recipient, parseEther(amount)],
      });

      notification.success("Token transfer successful");
      setRecipient("");
      setAmount("");
    } catch (error) {
      console.error("Token transfer failed:", error);
      notification.error("Token transfer failed");
    }
  };

  if (!connectedAddress) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Transfer Tokens</h2>
          <p>Please connect your waallet to transfer tokens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Transfer Token</h2>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Recipient Address</span>
          </label>
          <input
            type="text"
            placeholder="0x..."
            className="input input-bordered w-full max-w-xs"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
          />
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Amount</span>
          </label>
          <input
            type="number"
            placeholder="0.0"
            className="input input-bordered w-full max-w-xs"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>

        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={handleTransfer} disabled={!recipient || !amount}>
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
};
