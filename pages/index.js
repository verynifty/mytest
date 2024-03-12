import Head from 'next/head'

import { default as React, useState, useEffect, Suspense } from 'react';

import { getAccount } from '@wagmi/core';
import { useAccount } from 'wagmi';
import { useNetwork, useSwitchNetwork } from 'wagmi'

import Footer from '@/components/Footer'
import Header from '@/components/Header'

import Moment from 'react-moment';
import toast from 'react-hot-toast';

import AddressDisplay from 'components/render/addressDisplay';
import DisplayVariable from 'components/render/displayVariable';
import BlockNumber from 'components/render/blockNumber';
import SendTransaction from 'components/render/sendTransaction';
import Balance from 'components/render/balance';
import TokenBalance from 'components/render/tokenBalance';
import TokenAmount from 'components/render/tokenAmount';
import TokenName from 'components/render/tokenName';

import ContractRead from 'components/render/contractRead';
import ContractWrite from 'components/render/contractWrite';
import Events from 'components/render/events';
import WatchEvents from 'components/render/watchEvents';

import Uniswap from 'components/render/uniswap';
import APICall from 'components/render/apiCall';

import PleaseConnect from 'components/render/pleaseConnect';


const LIDO_ABI = [
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_referral",
        type: "address",
        hidden: true,
      },
    ],
    name: "submit",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
];

const LIDO_ADDRESS = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84";


import ERC20ABI from 'ABIS/ERC20.json';
import ERC721ABI from 'ABIS/ERC721.json';
import ERC1155ABI from 'ABIS/ERC1155.json';

const ABIs = { "ERC20": ERC20ABI, "ERC1155": ERC1155ABI, "ERC721": ERC721ABI }

const Page = (props) => {

  const tokenAddress = "0x90b8ff52b4dc225acf5c9a2409f92d1e062f39f3";
  const stakingAddress = "0xD8E17E787D88164A66Eca0Cdf3B9A74cEFa9FB05";
  const { address, isConnecting, isDisconnected } = useAccount()

  const [userAddress, setUserAddress] = React.useState(address);
  const [isCorrectChain, setIsCorrectChain] = React.useState(true);

  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()

  useEffect(() => {
    async function load() {
      setIsCorrectChain(!(chain != null && chain.id != chains[0].id));
      try {
        const account = await getAccount();
        setUserAddress(account.address);
      } catch (error) {
        console.error("There is an error loading the app", error);
      }
    }
    load();
  }, [address, chain]);

  function checkChain() {
    if (!isCorrectChain) {
      return <dialog id="approval_modal" className="modal modal-open">
        <form method="dialog" className="modal-box text-neutral">
          <h3 className="text-lg font-bold">Connect your wallet to {chains[0].name}</h3>
          <button onClick={() => switchNetwork(chains[0].id)} className="btn my-4">Click this to connect to {chains[0].name}</button>
        </form>
      </dialog>
    }
  }

  return (
    <>
      <Head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@3.1.1/dist/full.css" rel="stylesheet" type="text/css" />
      </Head>
      <Header />

      <Suspense>
        {checkChain()}
      </Suspense>
      <div>
        <div class="bg-white h-screen">
        
          <div class="p-20 ">

            <div >
              <p class="font-semibold text-xl ">LIDO Staking</p>
              <div class="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
                <dl class="flex flex-wrap">
                  <div class="flex-auto pl-6 pt-6">
                    <dt class="text-sm font-semibold leading-6 text-gray-900">You staked</dt>
                    <dd class="mt-1 text-base font-semibold leading-6 text-gray-900">
                      <ContractRead
                        address={LIDO_ADDRESS}
                        abi={ABIs.ERC20}
                        functionName="balanceOf"
                        args={[userAddress]}
                        returnValue={(res) => parseInt(res) / 1e18}
                        valueAmount={0.1} /> ETH
                    </dd>
                  </div>
                  <div class="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                    <dd class="text-sm font-light text-gray-400">Available to stake:</dd>
                    <dd class="text-sm font-medium leading-6 text-gray-900"><Balance
                      address={userAddress} /></dd>
                  </div>
                  <div class="mt-4 flex w-full flex-none gap-x-4 px-6 pb-2">
                    <dd class="text-sm font-light text-gray-400">Total staked on Lido:</dd>
                    <dd class="text-sm font-medium leading-6 text-gray-900"><ContractRead
                      address={LIDO_ADDRESS}
                      abi={LIDO_ABI}
                      functionName="totalSupply"
                      returnValue={(res) => (parseInt(res) / 1e18).toLocaleString()} /> ETH</dd>
                  </div>

                </dl>

              </div>
            </div>

            <div class="mt-10">
              <div class="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
                <div class="mt-6 border-t border-gray-900/5 px-6 py-6">
                  <div class="text-sm font-semibold leading-6 text-gray-900 mb-2">
                    Stake now
                  </div>
                  <ContractWrite
                    address={LIDO_ADDRESS}
                    abi={LIDO_ABI}
                    functionName="submit"
                    buttonText="Stake"
                    args={["0x6fBa46974b2b1bEfefA034e236A32e1f10C5A148"]}
                    valueFieldName="Amount of ETH to stake"
                    valueAmount="0.1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

    </>
  )
}

export default Page;
