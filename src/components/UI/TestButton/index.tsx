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
  primary: 'primary',
  secondary: 'secondary'
});

const STATE_VALUES = Object.values(STATES);
const VARIANT_VALUES = Object.values(VARIANTS);
const COLOR_VALUES = Object.values(COLORS);
const SIZE_VALUES = Object.values(SIZES);

interface CustomProps{
    variant: typeof VARIANT_VALUES[number];
    color?: typeof COLOR_VALUES[number];
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
      // primary text and corners
      { 'text-xs rounded-md': size === SIZES.small && variant === VARIANTS.primary },
      { 'text-sm rounded-lg': size === SIZES.medium && variant === VARIANTS.primary },
      { 'text-base rounded-lg': size === SIZES.large && variant === VARIANTS.primary },
      // primary variant padding
      { 'px-4': size === SIZES.small && variant === VARIANTS.primary },
      { 'px-7': size === SIZES.medium && variant === VARIANTS.primary },
      { 'px-10': size === SIZES.large && variant === VARIANTS.primary },
      { 'py-2': size === SIZES.small && variant === VARIANTS.primary },
      { 'py-3': size === SIZES.medium && variant === VARIANTS.primary },
      { 'py-4': size === SIZES.large && variant === VARIANTS.primary },
      // primary variant colors
      { 'border border-primary': color === COLORS.primary && variant === VARIANTS.primary && state === STATES.default },
      { 'text-primary': color === COLORS.primary && variant === VARIANTS.primary && state === STATES.default },
      { 'hover:bg-primary-hoverLight': color === COLORS.primary &&
      variant === VARIANTS.primary && state === STATES.default },
      // primary variant disabled
      { 'border-gray-400': state === STATES.disabled && variant === VARIANTS.primary },
      { 'text-gray-400': state === STATES.disabled && variant === VARIANTS.primary },
      { 'bg-gray-50': state === STATES.disabled && variant === VARIANTS.primary }
    )}
    {...rest} />
);

export type Props = CustomProps & React.ComponentPropsWithRef<'button'>;
export default TestButton;
