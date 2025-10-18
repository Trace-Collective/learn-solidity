"use client";

import { useState } from "react";
import { Address } from "../scaffold-eth";
import { useAccount } from "wagmi";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const NFTCollection = () => {
  const { address: connectedAddress } = useAccount();
  const [mintToAddress, setMintToAddress] = useState("");

  const { data: nftName } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "name",
  });

  const { data: nftSymbol } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "symbol",
  });

  const { data: totalSupply } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "totalSupply",
  });

  const { data: userBalance } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  const { writeAsync: writeMyNFTAsync } = useScaffoldContractWrite({
    contractName: "MyNFT",
    functionName: "mint",
    args: [mintToAddress || connectedAddress],
  });

  const handleMint = async () => {
    const targetAddress = mintToAddress || connectedAddress;

    if (!targetAddress) {
      notification.error("Please enter a valid address to mint the NFT");
      return;
    }

    try {
      await writeMyNFTAsync({
        args: [targetAddress],
      });

      notification.success(`NFT minted successfully to ${targetAddress}`);
      setMintToAddress("");
    } catch (error) {
      console.error("NFT minting failed:", error);
      notification.error("NFT minting failed");
    }
  };

  if (!connectedAddress) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">NFT Collection</h2>
          <p>Please connect your wallet to view NFT collection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          {nftName} ({nftSymbol})
        </h2>

        <div className="stats">
          <div className="stat">
            <div className="stat-title">Total Minted</div>
            <div className="stat-value text-secondary">{totalSupply?.toString() || "0"}</div>
          </div>
          <div className="stat">
            <div className="stat-title">You Own</div>
            <div className="stat-value text-primary">{userBalance?.toString() || "0"}</div>
          </div>
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Mint NFT To Address (leave empty to mint to your address)</span>
          </label>
          <input
            type="text"
            placeholder="0x.. or leave empty"
            className="input input-bordered w-full max-w-xs"
            value={mintToAddress}
            onChange={e => setMintToAddress(e.target.value)}
          />
        </div>

        <div className="card-actions justify-end">
          <button className="btn btn-primary" onClick={handleMint}>
            Mint NFT
          </button>
        </div>

        <div className="text-sm text-gray-600">
          <Address address={connectedAddress} />
        </div>
      </div>
    </div>
  );
};
