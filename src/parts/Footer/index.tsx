import { useTranslation } from 'react-i18next';
import InterlayImage from 'components/InterlayImage';
import InterlayLink from 'components/InterlayLink';
import {
  POLKA_BTC_UI_GITHUB,
  WEB3_FOUNDATION,
  INTERLAY_COMPANY,
  INTERLAY_EMAIL,
  INTERLAY_DISCORD,
  INTERLAY_LINKEDIN,
  INTERLAY_MEDIUM,
  INTERLAY_GITHUB,
  POLKA_BTC_UI_GITHUB_ISSUES,
  INTERLAY_TWITTER,
  USER_FEEDBACK_FORM,
  VAULT_FEEDBACK_FORM,
  RELAYER_FEEDBACK_FORM,
  POLKA_BTC_DOC_TREASURE_HUNT,
  POLKA_BTC_DOC_TREASURE_HUNT_VAULT,
  POLKA_BTC_DOC_TREASURE_HUNT_RELAYER,
  GETTING_STARTED,
  VAULTS_DOCS,
  RELAYERS_DOCS,
  DEVELOPERS_DOCS,
  ROADMAP
} from 'config/links';
import styles from './footer.module.css';
// TODO: should use an SVG
import interlayImage from 'assets/img/interlay.png';
// TODO: should use next-gen format
import web3FoundationImage from 'assets/img/polkabtc/web3-foundation-grants-badge-black.png';

const packageJson = require('../../../package.json');

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles['footer']}>
      <div className={styles[`logos-container`]}>
        <InterlayLink
          href={INTERLAY_COMPANY}
          target='_blank'
          rel='noopener noreferrer'
          style={{ display: 'inline-block' }}>
          <InterlayImage
            src={interlayImage}
            width={150}
            height={40}
            alt='Interlay' />
        </InterlayLink>
        <div className={styles['padding-for-logo-2']}>
          <InterlayLink
            href={WEB3_FOUNDATION}
            target='_blank'
            rel='noopener noreferrer'
            style={{ display: 'inline-block' }}>
            <InterlayImage
              src={web3FoundationImage}
              width={150}
              height={50}
              alt='Web3 Foundation' />
          </InterlayLink>
        </div>
      </div>
      <div className={styles['grid-container']}>
        <div
          id='contact-container'
          className={styles['center-container']}>
          <div>
            <div className={styles['title']}>{t('footer.contact')}</div>
            <div className={styles['footer-items-container']}>
              <ul>
                <InterlayLink
                  href={INTERLAY_DISCORD}
                  target='_blank'
                  rel='noopener noreferrer'
                  data-placement='bottom'
                  data-original-title='Join our Discord channel'>
                  <li>Discord</li>
                </InterlayLink>
                <InterlayLink
                  href={INTERLAY_EMAIL}
                  target='_blank'
                  rel='noopener noreferrer'
                  data-placement='bottom'
                  data-original-title='Drop us an email'>
                  <li>Email</li>
                </InterlayLink>
              </ul>
            </div>
          </div>
        </div>
        <div
          id='challenges-container'
          className={styles['center-container']}>
          <div>
            <div className={styles['title']}>{t('footer.challenges')}</div>
            <div className={styles['footer-items-container']}>
              <ul>
                <InterlayLink
                  href={POLKA_BTC_DOC_TREASURE_HUNT}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <li>{t('footer.treasure_hunt')}</li>
                </InterlayLink>
                <InterlayLink
                  href={POLKA_BTC_DOC_TREASURE_HUNT_VAULT}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <li>{t('footer.vault_treasure')}</li>
                </InterlayLink>
                <InterlayLink
                  href={POLKA_BTC_DOC_TREASURE_HUNT_RELAYER}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <li>{t('footer.relayer_treasure')}</li>
                </InterlayLink>
              </ul>
            </div>
          </div>
        </div>
        <div
          id='feedback-container'
          className={styles['center-container']}>
          <div>
            <div className={styles['title']}>{t('footer.feedback')}</div>
            <div className={styles['footer-items-container']}>
              <ul>
                <InterlayLink
                  href={USER_FEEDBACK_FORM}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <li>{t('footer.user_feedback')}</li>
                </InterlayLink>
                <InterlayLink
                  href={VAULT_FEEDBACK_FORM}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <li>{t('footer.vault_feedback')}</li>
                </InterlayLink>
                <InterlayLink
                  href={RELAYER_FEEDBACK_FORM}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <li>{t('footer.relayer_feedback')}</li>
                </InterlayLink>
                <InterlayLink
                  href={POLKA_BTC_UI_GITHUB_ISSUES}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <li>{t('footer.open_issue')}</li>
                </InterlayLink>
                <InterlayLink
                  href={INTERLAY_DISCORD}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <li>{t('footer.discuss_discord')}</li>
                </InterlayLink>
              </ul>
            </div>
          </div>
        </div>
        <div
          id='docs-container'
          className={styles['center-container']}>
          <div>
            <div className={styles['title']}>{t('footer.docs')}</div>
            <div className={styles['footer-items-container']}>
              <ul>
                <InterlayLink
                  href={GETTING_STARTED}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <li>{t('footer.getting_started')}</li>
                </InterlayLink>
                <InterlayLink
                  href={VAULTS_DOCS}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <li>{t('footer.vaults_docs')}</li>
                </InterlayLink>
                <InterlayLink
                  href={RELAYERS_DOCS}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <li>{t('footer.Relayer_docs')}</li>
                </InterlayLink>
                <InterlayLink
                  href={DEVELOPERS_DOCS}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <li>{t('footer.developers')}</li>
                </InterlayLink>
                <InterlayLink
                  href={ROADMAP}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <li>{t('footer.roadmap')}</li>
                </InterlayLink>
              </ul>
            </div>
          </div>
        </div>
        <div
          id='contact-container'
          className={styles['center-container']}>
          <div>
            <div className={styles['title']}>{t('footer.follow_us')}</div>
            <div className={styles['footer-items-container']}>
              <ul>
                <InterlayLink
                  href={INTERLAY_TWITTER}
                  target='_blank'
                  rel='noopener noreferrer'
                  data-placement='bottom'
                  data-original-title='Follow us on Twitter'>
                  <li>Twitter</li>
                </InterlayLink>
                <InterlayLink
                  href={INTERLAY_MEDIUM}
                  target='_blank'
                  rel='noopener noreferrer'
                  data-placement='bottom'
                  data-original-title='Follow us on Medium'>
                  <li>Medium</li>
                </InterlayLink>
                <InterlayLink
                  href={INTERLAY_GITHUB}
                  target='_blank'
                  rel='noopener noreferrer'
                  data-placement='bottom'
                  data-original-title='Follow us on Github'>
                  <li>Github</li>
                </InterlayLink>
                <InterlayLink
                  href={INTERLAY_LINKEDIN}
                  target='_blank'
                  rel='noopener noreferrer'
                  data-placement='bottom'
                  data-original-title='Follow us on LinkedIn'>
                  <li>LinkedIn</li>
                </InterlayLink>
              </ul>
            </div>
          </div>
        </div>
        <div
          id='newsletter-container'
          className={styles['footer-items-container']}>
          <div>
            <div className={styles['title']}>{t('footer.newsletter')}</div>
            <ul>
              <li>
                <form
                  action='https://interlay.us4.list-manage.com/subscribe/post?u=4c3c3f21d3ec4c3ed94ea7353&amp;id=ad217abce9'
                  method='post'
                  id='mc-embedded-subscribe-form'
                  name='mc-embedded-subscribe-form'
                  className={styles['signup-container']}
                  target='_blank'>
                  <div id='mc_embed_signup_scroll'>
                    <div className='input-group'>
                      <input
                        type='email'
                        className={styles['newsletter-input']}
                        placeholder=' Enter email here'
                        name='EMAIL'
                        id='mce-EMAIL' />
                      <div>
                        <button
                          className={styles['newsletter-button']}
                          type='submit'
                          name='subscribe'
                          id='mc-embedded-subscribe'>
                          Subscribe
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </li>
              <li>
                <div className={styles['signup-text-container']}>
                  Join our newsletter to get updates about upcoming challenges and PolkaBTC news!
                </div>
              </li>
              <li>
                <div className={styles['rights-container']}>
                  <InterlayLink
                    href={POLKA_BTC_UI_GITHUB}
                    target='_blank'
                    rel='noopener noreferrer'>
                    v&nbsp;{packageJson.version}
                  </InterlayLink>
                  &nbsp;&#169; {new Date().getFullYear()} Interlay. All Rights Reserved
                </div>
                <li>
                  <InterlayLink
                    href='https://www.interlay.io/docs/privacy-policy.pdf'
                    target='_blank'
                    rel='noopener noreferrer'>
                    Read our privacy policy here
                  </InterlayLink>
                </li>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
