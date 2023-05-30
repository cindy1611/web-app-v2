import { useEffect, useState } from 'react';
import Dapp from 'src/dapp';
import { Item } from 'src/components/molecules/input-modal/input-modal.types';
import { ControlPrimitiveValue } from 'src/core/form/useForm/useForm.types';
import { findTokenRate } from './offer.services';

export const useOfferShared = () => {
  const { web3 } = Dapp.useWeb3();
  const [openModal, setOpenModal] = useState(false);
  const [tokens, setTokens] = useState<Item[]>([]);
  const [selectedToken, setSelectedToken] = useState<{ address: string; symbol?: string }>();
  const [tokenRate, setTokenRate] = useState(1);

  useEffect(() => {
    const getTokens = async () => {
      if (web3) {
        const chainId = await web3.eth.getChainId();
        const selectedNetwork = Dapp.NETWORKS.filter((n) => n.chain.id === chainId)[0];
        const mapTokens = selectedNetwork.tokens.map((token) => {
          return {
            value: token.address,
            title: token.name,
            subtitle: token.symbol,
          };
        });
        setTokens(mapTokens);
        const { rate } = await findTokenRate(mapTokens[0].value);
        setTokenRate(rate);
      }
    };
    getTokens();
  }, [web3]);

  function onSelectTokens({ value, subtitle }: Item) {
    setSelectedToken({ address: value, symbol: subtitle });
    setOpenModal(false);
    findTokenRate(value).then(({ rate }) => setTokenRate(rate));
  }

  function equivalentUSD(amount: ControlPrimitiveValue) {
    return Math.round((Number(amount) / tokenRate) * 100) / 100;
  }

  return {
    tokens,
    openModal,
    setOpenModal,
    selectedToken,
    onSelectTokens,
    equivalentUSD,
    web3,
  };
};
