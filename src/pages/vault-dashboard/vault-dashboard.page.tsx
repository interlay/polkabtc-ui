import React, { useState, useEffect, ReactElement } from 'react';
import RegisterVaultModal from './register-vault/register-vault';
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
  updateBTCAddressAction,
  updateCollateralizationAction,
  updateCollateralAction,
  updateLockedBTCAction,
  updateSLAAction,
  updateAPYAction
} from '../../common/actions/vault.actions';
import './vault-dashboard.page.scss';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { safeRoundTwoDecimals } from '../../common/utils/utils';
import TimerIncrement from '../../common/components/timer-increment';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
// TODO: should fix by scoping only necessary CSS into a component
import '../dashboard/dashboard-subpage.scss';
import { getAccents } from '../dashboard/dashboard-colors';
export default function VaultDashboardPage(): ReactElement {
  const [showRegisterVaultModal, setShowRegisterVaultModal] = useState(false);
  const [updateCollateralModalStatus, setUpdateCollateralModalStatus] = useState(CollateralUpdateStatus.Hidden);
  const [showRequestReplacementModal, setShowRequestReplacementModal] = useState(false);
  const { vaultClientLoaded, polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
  const { collateralization, collateral, lockedBTC, sla, apy } = useSelector((state: StoreType) => state.vault);
  const [capacity, setCapacity] = useState('0');
  const [feesEarnedPolkaBTC, setFeesEarnedPolkaBTC] = useState('0');
  const [feesEarnedDOT, setFeesEarnedDOT] = useState('0');
  const [vaultId, setVaultId] = useState('0');
  const [accountId, setAccountId] = useState('0');
  const [vaultRegistered, setVaultRegistered] = useState(false);
  const vaultNotRegisteredToastId = 'vault-not-registered-id';

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const closeRegisterVaultModal = () => setShowRegisterVaultModal(false);
  const closeUpdateCollateralModal = () => setUpdateCollateralModalStatus(CollateralUpdateStatus.Hidden);
  const closeRequestReplacementModal = () => setShowRequestReplacementModal(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!polkaBtcLoaded || !vaultClientLoaded) return;

      try {
        const accountId = await window.vaultClient.getAccountId();
        setAccountId(accountId);

        const vaultId = window.polkaBTC.api.createType('AccountId', accountId);
        const vault = await window.polkaBTC.vaults.get(vaultId);
        setVaultId(vault.id.toString());

        // show warning if vault is not registered with the parachain
        if (accountId !== vault.id.toString()) {
          toast.warn(
            'Local vault client running, but vault is not yet registered with the parachain.' +
              ' Client needs to be registered and DOT locked to start backing PolkaBTC and earning fees.',
            { autoClose: false, toastId: vaultNotRegisteredToastId }
          );
        }

        let vaultBTCAddress = vault.wallet.btcAddress;
        vaultBTCAddress = vaultBTCAddress ? vaultBTCAddress : '';
        dispatch(updateBTCAddressAction(vaultBTCAddress));

        const balanceLockedDOT = await window.polkaBTC.collateral.balanceLockedDOT(vaultId);
        const collateralDot = planckToDOT(balanceLockedDOT.toString());
        dispatch(updateCollateralAction(collateralDot));

        const feesPolkaSAT = await window.polkaBTC.vaults.getFeesPolkaBTC(vaultId);
        setFeesEarnedPolkaBTC(satToBTC(feesPolkaSAT));

        const feesPlanck = await window.polkaBTC.vaults.getFeesDOT(vaultId);
        setFeesEarnedDOT(planckToDOT(feesPlanck));

        const totalPolkaSAT = await window.polkaBTC.vaults.getIssuedPolkaBTCAmount(vaultId);
        const lockedAmountBTC = satToBTC(totalPolkaSAT.toString());
        dispatch(updateLockedBTCAction(lockedAmountBTC));

        const collateralization = await window.polkaBTC.vaults.getVaultCollateralization(vaultId);
        dispatch(updateCollateralizationAction(collateralization?.mul(100).toString()));

        const slaScore = await window.polkaBTC.vaults.getSLA(vaultId);
        dispatch(updateSLAAction(slaScore));

        const apyScore = await window.polkaBTC.vaults.getAPY(vaultId);
        dispatch(updateAPYAction(apyScore));

        const issuablePolkaBTC = await window.polkaBTC.vaults.getIssuablePolkaBTC();
        setCapacity(issuablePolkaBTC);
      } catch (err) {
        toast.error(err);
      }
    };
    fetchData();
  }, [polkaBtcLoaded, vaultClientLoaded, dispatch, vaultRegistered]);

  return (
    <MainContainer className='vault-dashboard-page'>
      <div className='vault-container dashboard-fade-in-animation dashboard-min-height'>
        <div className='stacked-wrapper'>
          <PageTitle
            mainTitle={t('vault.vault_dashboard')}
            subTitle={<TimerIncrement />} />
        </div>
        {vaultId === accountId && (
          <React.Fragment>
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
              <div>
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
          </React.Fragment>
        )}
        {vaultId !== accountId && (
          <Button
            variant='outline-success'
            className='register-vault-dashboard'
            onClick={() => setShowRegisterVaultModal(true)}>
            {t('register')}
          </Button>
        )}
        <IssueTable></IssueTable>
        <RedeemTable></RedeemTable>
        <ReplaceTable openModal={setShowRequestReplacementModal}></ReplaceTable>
        <RegisterVaultModal
          onClose={closeRegisterVaultModal}
          onRegister={() => setVaultRegistered(true)}
          show={showRegisterVaultModal} />
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
