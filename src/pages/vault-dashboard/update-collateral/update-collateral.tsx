import { SyntheticEvent, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { updateCollateralAction, updateCollateralizationAction } from '../../../common/actions/vault.actions';
import { dotToPlanck, roundTwoDecimals } from '@interlay/polkabtc';
import { StoreType } from '../../../common/types/util.types';
import Big from 'big.js';
import ButtonMaybePending from '../../../common/components/pending-button';
import { useTranslation } from 'react-i18next';
import { ACCOUNT_ID_TYPE_NAME } from 'config/general';

// Commenting because moving this to last line causes 3 "used before it was defined" warnings
// eslint-disable-next-line import/exports-last
export enum CollateralUpdateStatus {
  Hidden,
  Increase,
  Decrease
}

type UpdateCollateralForm = {
  collateral: string;
};

type UpdateCollateralProps = {
  onClose: () => void;
  status: CollateralUpdateStatus;
};

export default function UpdateCollateralModal(props: UpdateCollateralProps): JSX.Element {
  const { polkaBtcLoaded, vaultClientLoaded, address } = useSelector((state: StoreType) => state.general);
  const { register, handleSubmit, errors } = useForm<UpdateCollateralForm>();
  // denoted in DOT
  const currentDOTCollateral = useSelector((state: StoreType) => state.vault.collateral);
  // denoted in DOT
  const [newCollateral, setNewCollateral] = useState('');
  // denoted in DOT
  const [currentCollateral, setCurrentCollateral] = useState('');
  const [newCollateralization, setNewCollateralization] = useState('∞');

  const [currentButtonText, setCurrentButtonText] = useState('');

  const [isUpdatePending, setUpdatePending] = useState(false);
  const [isCollateralUpdateAllowed, setCollateralUpdateAllowed] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onSubmit = handleSubmit(async () => {
    if (!polkaBtcLoaded) return;
    if (!vaultClientLoaded) return;

    setUpdatePending(true);
    try {
      const newCollateralBig = new Big(newCollateral);
      const currentCollateralBig = new Big(currentCollateral);

      if (currentCollateralBig.gt(newCollateralBig)) {
        const withdrawAmount = currentCollateralBig.sub(newCollateralBig);
        await window.polkaBTC.vaults.withdrawCollateral(withdrawAmount);
      } else if (currentCollateralBig.lt(newCollateralBig)) {
        const depositAmount = newCollateralBig.sub(currentCollateralBig);
        await window.polkaBTC.vaults.lockAdditionalCollateral(depositAmount);
      } else {
        closeModal();
        return;
      }

      const vaultId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
      const balanceLockedDOT = await window.polkaBTC.collateral.balanceLocked(vaultId);
      dispatch(updateCollateralAction(balanceLockedDOT.toString()));
      let collateralization;
      try {
        collateralization = new Big(parseFloat(newCollateralization) / 100);
      } catch {
        collateralization = undefined;
      }
      dispatch(updateCollateralizationAction(collateralization?.mul(100).toString()));

      toast.success(t('vault.successfully_updated_collateral'));
      closeModal();
    } catch (error) {
      toast.error(error.toString());
    }
    setUpdatePending(false);
  });

  const closeModal = () => {
    props.onClose();
    setNewCollateralization('');
  };

  const onChange = async (obj: SyntheticEvent) => {
    try {
      const value = (obj.target as HTMLInputElement).value;
      if (value === '' || !polkaBtcLoaded || Number(value) <= 0 || isNaN(Number(value)) || !vaultClientLoaded) {
        setCollateralUpdateAllowed(false);
        return;
      }

      if (!dotToPlanck(value)) {
        throw new Error('Please enter an amount greater than 1 Planck');
      }

      // decide if we withdraw or add collateral
      if (!currentDOTCollateral) {
        throw new Error('Couldn\'t fetch current vault collateral');
      }
      setCurrentCollateral(currentDOTCollateral);

      let newCollateral = new Big(currentDOTCollateral);
      if (props.status === CollateralUpdateStatus.Increase) {
        newCollateral = newCollateral.add(new Big(value));
      } else if (props.status === CollateralUpdateStatus.Decrease) {
        newCollateral = newCollateral.sub(new Big(value));
      }
      setNewCollateral(newCollateral.toString());

      const vaultId = window.polkaBTC.api.createType(ACCOUNT_ID_TYPE_NAME, address);
      const requiredCollateral = (await window.polkaBTC.vaults.getRequiredCollateralForVault(vaultId)).toString();

      // collateral update only allowed if above required collateral
      const allowed = newCollateral.gte(new Big(requiredCollateral));
      setCollateralUpdateAllowed(allowed);

      // get the updated collateralization
      const newCollateralization = await window.polkaBTC.vaults.getVaultCollateralization(vaultId, newCollateral);
      if (newCollateralization === undefined) {
        setNewCollateralization('∞');
      } else {
        // The vault API returns collateralization as a regular number rather than a percentage
        setNewCollateralization(newCollateralization.mul(100).toString());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getButtonVariant = (status: CollateralUpdateStatus): string => {
    switch (status) {
    case CollateralUpdateStatus.Increase:
      return 'outline-success';
    case CollateralUpdateStatus.Decrease:
      return 'outline-danger';
    default:
      return '';
    }
  };

  function getStatusText(status: CollateralUpdateStatus): string {
    switch (status) {
    case CollateralUpdateStatus.Increase:
      if (currentButtonText !== t('vault.increase_collateral')) {
        setCurrentButtonText(t('vault.increase_collateral'));
      }
      return t('vault.increase_collateral');
    case CollateralUpdateStatus.Decrease:
      if (currentButtonText !== t('vault.withdraw_collateral')) {
        setCurrentButtonText(t('vault.withdraw_collateral'));
      }
      return t('vault.withdraw_collateral');
    default:
      return currentButtonText || '';
    }
  }

  return (
    <Modal
      show={props.status !== CollateralUpdateStatus.Hidden}
      onHide={closeModal}>
      <form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{getStatusText(props.status)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='col-12 current-collateral'>
              {t('vault.current_total_collateral', { currentDOTCollateral })}
            </div>
            <div className='col-12'>
              {t('vault.update_collateral')}
            </div>
            <div className='col-12 basic-addon'>
              <div className='input-group'>
                <input
                  name='collateral'
                  type='float'
                  className={'form-control custom-input' + (errors.collateral ? ' error-borders' : '')}
                  aria-describedby='basic-addon2'
                  ref={register({
                    required: true,
                    min: 0
                  })}
                  onChange={onChange}>
                </input>
                <div className='input-group-append'>
                  <span
                    className='input-group-text'
                    id='basic-addon2'>
                    DOT
                  </span>
                </div>
              </div>
              {errors.collateral && (
                <div className='input-error'>
                  {errors.collateral.type === 'required' ?
                    t('vault.collateral_is_required') :
                    errors.collateral.message}
                  {errors.collateral.type === 'min' ? t('vault.collateral_higher_than_0') : errors.collateral.message}
                </div>
              )}
            </div>
            <div className='col-12'>
              {t('vault.new_collateralization')}
              {
                // eslint-disable-next-line no-negated-condition
                newCollateralization !== '∞' ?
                  Number(newCollateralization) > 1000 ?
                    ' more than 1000%' :
                    ' ' + roundTwoDecimals(newCollateralization || '0') + '%' :
                  ' ' + newCollateralization
              }
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className='row justify-center'>
          <ButtonMaybePending
            variant={getButtonVariant(props.status)}
            isPending={isUpdatePending}
            type='submit'
            disabled={!isCollateralUpdateAllowed}>
            {getStatusText(props.status)}
          </ButtonMaybePending>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
