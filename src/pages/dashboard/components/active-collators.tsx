import { ReactElement } from 'react';
import ButtonComponent from './button-component';
import { getAccents } from '../dashboard-colors';
import LineChartComponent from './line-chart-component';
import { range } from '../../../common/utils/utils';
import { useTranslation } from 'react-i18next';
import { PAGES } from 'utils/constants/links';

const ActiveCollators = (): ReactElement => {
  const { t } = useTranslation();
  // this function should be removed once real data is pulled in
  const dateToMidnightTemp = (date: Date): Date => {
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    return date;
  };
  const displayLinkBtn = false;
  const data = [1, 1, 1, 1, 1];
  const dates = range(0, 5).map(i =>
    dateToMidnightTemp(new Date(Date.now() - 86400 * 1000 * i))
      .toISOString()
      .substring(0, 10)
  );
  return (
    <div className='card'>
      <div className='card-top-content'>
        <div className='values-container'>
          <h1 style={{ color: getAccents('d_blue').color }}>{t('dashboard.collators.active_collators')}</h1>
          <h2>1</h2>
        </div>
        {displayLinkBtn && (
          <div className='button-container'>
            <ButtonComponent
              buttonName='view collators'
              propsButtonColor='d_blue'
              buttonId='active-collators'
              buttonLink={PAGES.HOME} />
          </div>
        )}
      </div>
      <LineChartComponent
        color='d_blue'
        label={t('dashboard.collators.total_collators_chart') as string}
        yLabels={dates}
        yAxisProps={{ beginAtZero: true, precision: 0 }}
        data={data} />
    </div>
  );
};

export default ActiveCollators;
