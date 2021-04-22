import React from 'react';
import clsx from 'clsx';

const VARIANTS = Object.freeze({
  default: 'default',
  Disabled: 'disabled',
  Loading: 'loading'
});

const SIZES = Object.freeze({
  small: 'sm',
  medium: 'md',
  large: 'lg'
});

const COLORS = Object.freeze({
  default: 'default',
  success: 'success',
  danger: 'danger',
  primary: 'primary',
  secondary: 'secondary'
});

const VARIANT_VALUES = Object.values(VARIANTS);
const COLOR_VALUES = Object.values(COLORS);
const SIZE_VALUES = Object.values(SIZES);

interface CustomProps{
    variant?: typeof VARIANT_VALUES[number];
    color: typeof COLOR_VALUES[number];
    size: typeof SIZE_VALUES[number];
    id?:string;
    text:string;
}

const TestButton = ({
  variant = VARIANTS.default,
  color = COLORS.default,
  size = SIZES.small,
  className,
  id,
  text

}:CustomProps & React.ComponentPropsWithRef<'button'>): JSX.Element => (
  <button
    id={id}
    className={clsx(
      className,
      'px-4',
      { 'text-base': variant === VARIANTS.default },
      { 'py-2': size === SIZES.large },
      { 'bg-primary': color === COLORS.primary }
    )}>{text}
  </button>
);

export type Props = CustomProps & React.ComponentPropsWithRef<'button'>;
export default TestButton;
