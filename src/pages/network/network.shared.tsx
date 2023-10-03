import { useSelector } from 'react-redux';
import { IdentityReq } from 'src/core/types';
import { RootState } from 'src/store';

export const useNetworkShared = () => {
  const navigate = {};
  const identity = useSelector<RootState, IdentityReq>((state) => {
    return state.identity.entities.find((identity) => identity.current) as IdentityReq;
  });

  function navigateNetwork(path: string) {
    navigate({ to: `/network/${path}` });
  }

  return {
    navigateNetwork,
    identity,
  };
};
