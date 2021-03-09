
import {
  useState,
  useEffect,
  ReactElement,
  useMemo
} from 'react';
import { useSelector } from 'react-redux';
import {
  Tab,
  Tabs
} from 'react-bootstrap';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import {
  RelayerData,
  VaultData
} from '@interlay/polkabtc-stats';

import MainContainer from 'parts/MainContainer';
import PageTitle from 'parts/PageTitle';
import InterlayImage from 'components/InterlayImage';
import InterlayLink from 'components/InterlayLink';
import CardList, {
  Card,
  CardHeader,
  CardBody
} from 'components/CardList';
import { POLKA_BTC_DOC_TREASURE_HUNT } from 'config/links';
import DashboardTable from 'common/components/dashboard-table/dashboard-table';
import TimerIncrement from 'common/components/timer-increment';
import usePolkabtcStats from 'common/hooks/use-polkabtc-stats';
import { StoreType } from 'common/types/util.types';
// TODO: should use an SVG
import newMark from 'assets/img/icons/new-mark.png';
import 'pages/dashboard/dashboard-subpage.scss';
import './challenges.scss';

const CHALLENGE_ITEMS = [
  {
    title: 'leaderboard.challenges.treasure_hunt',
    titleIcon: (
      <InterlayImage
        src={newMark}
        width={20}
        height={20}
        alt='new' />
    ),
    content: 'leaderboard.challenges.treasure_hunt_desc',
    contentLink: POLKA_BTC_DOC_TREASURE_HUNT
  },
  {
    title: 'leaderboard.challenges.vault_treasure_hunt',
    content: 'leaderboard.challenges.vault_treasure_hunt_desc'
  },
  {
    title: 'leaderboard.challenges.relayer_treasure_hunt',
    content: 'leaderboard.challenges.relayer_treasure_hunt_desc'
  },
  {
    title: 'leaderboard.challenges.vaults_relayers',
    content: 'leaderboard.challenges.vaults_relayers_desc'
  },
  {
    title: 'leaderboard.challenges.lottery',
    content: 'leaderboard.challenges.lottery_desc'
  }
];

function Challenges(): ReactElement {
  // eslint-disable-next-line no-array-constructor
  const [vaultRows, setVaultRows] = useState(new Array<VaultData>());
  // eslint-disable-next-line no-array-constructor
  const [relayerRows, setRelayerRows] = useState(new Array<RelayerData>());

  const statsApi = usePolkabtcStats();
  const { polkaBtcLoaded } = useSelector((state: StoreType) => state.general);
  const { t } = useTranslation();

  const vaultTableHeadings = [
    <h1>{t('leaderboard.account_id')}</h1>,
    <h1>{t('leaderboard.collateral')}</h1>,
    <h1>{t('leaderboard.request_issue_count')}</h1>,
    <h1>{t('leaderboard.execute_issue_count')}</h1>,
    <h1>{t('leaderboard.request_redeem_count')}</h1>,
    <h1>{t('leaderboard.execute_redeem_count')}</h1>,
    <h1>{t('leaderboard.lifetime_sla')}</h1>
  ];

  // TODO:
  // - exclude Interlay owned vaults
  // - sort vaults with highest lifetime sla
  const tableVaultRow = useMemo(
    () => (row: VaultData): ReactElement[] => [
      <p>{row.id}</p>,
      <p>{row.collateral} DOT</p>,
      <p>{row.request_issue_count}</p>,
      <p>{row.execute_issue_count}</p>,
      <p>{row.request_redeem_count}</p>,
      <p>{row.execute_redeem_count}</p>,
      <p>{Number(row.lifetime_sla).toFixed(2)}</p>
      // lifetime_sla is a string despite schema being "number"
      // TODO: check how Axios/openapi-generator handle typings, and if necessary
      // convert stats API data types to `string` to avoid confusion
    ],
    []
  );

  const relayerTableHeadings = [
    <h1>{t('leaderboard.account_id')}</h1>,
    <h1>{t('leaderboard.stake')}</h1>,
    <h1>{t('leaderboard.block_count')}</h1>,
    <h1>{t('leaderboard.lifetime_sla')}</h1>
  ];

  // TODO:
  // - exclude Interlay owned relayers
  // - sort relayers with highest lifetime sla
  const tableRelayerRow = useMemo(
    () => (row: RelayerData): ReactElement[] => [
      <p>{row.id}</p>,
      <p>{row.stake} DOT</p>,
      <p>{row.block_count}</p>,
      <p>{Number(row.lifetime_sla).toFixed(2)}</p>
    ],
    []
  );

  useEffect(() => {
    const fetchVaultData = async () => {
      if (!polkaBtcLoaded) return;
      const vaults = (await statsApi.getVaults()).data;
      setVaultRows(vaults.sort((a, b) => b.lifetime_sla - a.lifetime_sla));
    };

    const fetchRelayerData = async () => {
      if (!polkaBtcLoaded) return;
      const relayers = (await statsApi.getRelayers()).data;
      setRelayerRows(relayers.sort((a, b) => b.lifetime_sla - a.lifetime_sla));
    };

    fetchVaultData();
    fetchRelayerData();
  }, [polkaBtcLoaded, statsApi, t]);

  return (
    <MainContainer>
      <div className='dashboard-container dashboard-fade-in-animation dashboard-min-height'>
        <div className='dashboard-wrapper'>
          <PageTitle mainTitle={t('leaderboard.challenges_title')} />
          <CardList>
            {CHALLENGE_ITEMS.map(cardItem => (
              <Card key={cardItem.title}>
                <CardHeader>
                  {t(cardItem.title)}
                  {cardItem.titleIcon}
                </CardHeader>
                <CardBody>
                  {t(cardItem.content)}
                  {cardItem.contentLink && (
                    <InterlayLink
                      href={cardItem.contentLink}
                      target='_blank'
                      rel='noopener noreferrer'>
                      &nbsp;
                      {t('leaderboard.more_info')}
                      &nbsp;
                      <FaExternalLinkAlt />
                    </InterlayLink>
                  )}
                </CardBody>
              </Card>
            ))}
          </CardList>
          <PageTitle
            mainTitle={t('leaderboard.title')}
            subTitle={<TimerIncrement />} />
          {/* TODO: should use a tailwindcss Tabs component */}
          <Tabs>
            <Tab
              eventKey='vaults'
              title={t('leaderboard.vault_scores')}>
              {/* TODO: should use a good table package */}
              <div style={{ margin: '40px 0px' }}>
                <DashboardTable
                  pageData={vaultRows}
                  headings={vaultTableHeadings}
                  dataPointDisplayer={tableVaultRow}
                  noDataEl={<td colSpan={6}>{t('loading_ellipsis')}</td>} />
              </div>
            </Tab>
            <Tab
              eventKey='relayers'
              title={t('leaderboard.relayer_scores')}>
              <div style={{ margin: '40px 0px' }}>
                <DashboardTable
                  pageData={relayerRows}
                  headings={relayerTableHeadings}
                  dataPointDisplayer={tableRelayerRow}
                  noDataEl={<td colSpan={6}>{t('loading_ellipsis')}</td>} />
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </MainContainer>
  );
}

export default Challenges;
