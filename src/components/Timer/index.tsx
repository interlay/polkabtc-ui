
import * as React from 'react';

// TODO: should use a package like `date-fns` instead of manually calculating
const formatTime = (leftSeconds: number): string => {
  const days = Math.floor(leftSeconds / (3600 * 24));
  const hours = Math.floor((leftSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((leftSeconds % 3600) / 60);
  const seconds = Math.floor(leftSeconds % 60);
  const d = days;
  const h = hours < 10 ? '0' + hours : hours;
  const m = minutes < 10 ? '0' + minutes : minutes;
  const s = seconds < 10 ? '0' + seconds : seconds;
  return leftSeconds > 0 ? d + ' Days ' + h + ':' + m + ':' + s : '00:00:00';
};

interface Props {
  initialLeftSeconds: number;
}

const Timer = ({ initialLeftSeconds }: Props): JSX.Element => {
  const [leftSeconds, setLeftSeconds] = React.useState(initialLeftSeconds);

  React.useEffect(() => {
    // TODO: should use `useInterval`
    const timerId = setInterval(() => {
      setLeftSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return <span>{formatTime(leftSeconds)}</span>;
};

export default Timer;
