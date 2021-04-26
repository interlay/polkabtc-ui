import React from 'react';
import clsx from 'clsx';

const STATES = Object.freeze({
  default: 'default',
  disabled: 'disabled',
  Loading: 'loading'
});

const VARIANTS = Object.freeze({
  primary: 'primary',
  secondary: 'secondary'
});

const SIZES = Object.freeze({
  small: 'small',
  medium: 'medium',
  large: 'large'
});

const COLORS = Object.freeze({
  success: 'success',
  danger: 'danger',
  polkadotPink: 'polkadotPink',
  bitcoinYellow: 'bitcoinYellow'
});

const STATE_VALUES = Object.values(STATES);
const VARIANT_VALUES = Object.values(VARIANTS);
const COLOR_VALUES = Object.values(COLORS);
const SIZE_VALUES = Object.values(SIZES);

interface CustomProps{
    variant: typeof VARIANT_VALUES[number];
    color: typeof COLOR_VALUES[number];
    size: typeof SIZE_VALUES[number];
    state?: typeof STATE_VALUES[number];
}

const TestButton = ({
  state = STATES.default,
  variant = VARIANTS.primary,
  color,
  size,
  className,
  ...rest
}:CustomProps & React.ComponentPropsWithRef<'button'>): JSX.Element => (
  <button
    className={clsx(
      className,
      // primary variant base
      { 'font-medium uppercase': variant === VARIANTS.primary },
      // primary variant text, corners and padding
      { 'text-xs rounded-md px-4 py-2': size === SIZES.small && variant === VARIANTS.primary },
      { 'text-sm rounded-lg px-7 py-3': size === SIZES.medium && variant === VARIANTS.primary },
      { 'text-base rounded-lg px-10 py-4': size === SIZES.large && variant === VARIANTS.primary },
      // primary variant colors
      { 'border border-primary': color === COLORS.polkadotPink &&
      variant === VARIANTS.primary && state === STATES.default },
      { 'text-primary': color === COLORS.polkadotPink && variant === VARIANTS.primary && state === STATES.default },
      { 'hover:bg-primary-hoverLight': color === COLORS.polkadotPink &&
      variant === VARIANTS.primary && state === STATES.default },
      // primary variant disabled
      { 'border-gray-400 text-gray-400 bg-gray-50': state === STATES.disabled && variant === VARIANTS.primary },
      // secondary variant text, corners and padding
      { 'text-xs rounded px-2 py-1': size === SIZES.small && variant === VARIANTS.secondary },
      { 'text-xs rounded px-2 py-1': size === SIZES.medium && variant === VARIANTS.secondary },
      { 'text-sm rounded-lg px-4 py-2': size === SIZES.large && variant === VARIANTS.secondary }
    )}
    {...rest} />
);

export type Props = CustomProps & React.ComponentPropsWithRef<'button'>;
export default TestButton;
