import React, { useState, useEffect, ReactElement } from 'react';
import BitcoinTable from '../../common/components/bitcoin-table/bitcoin-table';
import StatusUpdateTable from '../../common/components/status-update-table/status-update-table';
import VaultTable from '../../common/components/vault-table/vault-table';
import OracleTable from '../../common/components/oracle-table/oracle-table';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import './staked-relayer.page.scss';
import { StoreType } from '../../common/types/util.types';
import ButtonMaybePending from '../../common/components/pending-button';
import { satToBTC, planckToDOT } from '@interlay/polkabtc';
import { useTranslation } from 'react-i18next';
import { safeRoundTwoDecimals } from '../../common/utils/utils';
import TimerIncrement from '../../common/components/timer-increment';
import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import { getAccents } from '../dashboard/dashboard-colors';

// TODO: should fix by scoping only necessary CSS into a component
import '../dashboard/dashboard-subpage.scss';
import { ACCOUNT_ID_TYPE_NAME } from '../../constants';

export default function StakedRelayerPage(): ReactElement {
  const [isDeregisterPending, setDeregisterPending] = useState(false);
  const [feesEarnedPolkaBTC, setFeesEarnedPolkaBTC] = useState('0');
  const [feesEarnedDOT, setFeesEarnedDOT] = useState('0');
  const [dotLocked, setDotLocked] = useState('0');
  const [planckLocked, setPlanckLocked] = useState('0');
  const [stakedRelayerAddress, setStakedRelayerAddress] = useState('');
  const [relayerInactive, setRelayerInactive] = useState(false);
  const [sla, setSLA] = useState(0);
  const [apy, setAPY] = useState('0');
  const { polkaBtcLoaded, relayerLoaded, address } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  const deregisterStakedRelayer = async () => {
    if (!relayerLoaded) return;
    setDeregisterPending(true);
    try {
      await window.polkaBTC.stakedRelayer.deregister();
      toast.success('Successfully Deregistered');
    } catch (error) {
      toast.error(error.toString());
    }
    setRelayerInactive(false);
    setDeregisterPending(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!polkaBtcLoaded || !relayerLoaded || !address) return;

      try {
        const stakedRelayerId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);

        const isInactive = await window.polkaBTC.stakedRelayer.isStakedRelayerInactive(stakedRelayerId);
        setRelayerInactive(isInactive);
        setStakedRelayerAddress(address);

        const lockedPlanck = (await window.polkaBTC.stakedRelayer.getStakedDOTAmount(stakedRelayerId)).toString();
        const lockedDOT = planckToDOT(lockedPlanck);

        const slaScore = await window.polkaBTC.stakedRelayer.getSLA(stakedRelayerId);
        setSLA(slaScore);

        const apyScore = await window.polkaBTC.stakedRelayer.getAPY(stakedRelayerId);
        setAPY(apyScore);

        const feesPolkaSAT = await window.polkaBTC.stakedRelayer.getFeesPolkaBTC(stakedRelayerId);
        setFeesEarnedPolkaBTC(satToBTC(feesPolkaSAT));

        const feesPlanck = await window.polkaBTC.stakedRelayer.getFeesDOT(stakedRelayerId);
        setFeesEarnedDOT(planckToDOT(feesPlanck));

        setDotLocked(lockedDOT);
        setPlanckLocked(lockedPlanck);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [polkaBtcLoaded, relayerLoaded, address, t]);

  return (
    <MainContainer className='staked-relayer-page'>
      <div className='staked-container dashboard-fade-in-animation dashboard-min-height'>
        <div className='stacked-wrapper'>
          <PageTitle
            mainTitle={t('relayer.staked_relayer_dashboard')}
            subTitle={<TimerIncrement />} />
          <PageTitle
            mainTitle=''
            subTitle={address} />
          {relayerLoaded && polkaBtcLoaded && (
            <div className='relayer-stats-grid-container'>
              <div
                className='stats-card'
                style={{ minHeight: '100px' }}>
                <div>{t('relayer.stake_locked')}</div>
                <div
                  className='stats'
                  style={{ color: getAccents('d_pink').color }}>
                  {dotLocked.toString()} DOT
                </div>
              </div>

              <div
                className='stats-card'
                style={{ minHeight: '100px' }}>
                <div>{t('fees_earned')}</div>
                <div
                  className='stats'
                  style={{ color: getAccents('d_pink').color }}>
                  {feesEarnedPolkaBTC} PolkaBTC
                </div>
              </div>
              <div
                className='stats-card'
                style={{ minHeight: '100px' }}>
                <div className='stats-title'>{t('fees_earned')}</div>
                <div
                  className='stats'
                  style={{ color: getAccents('d_pink').color }}>
                  {feesEarnedPolkaBTC} PolkaBTC
                </div>
              </div>
              <div
                className='stats-card'
                style={{ minHeight: '100px' }}>
                <div className='stats-title'>{t('fees_earned')}</div>
                <div
                  className='stats'
                  style={{ color: getAccents('d_pink').color }}>
                  {feesEarnedDOT} DOT
                </div>
              </div>
              <div
                className='stats-card'
                style={{ minHeight: '100px' }}>
                <div className='stats-title'>{t('sla_score')}</div>
                <span className='stats'>{safeRoundTwoDecimals(sla)}</span>
              </div>
              <div
                className='stats-card'
                style={{ minHeight: '100px' }}>
                <div className='stats-title'>{t('apy')}</div>
                <span className='stats'>~{safeRoundTwoDecimals(apy)} %</span>
              </div>
            </div>
          )}
          <BitcoinTable />
          <StatusUpdateTable
            dotLocked={dotLocked}
            planckLocked={planckLocked}
            stakedRelayerAddress={stakedRelayerAddress} />
          <VaultTable></VaultTable>
          <OracleTable planckLocked={planckLocked}></OracleTable>
          {relayerLoaded && (
            <React.Fragment>
              <ButtonMaybePending
                className='staked-button'
                variant='outline-danger'
                isPending={isDeregisterPending}
                disabled={relayerInactive || isDeregisterPending}
                onClick={deregisterStakedRelayer}>
                {t('relayer.deregister')}
              </ButtonMaybePending>
              <div className='row'>
                <div className='col-12 de-note'>{t('relayer.note_you_can_deregister')}</div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </MainContainer>
  );
}
