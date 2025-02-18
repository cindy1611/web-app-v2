import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'src/components/atoms/dropdown-v2/dropdown';
import { Header } from 'src/components/atoms/header/header';
import { AlertModal } from 'src/components/organisms/alert-modal';
import { BankAccounts } from 'src/components/templates/bank-accounts';
import { TopFixedMobile } from 'src/components/templates/top-fixed-mobile/top-fixed-mobile';
import { WithdrawMissions } from 'src/components/templates/withdraw-missions';
import { COUNTRIES } from 'src/constants/COUNTRIES';
import { printWhen } from 'src/core/utils';
import { useWalletShared } from 'src/pages/wallet/wallet.shared';

import css from './mobile.module.scss';

export const Mobile: React.FC = () => {
  const navigate = useNavigate();
  const {
    form,
    externalAccounts,
    formIsValid,
    generatedItems,
    totalMissions,
    total_count,
    openAlertModal,
    onCloseModal,
    respPayout,
    stripeLink,
    withdrawFund,
    loadMoreMissions,
    onSelectCountry,
    isDisablePayout,
  } = useWalletShared();

  return (
    <TopFixedMobile>
      <Header title="Wallet" onBack={() => navigate(-1)} />
      <div className={css.container}>
        {generatedItems?.map((item) => (
          <WithdrawMissions
            key={item.id}
            mission_name={item.project?.title}
            escrow={item.escrow}
            amount={item.amount}
            total={item.payout}
            fee={item.app_fee}
            service={item?.payment?.service}
            currency={item.offer.currency?.currency}
            disableText={
              item.escrow.release_id == null && isDisablePayout(item.escrow) ? 'You can payout after e few days' : ''
            }
            disbaledWithdraw={
              !externalAccounts?.length || item.escrow.release_id != null || isDisablePayout(item.escrow)
            }
            onClickWithdraw={() => withdrawFund(item.id)}
          />
        ))}
        <AlertModal
          open={openAlertModal}
          onClose={onCloseModal}
          header="Transfer Completed"
          status={respPayout.transaction_id ? 'success' : 'failed'}
          title="You successfully transferred."
          subtitle="Transaction id: "
          footer={respPayout?.transaction_id}
          buttons={[{ color: 'blue', children: 'Done', onClick: () => onCloseModal() }]}
        />
        {printWhen(
          <div className={css.load} onClick={loadMoreMissions}>
            load more...
          </div>,
          totalMissions < total_count,
        )}
        {printWhen(
          <Dropdown
            register={form}
            name="country"
            label="Country"
            placeholder="country"
            list={COUNTRIES}
            onValueChange={(selected) => onSelectCountry(selected.value as string)}
          />,
          !externalAccounts?.length,
        )}
        <BankAccounts
          accounts={externalAccounts}
          isDisabled={!formIsValid || externalAccounts?.length === 1}
          bankAccountLink={stripeLink}
        />
      </div>
    </TopFixedMobile>
  );
};
