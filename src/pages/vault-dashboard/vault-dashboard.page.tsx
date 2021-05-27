
import React, {
  useState,
  useEffect
} from 'react';
import { Button } from 'react-bootstrap';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import {
  planckToDOT
} from '@interlay/polkabtc';
import { useTranslation } from 'react-i18next';

import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import TimerIncrement from 'parts/TimerIncrement';
import CardList, {
  Card,
  CardHeader,
  CardContent
} from 'components/CardList';
import BoldParagraph from 'components/BoldParagraph';
import UpdateCollateralModal, { CollateralUpdateStatus } from './update-collateral/update-collateral';
import RequestReplacementModal from './request-replacement/request-replacement';
import ReplaceTable from './replace-table/replace-table';
import { StoreType } from 'common/types/util.types';
import { safeRoundTwoDecimals, displayBtcAmount, safeRoundFiveDecimals } from 'common/utils/utils';
import {
  updateCollateralizationAction,
  updateCollateralAction,
  updateLockedBTCAction,
  updateSLAAction,
  updateAPYAction
} from 'common/actions/vault.actions';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';
import './vault-dashboard.page.scss';
import VaultIssueRequestsTable from 'containers/VaultIssueRequestTable';
import VaultRedeemRequestsTable from 'containers/VaultRedeemRequestTable';
import usePolkabtcStats from 'common/hooks/use-polkabtc-stats';
import { IssueColumns, RedeemColumns } from '@interlay/polkabtc-stats';

function VaultDashboard(): JSX.Element {
  const [updateCollateralModalStatus, setUpdateCollateralModalStatus] = useState(CollateralUpdateStatus.Hidden);
  const [showRequestReplacementModal, setShowRequestReplacementModal] = useState(false);
  const {
    vaultClientLoaded,
    polkaBtcLoaded,
    address
  } = useSelector((state: StoreType) => state.general);
  const {
    collateralization,
    collateral,
    lockedBTC,
    sla,
    apy
  } = useSelector((state: StoreType) => state.vault);
  const [capacity, setCapacity] = useState('0');
  const [feesEarnedPolkaBTC, setFeesEarnedPolkaBTC] = useState('0');
  const [feesEarnedDOT, setFeesEarnedDOT] = useState('0');
  const [totalIssueRequests, setTotalIssueRequests] = useState(0);
  const [totalRedeemRequests, setTotalRedeemRequests] = useState(0);

  const dispatch = useDispatch();
  const stats = usePolkabtcStats();
  const { t } = useTranslation();

  const closeUpdateCollateralModal = () => setUpdateCollateralModalStatus(CollateralUpdateStatus.Hidden);
  const closeRequestReplacementModal = () => setShowRequestReplacementModal(false);

  useEffect(() => {
    (async () => {
      if (!polkaBtcLoaded) return;
      if (!vaultClientLoaded) return;
      if (!address) return;

      try {
        const vaultId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
        const [
          vault,
          feesPolkaBTC,
          feesDOT,
          lockedAmountBTC,
          collateralization,
          slaScore,
          apyScore,
          issuablePolkaBTC,
          totalIssueRequests,
          totalRedeemRequests
        ] = await Promise.allSettled([
          window.polkaBTC.vaults.get(vaultId),
          window.polkaBTC.vaults.getFeesWrapped(vaultId),
          window.polkaBTC.vaults.getFeesCollateral(vaultId),
          window.polkaBTC.vaults.getIssuedAmount(vaultId),
          window.polkaBTC.vaults.getVaultCollateralization(vaultId),
          window.polkaBTC.vaults.getSLA(vaultId),
          window.polkaBTC.vaults.getAPY(vaultId),
          window.polkaBTC.vaults.getIssuablePolkaBTC(),
          stats.getFilteredTotalIssues([{ column: IssueColumns.VaultId, value: address }]),
          stats.getFilteredTotalRedeems([{ column: RedeemColumns.VaultId, value: address }])
        ]);

        if (vault.status === 'fulfilled') {
          const collateralDot = planckToDOT(vault.value.backing_collateral.toString());
          dispatch(updateCollateralAction(collateralDot));
        }

        if (feesPolkaBTC.status === 'fulfilled') {
          setFeesEarnedPolkaBTC(feesPolkaBTC.value.toString());
        }

        if (feesDOT.status === 'fulfilled') {
          setFeesEarnedDOT(feesDOT.value.toString());
        }

        if (totalIssueRequests.status === 'fulfilled') {
          setTotalIssueRequests(totalIssueRequests.value.data);
        }

        if (totalRedeemRequests.status === 'fulfilled') {
          setTotalRedeemRequests(totalRedeemRequests.value.data);
        }

        if (lockedAmountBTC.status === 'fulfilled') {
          dispatch(updateLockedBTCAction(lockedAmountBTC.value.toString()));
        }

        if (collateralization.status === 'fulfilled') {
          dispatch(updateCollateralizationAction(collateralization.value?.mul(100).toString()));
        }

        if (slaScore.status === 'fulfilled') {
          dispatch(updateSLAAction(slaScore.value));
        }

        if (apyScore.status === 'fulfilled') {
          dispatch(updateAPYAction(apyScore.value));
        }

        if (issuablePolkaBTC.status === 'fulfilled') {
          setCapacity(issuablePolkaBTC.value);
        }
      } catch (error) {
        console.log('[VaultDashboard useEffect] error.message => ', error.message);
      }
    })();
  }, [
    polkaBtcLoaded,
    vaultClientLoaded,
    dispatch,
    address,
    stats
  ]);

  const VAULT_ITEMS = [
    {
      title: t('collateralization'),
      value: `${safeRoundTwoDecimals(collateralization?.toString(), '∞')}%`,
      color: 'interlayDodgerBlue-800'
    }, {
      title: t('vault.fees_earned_polkabtc'),
      value: displayBtcAmount(feesEarnedPolkaBTC),
      color: 'interlayRose-800'
    },
    {
      title: t('vault.fees_earned_dot'),
      value: safeRoundFiveDecimals(feesEarnedDOT),
      color: 'interlayRose-800'
    },
    {
      title: t('sla_score'),
      value: safeRoundTwoDecimals(sla),
      color: 'interlayDodgerBlue-800'
    }, {
      title: t('vault.locked_dot'),
      value: safeRoundFiveDecimals(collateral),
      color: 'interlayRose-800'
    },
    {
      title: t('locked_btc'),
      value: displayBtcAmount(lockedBTC),
      color: 'interlayTreePoppy-700'
    }, {
      title: t('vault.remaining_capacity'),
      value: displayBtcAmount(capacity),
      color: 'interlayRose-800'
    },
    {
      title: t('apy'),
      value: `~${safeRoundTwoDecimals(apy)}`,
      color: 'interlayDodgerBlue-800'
    }
  ];

  return (
    <MainContainer className='vault-dashboard-page'>
      <div className='fade-in-animation'>
        <div className='stacked-wrapper'>
          <PageTitle
            mainTitle={t('vault.vault_dashboard')}
            subTitle={<TimerIncrement />} />
          <BoldParagraph>{address}</BoldParagraph>
        </div>
        <>
          {/* The below components are used in Challenges page, css changes will affect accordingly */}
          <CardList className='grid-cols-3 lg:grid-cols-4 gap-5 2xl:gap-6'>
            {VAULT_ITEMS.map(vaultItem => (
              <Card
                key={`${vaultItem.title}`}>
                <CardHeader className={`text-${vaultItem.color}`}>
                  {vaultItem.title}
                </CardHeader>
                <CardContent className='text-2xl font-medium'>
                  <div>
                    {vaultItem.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardList>
          <div className='flex justify-center space-x-10 mt-10'>
            <Button
              variant='outline-success'
              // TODO: should not use inlined functions
              onClick={() => setUpdateCollateralModalStatus(CollateralUpdateStatus.Increase)}>
              {t('vault.deposit_collateral')}
            </Button>
            <Button
              variant='outline-danger'
              onClick={() => setUpdateCollateralModalStatus(CollateralUpdateStatus.Decrease)}>
              {t('vault.withdraw_collateral')}
            </Button>
          </div>
        </>
        <div className='mt-20'>
          <VaultIssueRequestsTable
            totalIssueRequests={totalIssueRequests}
            vaultAddress={address} />
          <VaultRedeemRequestsTable
            totalRedeemRequests={totalRedeemRequests}
            vaultAddress={address} />
          <ReplaceTable openModal={setShowRequestReplacementModal} />
          <UpdateCollateralModal
            onClose={closeUpdateCollateralModal}
            status={updateCollateralModalStatus} />
          <RequestReplacementModal
            onClose={closeRequestReplacementModal}
            show={showRequestReplacementModal} />
        </div>
      </div>
    </MainContainer>
  );
}

export default VaultDashboard;
