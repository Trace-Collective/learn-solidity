"use client";

import { Address } from "../scaffold-eth";
import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const TokenBalance = () => {
  const { address: connectedAddress } = useAccount();

  const { data: TokenBalance } = useScaffoldContractRead({
    contractName: "MyToken",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  const { data: TokenSymbol } = useScaffoldContractRead({
    contractName: "MyToken",
    functionName: "symbol",
  });

  const { data: TokenName } = useScaffoldContractRead({
    contractName: "MyToken",
    functionName: "name",
  });

  if (!connectedAddress) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Token Balance</h2>
          <p>Please connect your waallet to view token balance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-96 bg-base-100 shadow-xl p-8">
      <div className="card-boy">
        <h2 className="card-title items-center justify-center">
          {TokenName} ({TokenSymbol})
        </h2>
        <div className="stats mb-4">
          <div className="stat">
            <div className="stat-title">Yout Balance</div>
            <div className="stat-value text-white">{TokenBalance ? (Number(TokenBalance) / 1e18).toFixed(4) : "0"}</div>
            <div className="stat-desc">{TokenSymbol}</div>
          </div>
        </div>
        <div className="card-actions justify-center">
          <Address address={connectedAddress} />
        </div>
      </div>
    </div>
  );
};
