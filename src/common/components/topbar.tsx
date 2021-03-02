import React, { ReactElement, useEffect, useState } from 'react';
import polkaBTCLogo from '../../assets/img/polkabtc/PolkaBTC_black.png';
import { Navbar, Nav, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { StoreType } from '../types/util.types';
import ButtonMaybePending from './pending-button';
import { planckToDOT } from '@interlay/polkabtc';
import { updateBalanceDOTAction, showAccountModalAction } from '../actions/general.actions';
import { updateBalances } from '../utils/utils';
import { useTranslation } from 'react-i18next';
import Balances from './balances';
import iconExternalLink from '../../assets/img/icons/Icon-external-link.svg';

type TopbarProps = {
  address?: string;
  requestDOT: () => Promise<void>;
};

export default function Topbar(props: TopbarProps): ReactElement {
  const {
    extensions,
    address,
    relayerLoaded,
    vaultClientLoaded,
    polkaBtcLoaded,
    balanceDOT,
    balancePolkaBTC
  } = useSelector((state: StoreType) => state.general);
  const [isRelayerConnected, setIsRelayerConnected] = useState(false);
  const [isVaultConnected, setIsVaultConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!relayerLoaded || !vaultClientLoaded || !polkaBtcLoaded) {
      setTimeout(() => setIsLoading(false), 2500);
      return;
    }

    const checkIsConnected = async () => {
      const relayerConnected = await window.relayer.isConnected();
      const vaultConnected = await window.vaultClient.isConnected();
      setIsRelayerConnected(relayerConnected);
      setIsVaultConnected(vaultConnected);
      setIsLoading(false);
    };
    checkIsConnected();
  }, [relayerLoaded, vaultClientLoaded, polkaBtcLoaded]);

  useEffect(() => {
    const fetchData = async () => {
      if (!polkaBtcLoaded || address === '') return;

      updateBalances(dispatch, address, balanceDOT, balancePolkaBTC);
    };
    fetchData();
  }, [address, polkaBtcLoaded, dispatch, balanceDOT, balancePolkaBTC]);

  const requestDOT = async () => {
    if (!polkaBtcLoaded) return;
    setIsRequestPending(true);
    try {
      await props.requestDOT();
      const accountId = window.polkaBTC.api.createType('AccountId', address);
      const balancePLANCK = await window.polkaBTC.collateral.balanceDOT(accountId);
      const balanceDOT = planckToDOT(balancePLANCK.toString());
      dispatch(updateBalanceDOTAction(balanceDOT));
    } catch (error) {
      console.log(error);
    }
    setIsRequestPending(false);
  };

  const getLabel = (): string => {
    if (!extensions.length) return 'Connect Wallet';

    if (!address) return 'Select Account';

    return address.substring(0, 10) + '...' + address.substring(38);
  };

  return (
    <Navbar
      id='pbtc-topbar'
      bg='light'
      expand='lg'
      className='border-bottom  top-bar'>
      {!isLoading && (
        <React.Fragment>
          <Navbar.Brand>
            <Link
              id='main-logo'
              className='text-decoration-none'
              to='/'>
              <Image
                src={polkaBTCLogo}
                width='90'
                className='d-inline-block align-top'
                height='30'
                fluid />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='mr-auto'>
              {polkaBtcLoaded && (
                <Link
                  className='nav-link'
                  to='/app'>
                  {t('app')}
                </Link>
              )}
              {polkaBtcLoaded && (
                <Link
                  className='nav-link'
                  to='/dashboard'>
                  {t('nav_dashboard')}
                </Link>
              )}
              {isVaultConnected && (
                <Link
                  id='vault-nav-item'
                  className='nav-link'
                  to='/vault'>
                  {t('nav_vault')}
                </Link>
              )}
              {isRelayerConnected && (
                <Link
                  id='relayer-nav-item'
                  className='nav-link'
                  to='/staked-relayer'>
                  {t('nav_relayer')}
                </Link>
              )}
              {polkaBtcLoaded && (
                <Link
                  className='nav-link'
                  to='/leaderboard'>
                  {t('nav_leaderboard')}
                </Link>
              )}
              <Link
                className='nav-link'
                to='/feedback'>
                {t('feedback.feedback')}
              </Link>
              <a
                className='nav-link'
                href='https://docs.polkabtc.io/#/'
                target='_blank'
                rel='noopener noreferrer'>
                <div>
                  {t('nav_docs')}
                  <img
                    className='external-link-nav'
                    src={iconExternalLink}
                    alt='external-link' />
                </div>
              </a>
            </Nav>
            {props.address !== undefined && (
              <React.Fragment>
                {address === '' ? (
                  <Nav
                    id='account-button'
                    className='d-inline'>
                    <Button
                      variant='outline-account'
                      className='nav-faucet-button'
                      onClick={() => dispatch(showAccountModalAction(true))}>
                      {getLabel()}
                    </Button>
                  </Nav>
                ) : (
                  <React.Fragment>
                    <Nav
                      className='d-inline'>
                      <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://testnet-faucet.mempool.co/'>
                        <Button
                          variant='outline-bitcoin'
                          className='nav-faucet-button'>
                          {t('request_btc')}
                        </Button>
                      </a>
                      <ButtonMaybePending
                        variant='outline-polkadot'
                        className='nav-faucet-button'
                        isPending={isRequestPending}
                        onClick={requestDOT}>
                        {t('request_dot')}
                      </ButtonMaybePending>
                    </Nav>
                    <Balances
                      balanceDOT={balanceDOT}
                      balancePolkaBTC={balancePolkaBTC} />
                    <Nav
                      id='account-button'
                      className='d-inline'>
                      <Button
                        variant='outline-account'
                        className='nav-faucet-button'
                        onClick={() => dispatch(showAccountModalAction(true))}>
                        {getLabel()}
                      </Button>
                    </Nav>
                  </React.Fragment>
                )}

              </React.Fragment>
            )}
          </Navbar.Collapse>
        </React.Fragment>
      )}
    </Navbar>
  );
}
