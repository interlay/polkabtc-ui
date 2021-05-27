/** @jsxImportSource @emotion/react */

import clsx from 'clsx';
import tw, { TwStyle } from 'twin.macro';

interface Props {
  twStyle?: TwStyle;
}

const Card = ({
  twStyle,
  ...rest
}: Props & React.ComponentPropsWithRef<'li'>): JSX.Element => (
  <li
    // TODO: hardcoded
    style={{ minHeight: 90 }}
    css={[
      tw `flex`,
      tw `flex-col`,
      tw `justify-start`,
      tw `items-start`,
      tw `p-4`,
      tw `rounded-lg`,
      tw `bg-gray-100`,
      twStyle
    ]}
    {...rest} />
);

const CardHeader = ({
  className,
  children,
  ...rest
}: React.ComponentPropsWithRef<'h2'>): JSX.Element => (
  <h6
    className={clsx(
      'text-sm',
      'font-medium',
      'mb-2',
      className
    )}
    {...rest}>
    {children}
  </h6>
);

const CardContent = (props: React.ComponentPropsWithRef<'div'>): JSX.Element => (
  <div
    {...props} />
);

const CardList = ({
  className,
  ...rest
}: React.ComponentPropsWithRef<'ul'>): JSX.Element => (
  <ul
    className={clsx(
      'grid',
      className
    )}
    {...rest} />
);

export {
  Card,
  CardHeader,
  CardContent
};

export default CardList;
