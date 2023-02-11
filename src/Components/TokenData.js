import React, { useState, useEffect, useContext } from "react";
import { ethers, Wallet } from "ethers";
import { MetamaskContext } from "../Contexts/MetamaskContext";
import Web3 from "web3";
import FunToken from "../../next-coin/artifacts/contracts/FunToken.sol/FunToken.json";
import { provider } from "../../utils/Contract";

const contractAddress = "0xdFEa31Ce6a2473D008a194F468C90FaFAFd74a26";

const TokenData = () => {
  const {
    isConnected,
    client,
    wallet,
    address,
    setIsConnected,
    setWallet,
    setAddress,
  } = useContext(MetamaskContext);

  const [refresh, setRefresh] = useState(0);

  const [balance, setBalance] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [assets, setAssets] = useState(null);
  const [rewards, setRewards] = useState(null);

  const [name, setName] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [rewardDistribution, setRewardDistribution] = useState(null);
  const [depositCount, setDepositCount] = useState(null);

  const [depositLoading, setDepositLoading] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState();
  const [transferSuccess, setTransferSuccess] = useState();

  const [transferLoading, setTransferLoading] = useState(false);

  const [claimRewardLoading, setClaimRewardLoading] = useState(false);
  const [distributeRewardsLoading, setDistributeRewardsLoading] =
    useState(false);

  const [deposit, setDeposit] = useState();
  const [walletAddressInput, setWalletAddressInput] = useState();
  const [transferAmount, setTransferAmount] = useState();

  const [contractData, setContractData] = useState(null);

  useEffect(() => {
    const loadWeb3 = async () => {
      const contract = new ethers.Contract(
        contractAddress,
        FunToken.abi,
        wallet
      );
      setContractData(contract);

      const getBalance = await contract.balanceOf(address);
      const getSymbol = await contract.symbol();
      const getAssets = await contract.Assets(address);
      const getReward = await contract.Rewards(address);

      const getName = await contract.name();
      const getTotalSupply = await contract.totalSupply();
      const getRewardDistribution = await contract.rewardDistribution();
      const getDepositCount = await contract.depositCount();

      setBalance(Number(getBalance));
      setRewards(Number(getReward));
      setAssets(Number(getAssets));
      setSymbol(getSymbol);

      setName(getName);
      setTotalSupply(Number(getTotalSupply));
      setRewardDistribution(Number(getRewardDistribution));
      setDepositCount(Number(getDepositCount));
    };

    loadWeb3();
  }, [refresh]);

  const transferToken = async () => {
    if (!contractData) return;
    if (!walletAddressInput) return;
    if (!transferAmount) return;
    setTransferLoading(true);
    try {
      const transferToken = await contractData.transfer(
        walletAddressInput,
        Web3.utils.toWei(transferAmount.toString())
      );
      setTransferSuccess(`Success hash: ${transferToken.hash}`);
      setTransferLoading(false);
    } catch (error) {
      setTransferLoading(false);
      if (
        error.code === "UNSUPPORTED_OPERATION" &&
        error.info &&
        error.info.network
      ) {
        const errorMessage = `Error: network does not support ENS (network name: ${error.info.network.name})`;
        setTransferSuccess(`${errorMessage}`);
      }
    }
  };

  const despositToken = async () => {
    setDepositSuccess("");
    if (!contractData) return;
    if (!deposit) return;
    setDepositLoading(true);
    try {
      const getDepositCount = await contractData.deposit(
        Web3.utils.toWei(deposit.toString())
      );
      setDepositSuccess(`Success hash: ${getDepositCount.hash}`);
      setDepositLoading(false);
    } catch (error) {
      setDepositLoading(false);
      setDepositSuccess(`Error hash: ${error?.revert?.args[0]}`);
    }
  };
  const signOut = () => {
    setIsConnected(false);
    setWallet();

    setIsConnected();
    setAddress();
  };

  const refreshPage = () => {
    setRefresh(refresh + 1);
  };

  const claimReward = async () => {
    setClaimRewardLoading(true);
    try {
      await contractData.claimReward();
      refreshPage();
      setClaimRewardLoading(false);
    } catch (error) {
      console.log(error);
      setClaimRewardLoading(false);
    }
  };
  const manualDistributeRewards = async () => {
    setDistributeRewardsLoading(true);
    try {
      await contractData.distributeRewards();
      refreshPage();
      setDistributeRewardsLoading(false);
    } catch (error) {
      console.log(error);
      setDistributeRewardsLoading(false);
    }
  };

  return (
    <div className="pt-[0px]">
      <div className="pb-[40px]">
        <div className="py-2 flex justify-between">
          <div></div>
          <button
            onClick={signOut}
            className="w-[120px] bg-gray-200 px-4 py-2 rounded-md text-gray-900 border-[1px] border-gray-900"
          >
            Logout
          </button>
        </div>
        <div className="px-4 bg-gray-200 py-3 rounded-md flex justify-between">
          <div>Current Account: </div>
          <div>{address}</div>
        </div>
      </div>

      <div className="">
        <div className="flex justify-between">
          <div>
            <div className="flex">
              <div className="px-2">Balance:</div>
              <div className="text-bold font-bold flex">
                <p className="pr-2">{balance / 10 ** 18}</p>
                <p className="text-[12px] pt-1">{symbol}</p>
              </div>
            </div>
            <div className="flex">
              <div className="px-2">Assets:</div>
              <div className="text-bold font-bold">{assets}</div>
            </div>
            <div className="flex">
              <div className="px-2">Rewards:</div>
              <div className="text-bold font-bold flex">
                <p className="pr-2">{rewards / 10 ** 18}</p>
                <p className="text-[12px] pt-1">{symbol}</p>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <button
              onClick={refreshPage}
              className="w-full bg-gray-200 px-4 py-2 rounded-md text-gray-900 border-[1px] border-gray-900"
            >
              <div className="flex space-x-2">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </div>

                <div>Refresh</div>
              </div>
            </button>
          </div>
        </div>

        <div className="pt-[40px] space-y-3">
          <div className="flex justify-between">
            <button
              className="w-[200px] bg-gray-200 px-4 py-2 rounded-md text-gray-900 border-[1px] border-gray-900"
              onClick={claimReward}
            >
              {!claimRewardLoading ? (
                <div>Claim Reward</div>
              ) : (
                <div className="flex justify-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
            </button>
            <button
              className="w-[200px] bg-gray-200 px-4 py-2 rounded-md text-gray-900 border-[1px] border-gray-900"
              onClick={manualDistributeRewards}
            >
              {!distributeRewardsLoading ? (
                <div>Distribute Reward</div>
              ) : (
                <div className="flex justify-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
            </button>
          </div>
          <div className="">
            <div className="h-[40px] space-x-1 flex justify-between">
              <input
                className="w-[400px] bg-gray-100 h-full px-4 rounded-md text-gray-900 border-[1px]"
                placeholder="Amount"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
              />
              <button
                className="w-[200px] bg-gray-200 px-4 py-2 rounded-md text-gray-900 border-[1px] border-gray-900"
                onClick={despositToken}
              >
                {!depositLoading ? (
                  <div>Deposit</div>
                ) : (
                  <div className="flex justify-center">
                    <svg
                      class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                )}
              </button>
            </div>
            <div className="text-[12px] px-2 pt-2">
              {depositSuccess && depositSuccess}
            </div>
          </div>
          <div className="">
            <div className="h-[40px] space-x-1 flex justify-between">
              <div className="h-full space-x-1">
                <input
                  className="w-[294px] bg-gray-100 h-full px-4 rounded-md text-gray-900 border-[1px]"
                  placeholder="Wallet address"
                  value={walletAddressInput}
                  onChange={(e) => setWalletAddressInput(e.target.value)}
                />
                <input
                  className="w-[100px] bg-gray-100 h-full px-4 rounded-md text-gray-900 border-[1px]"
                  placeholder="Amount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                />
              </div>

              <button
                className="w-[200px] bg-gray-200 px-4 py-2 rounded-md text-gray-900 border-[1px] border-gray-900"
                onClick={transferToken}
              >
                {!transferLoading ? (
                  <div>Transfer</div>
                ) : (
                  <div className="flex justify-center">
                    <svg
                      class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                )}
              </button>
            </div>
            <div className="text-[12px] px-2 pt-2">
              {transferSuccess && transferSuccess}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="mt-8 pb-2 px-2 font-bold">Token Information</div>
        <div className="bg-gray-100 h-[200px] w-[700px] rounded-md ">
          <div className="p-4">
            <div className="flex flex-col space-y-1">
              <div className="inline">
                Contract Address:{" "}
                <p className="inline font-bold">{contractAddress}</p>
              </div>
              <div className="inline">
                Token: <p className="inline font-bold">{name}</p>
              </div>
              <div className="inline">
                Symbol: <p className="inline font-bold">{symbol}</p>
              </div>
              <div className="inline">
                Total Supply:{" "}
                <p className="inline font-bold">{totalSupply / 10 ** 18}</p>
              </div>
              <div className="inline">
                Reward Distribution:{" "}
                <p className="inline font-bold">
                  {rewardDistribution / 10 ** 18}
                </p>
              </div>
              <div className="inline">
                Deposit Count:{" "}
                <p className="inline font-bold">{depositCount / 10 ** 18}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenData;
