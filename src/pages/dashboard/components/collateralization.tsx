import { useEffect, useState, ReactElement } from 'react';
import ButtonComponent from './button-component';
import { getAccents } from '../dashboard-colors';
import { useSelector } from 'react-redux';
import { StoreType } from '../../../common/types/util.types';
import { useTranslation } from 'react-i18next';
import { safeRoundTwoDecimals } from '../../../common/utils/utils';
import { PAGES } from 'utils/constants/links';
import DashboardCard from 'pages/dashboard/DashboardCard';

type CollateralizationProps = {
  linkButton?: boolean;
};

export default function Collateralization({ linkButton }: CollateralizationProps): ReactElement {
  const { t } = useTranslation();

  const [systemCollateralization, setSystemCollateralization] = useState('0');
  const [issuablePolkaBTC, setIssuablePolkaBTC] = useState('0');
  const [secureCollateralThreshold, setSecureCollateralThreshold] = useState('150');
  const [failed, setFailed] = useState(false);
  const polkaBtcLoaded = useSelector((state: StoreType) => state.general.polkaBtcLoaded);

  useEffect(() => {
    const fetchSystemCollateralization = async () => {
      if (!polkaBtcLoaded) return;
      try {
        const systemCollateralization = await window.polkaBTC.vaults.getSystemCollateralization();
        setSystemCollateralization(systemCollateralization?.mul(100).toString() || '0');
      } catch (error) {
        console.log('[Collateralization useEffect] error.message => ', error.message);
        setFailed(true);
      }
    };
    const fetchIssuableTokens = async () => {
      if (!polkaBtcLoaded) return;
      try {
        const issuablePolkaBTC = await window.polkaBTC.vaults.getIssuablePolkaBTC();
        setIssuablePolkaBTC(issuablePolkaBTC?.toString() || '0');
      } catch (error) {
        console.log('[Collateralization useEffect] error.message => ', error.message);
        setFailed(true);
      }
    };
    const fetchSecureCollateralThreshold = async () => {
      if (!polkaBtcLoaded) return;
      try {
        const secureCollateralThreshold = await window.polkaBTC.vaults.getSecureCollateralThreshold();
        setSecureCollateralThreshold(secureCollateralThreshold?.mul(100).toString() || '150');
      } catch (error) {
        console.log('[Collateralization useEffect] error.message => ', error.message);
        setFailed(true);
      }
    };
    fetchSystemCollateralization();
    fetchIssuableTokens();
    fetchSecureCollateralThreshold();
  });

  return (
    <DashboardCard>
      <div className='card-top-content'>
        <div className='values-container'>
          {!failed && (
            <>
              <h1 style={{ color: getAccents('d_blue').color }}>{t('dashboard.vault.collateralization')}</h1>
              <h2>{safeRoundTwoDecimals(systemCollateralization)}%</h2>
              <h2>
                {t('dashboard.vault.secure_threshold', {
                  threshold: safeRoundTwoDecimals(secureCollateralThreshold)
                })}
              </h2>
            </>
          )}
        </div>
        {linkButton && (
          <div className='button-container'>
            <ButtonComponent
              buttonName='view vaults'
              propsButtonColor='d_blue'
              buttonId='collateralization'
              buttonLink={PAGES.VAULTS} />
          </div>
        )}
      </div>
      <div className='circle-container'>
        <div
          className='status-circle'
          style={{ borderColor: getAccents('d_blue').color }}
          id='relay-circle'>
          <h1
            className='h1-xl-text-center'
            style={{ color: getAccents('d_blue').color }}>
            {failed ? t('no_data') :
              [
                issuablePolkaBTC === '0' ? t('loading') : safeRoundTwoDecimals(issuablePolkaBTC) + ' PolkaBTC',
                <br />, t('dashboard.vault.capacity')
              ]
            }
          </h1>
        </div>
      </div>
    </DashboardCard>
  );
}
