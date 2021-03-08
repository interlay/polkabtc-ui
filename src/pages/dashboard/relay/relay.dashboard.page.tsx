import { useState, useEffect, ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import usePolkabtcStats from '../../../common/hooks/use-polkabtc-stats';

import { defaultTableDisplayParams, formatDateTimePrecise } from '../../../common/utils/utils';
import { RelayedBlock } from '../../../common/types/util.types';
import DashboardTable, { StyledLinkData } from '../../../common/components/dashboard-table/dashboard-table';
import * as constants from '../../../constants';
import { getAccents } from '../dashboard-colors';
import BtcRelay from '../components/btc-relay';
import { reverseEndiannessHex, stripHexPrefix } from '@interlay/polkabtc';
import { BlockColumns } from '@interlay/polkabtc-stats';
import TimerIncrement from '../../../common/components/timer-increment';
// TODO: should fix by scoping only necessary CSS into a component
import '../dashboard.page.scss';
import '../dashboard-subpage.scss';

export default function RelayDashboard(): ReactElement {
  const statsApi = usePolkabtcStats();
  const { t } = useTranslation();

  // eslint-disable-next-line no-array-constructor
  const [blocks, setBlocks] = useState(new Array<RelayedBlock>());
  const [totalRelayedBlocks, setTotalRelayedBlocks] = useState(0);
  const [tableParams, setTableParams] = useState(defaultTableDisplayParams<BlockColumns>());

  const fetchBlocks = useMemo(
    () => async () => {
      try {
        const [blocks, totalRelayedBlocks] = await Promise.all([
          statsApi.getBlocks(tableParams.page, tableParams.perPage, tableParams.sortBy, tableParams.sortAsc),
          statsApi.getTotalRelayedBlocksCount()
        ]);
        setBlocks(blocks.data);
        setTotalRelayedBlocks(Number(totalRelayedBlocks.data));
      } catch (e) {
        console.error(e);
      }
    },
    [tableParams, statsApi]
  );

  const tableHeadings = [
    <h1>{t('dashboard.relay.block_height')}</h1>,
    <h1>{t('dashboard.relay.block_hash')}</h1>,
    <h1>{t('dashboard.relay.timestamp')}</h1>
  ];

  const tableBlockRow = useMemo(
    () => (block: RelayedBlock): ReactElement[] => [
      <p>{block.height}</p>,
      <StyledLinkData
        data={block.hash}
        target={
          (constants.BTC_MAINNET ? constants.BTC_EXPLORER_BLOCK_API : constants.BTC_TEST_EXPLORER_BLOCK_API) +
                    block.hash
        }
        newTab={true} />,
      <p>{formatDateTimePrecise(new Date(block.relay_ts))}</p>
    ],
    []
  );

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks, tableParams]);

  return (
    <div className='main-container'>
      <div className='dashboard-container dashboard-fade-in-animation'>
        <div className='dashboard-wrapper'>
          <div>
            <div className='title-container'>
              <h1 className='title-text'>{t('dashboard.relay.btcrelay')}</h1>
              <p className='latest-block-text'>
                <TimerIncrement></TimerIncrement>
              </p>
              <div
                style={{ backgroundColor: getAccents('d_yellow').color }}
                className='title-line'>
              </div>
            </div>
            <div className='dashboard-graphs-container'>
              <div className='relay-grid-container'>
                <BtcRelay displayBlockstreamData={true} />
              </div>
            </div>
            <div className='dashboard-table-container'>
              <div>
                <p className='table-heading'>{t('dashboard.relay.blocks')}</p>
              </div>
              <DashboardTable
                richTable={true}
                pageData={blocks.map(b => ({
                  ...b,
                  hash: reverseEndiannessHex(stripHexPrefix(b.hash)),
                  id: b.hash
                }))}
                totalPages={Math.ceil(totalRelayedBlocks / tableParams.perPage)}
                tableParams={tableParams}
                setTableParams={setTableParams}
                headings={tableHeadings}
                dataPointDisplayer={tableBlockRow} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
