import React, { useState, useEffect, ReactElement } from 'react';
import UpdateCollateralModal, { CollateralUpdateStatus } from './update-collateral/update-collateral';
import RequestReplacementModal from './request-replacement/request-replacement';
import { Button } from 'react-bootstrap';
import { StoreType } from '../../common/types/util.types';
import { useSelector, useDispatch } from 'react-redux';
import IssueTable from './issue-table/issue-table';
import RedeemTable from './redeem-table/redeem-table';
import ReplaceTable from './replace-table/replace-table';
import { satToBTC, planckToDOT } from '@interlay/polkabtc';
import {
  updateCollateralizationAction,
  updateCollateralAction,
  updateLockedBTCAction,
  updateSLAAction,
  updateAPYAction
} from '../../common/actions/vault.actions';
import './vault-dashboard.page.scss';
import { useTranslation } from 'react-i18next';
import { safeRoundTwoDecimals } from '../../common/utils/utils';
import TimerIncrement from '../../common/components/timer-increment';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
// TODO: should fix by scoping only necessary CSS into a component
import '../dashboard/dashboard-subpage.scss';
import { getAccents } from '../dashboard/dashboard-colors';
import { ACCOUNT_ID_TYPE_NAME } from '../../constants';

export default function VaultDashboardPage(): ReactElement {
  const [updateCollateralModalStatus, setUpdateCollateralModalStatus] = useState(CollateralUpdateStatus.Hidden);
  const [showRequestReplacementModal, setShowRequestReplacementModal] = useState(false);
  const { vaultClientLoaded, polkaBtcLoaded, address } = useSelector((state: StoreType) => state.general);
  const { collateralization, collateral, lockedBTC, sla, apy } = useSelector((state: StoreType) => state.vault);
  const [capacity, setCapacity] = useState('0');
  const [feesEarnedPolkaBTC, setFeesEarnedPolkaBTC] = useState('0');
  const [feesEarnedDOT, setFeesEarnedDOT] = useState('0');

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const closeUpdateCollateralModal = () => setUpdateCollateralModalStatus(CollateralUpdateStatus.Hidden);
  const closeRequestReplacementModal = () => setShowRequestReplacementModal(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!polkaBtcLoaded || !vaultClientLoaded || !address) return;

      try {
        const vaultId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);

        const [
          vault,
          feesPolkaSAT,
          feesPlanck,
          totalPolkaSAT,
          collateralization,
          slaScore,
          apyScore,
          issuablePolkaBTC
        ] = await Promise.allSettled([
          window.polkaBTC.vaults.get(vaultId),
          window.polkaBTC.vaults.getFeesPolkaBTC(vaultId),
          window.polkaBTC.vaults.getFeesDOT(vaultId),
          window.polkaBTC.vaults.getIssuedPolkaBTCAmount(vaultId),
          window.polkaBTC.vaults.getVaultCollateralization(vaultId),
          window.polkaBTC.vaults.getSLA(vaultId),
          window.polkaBTC.vaults.getAPY(vaultId),
          window.polkaBTC.vaults.getIssuablePolkaBTC()
        ]);

        // const balanceLockedDOT = await window.polkaBTC.collateral.balanceLockedDOT(vaultId);
        if (vault.status === 'fulfilled') {
          const collateralDot = planckToDOT(vault.value.backing_collateral.toString());
          dispatch(updateCollateralAction(collateralDot));
        }

        if (feesPolkaSAT.status === 'fulfilled') {
          setFeesEarnedPolkaBTC(satToBTC(feesPolkaSAT.value));
        }

        if (feesPlanck.status === 'fulfilled') {
          setFeesEarnedDOT(planckToDOT(feesPlanck.value));
        }

        const lockedAmountBTC = satToBTC(totalPolkaSAT.toString());
        dispatch(updateLockedBTCAction(lockedAmountBTC));

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
        console.log('Error getting vault data');
        console.log(error.message);
      }
    };
    fetchData();
  }, [polkaBtcLoaded, vaultClientLoaded, dispatch, address]);

  return (
    <MainContainer className='vault-dashboard-page'>
      <div className='vault-container dashboard-fade-in-animation dashboard-min-height'>
        <div className='stacked-wrapper'>
          <PageTitle
            mainTitle={t('vault.vault_dashboard')}
            subTitle={<TimerIncrement />} />
          <PageTitle
            mainTitle=''
            subTitle={address} />
        </div>

        <div className='vault-dashboard-buttons-container'>
          <div>
            <Button
              className='btn green-button app-btn vault-btn'
              onClick={() => setUpdateCollateralModalStatus(CollateralUpdateStatus.Increase)}>
              {t('vault.increase_collateral')}
            </Button>
          </div>
          <div>
            <Button
              className='btn red-button app-btn vault-btn'
              onClick={() => setUpdateCollateralModalStatus(CollateralUpdateStatus.Decrease)}>
              {t('vault.withdraw_collateral')}
            </Button>
          </div>
        </div>
        <div className='stats-grid-container'>
          <div
            className='stats-card'
            style={{ minHeight: '100px' }}>
            <div className='stats-title'>{t('vault.locked_collateral')}</div>
            <div
              className='stats'
              style={{ color: getAccents('d_pink').color }}>
              {safeRoundTwoDecimals(collateral)} DOT
            </div>
          </div>

          <div
            className='stats-card'
            style={{ minHeight: '100px' }}>
            <div className='stats-title'>{t('locked_btc')}</div>
            <div
              className='stats'
              style={{ color: getAccents('d_yellow').color }}>
              {lockedBTC} BTC
            </div>
          </div>

          <div
            className='stats-card'
            style={{ minHeight: '100px' }}>
            <div className='stats-title'>{t('collateralization')}</div>
            <div className='stats'>{`${safeRoundTwoDecimals(collateralization?.toString(), '∞')}%`}</div>
          </div>
          <div
            className='stats-card'
            style={{ minHeight: '100px' }}>
            <div className='stats-title'>{t('vault.capacity')}</div>
            <div
              className='stats'
              style={{ color: getAccents('d_pink').color }}>
              ~{safeRoundTwoDecimals(capacity)} PolkaBTC
            </div>
          </div>

          <div
            className='stats-card'
            style={{ minHeight: '100px' }}>
            <div className='stats-title'>{t('fees_earned')}</div>
            <div
              className='stats'
              style={{ color: getAccents('d_pink').color }}>
              {feesEarnedPolkaBTC.toString()} PolkaBTC
            </div>
          </div>
          <div
            className='stats-card'
            style={{ minHeight: '100px' }}>
            <div className='stats-title'>{t('fees_earned')}</div>
            <div
              className='stats'
              style={{ color: getAccents('d_pink').color }}>
              {feesEarnedDOT.toString()} DOT
            </div>
          </div>
          <div
            className='stats-card'
            style={{ minHeight: '100px' }}>
            <div className='stats-title'>{t('sla_score')}</div>
            <div className='stats'>{safeRoundTwoDecimals(sla)}</div>
          </div>
          <div
            className='stats-card'
            style={{ minHeight: '100px' }}>
            <div className='stats-title'>{t('apy')}</div>
            <span className='stats'>~{safeRoundTwoDecimals(apy)}%</span>
          </div>
        </div>
        <IssueTable></IssueTable>
        <RedeemTable></RedeemTable>
        <ReplaceTable openModal={setShowRequestReplacementModal}></ReplaceTable>
        <UpdateCollateralModal
          onClose={closeUpdateCollateralModal}
          status={updateCollateralModalStatus} />
        <RequestReplacementModal
          onClose={closeRequestReplacementModal}
          show={showRequestReplacementModal} />
      </div>
    </MainContainer>
  );
}
