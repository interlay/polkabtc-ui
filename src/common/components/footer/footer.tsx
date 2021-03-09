import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
// import { Container, Image } from 'react-bootstrap';
// import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';
// import clsx from 'clsx';

// import interlayImg from 'assets/img/interlay.png';
// import web3FoundationImg from 'assets/img/polkabtc/web3 foundation_grants_badge_black.png';
import './footer.scss';

// const pkg = require('../../../../package.json');

export default function Footer():ReactElement {
  const { t } = useTranslation();

  return (
    <footer>
      <div className='footer-grid-container'>
        <div id='contact-container'>
          <div className='footer-title'>{t('footer.contact')}</div>
          <div className='footer-items-container'>
            <ul>
              <li>Twitter</li>
              <li>Discord</li>
              <li>Email</li>
            </ul>
          </div>
        </div>
        <div id='challenges-container'>
          <div className='footer-title'>{t('footer.challenges')}</div>
          <div className='footer-items-container'>
            <ul>
              <li>{t('footer.treasure_hunt')}</li>
              <li>{t('footer.vault_treasure')}</li>
              <li>{t('footer.relayer_treasure')}</li>
              <li>{t('footer.king_of_the_hill')}</li>
              <li>{t('footer.lottery')}</li>
            </ul>
          </div>
        </div>
        <div id='feedback-container'>
          <div className='footer-title'>{t('footer.feedback')}</div>
          <div className='footer-items-container'>
            <ul>
              <li>{t('footer.user_feedback')}</li>
              <li>{t('footer.vault_feedback')}</li>
              <li>{t('footer.relayer_feedback')}</li>
              <li>{t('footer.open_issue')}</li>
              <li>{t('footer.discuss_discord')}</li>
            </ul>
          </div>
        </div>
        <div id='feedback-container'>
          <div className='footer-title'>{t('footer.feedback')}</div>
          <div className='footer-items-container'>
            <ul>
              <li>{t('footer.user_feedback')}</li>
              <li>{t('footer.vault_feedback')}</li>
              <li>{t('footer.relayer_feedback')}</li>
              <li>{t('footer.open_issue')}</li>
              <li>{t('footer.discuss_discord')}</li>
            </ul>
          </div>
        </div>
        <div id='docs-container'>
          <div className='footer-title'>{t('footer.docs')}</div>
          <div className='footer-items-container'>
            <ul>
              <li>{t('footer.getting_started')}</li>
              <li>{t('footer.vaults_docs')}</li>
              <li>{t('footer.Relayer_docs')}</li>
              <li>{t('footer.developers')}</li>
              <li>{t('footer.roadmap')}</li>
            </ul>
          </div>
        </div>
        <div id='contact-container'>
          <div className='footer-title'>{t('footer.follow_us')}</div>
          <div className='footer-items-container'>
            <ul>
              <li>Twitter</li>
              <li>Telegram</li>
              <li>Medium</li>
              <li>Github</li>
              <li>LinkedIn</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

