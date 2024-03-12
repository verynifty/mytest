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


import ERC20ABI from 'ABIS/ERC20.json';
import ERC721ABI from 'ABIS/ERC721.json';
import ERC1155ABI from 'ABIS/ERC1155.json';

const ABIs ={ "ERC20": ERC20ABI, "ERC1155": ERC1155ABI, "ERC721": ERC721ABI }

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
          <button  onClick={() => switchNetwork(chains[0].id)} className="btn my-4">Click this to connect to {chains[0].name}</button>
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
        Your content goes here.
      </div>
      <Footer />

    </>
  )
}

export default Page;
