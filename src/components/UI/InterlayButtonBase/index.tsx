
import clsx from 'clsx';

interface CustomProps {
  disabled?: boolean;
}

const InterlayButtonBase = ({
  disabled = false,
  className,
  children,
  ...rest
}: Props): JSX.Element => (
  <button
    className={clsx(
      'select-none',
      'focus:outline-none',
      'focus:ring',
      'focus:border-primary-300',
      'focus:ring-primary-200',
      'focus:ring-opacity-50',
      'transition-colors',
      'inline-flex',
      'items-center',
      'text-center',
      { 'pointer-events-none': disabled },
      className
    )}
    {...rest}>
    {children}
  </button>
);

export type Props = CustomProps & React.ComponentPropsWithRef<'button'>;

export default InterlayButtonBase;
