import React, { ReactElement } from 'react';
import BitcoinLogo from '../../assets/img/small-bitcoin-logo.png';
import PolkadotLogo from '../../assets/img/small-polkadot-logo.png';
type BalancesProps = {
  balancePolkaBTC?: string;
  balanceDOT?: string;
};

export default function Balances(props: BalancesProps): ReactElement {
  return (
    <div>
      <span className='btc-balance-wrapper'>
        <img
          src={BitcoinLogo}
          className='nav-bar-currency-margin'
          width='20px'
          height='20px'
          alt='bitcoin logo'>
        </img>
        <span className=''>
          <b>{props.balancePolkaBTC || '0'}</b>
        </span>{' '}
        PolkaBTC
      </span>
      <span className='dot-balance-wrapper'>
        <img
          src={PolkadotLogo}
          className='nav-bar-currency-margin'
          width='18px'
          height='18px'
          alt='polkadot logo'>
        </img>
        <span className=''>
          <b>{props.balanceDOT || '0'}</b>
        </span>{' '}
        DOT
      </span>

    </div>
  );
}
