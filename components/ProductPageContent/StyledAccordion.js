'use client';

import { useState } from 'react';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'next-i18next';
import * as Icon from 'react-feather';

import styles from './styles.module.scss';

import Share from './Share';
import SimilarSwiper from './SimilarSwiper';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  background: 'transparent',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<Icon.Play sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function Accordian({ details, product }) {
  const url = window.location.href;
  const [expanded, setExpanded] = useState('');
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const { t } = useTranslation();

  return (
    <div className={styles.accordian}>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
        className={styles.accordian}
      >
        <AccordionSummary
          className={styles.accordian__summary}
          aria-controls='panel1d-content'
          id='panel1d-header'
        >
          {t('product_details')}
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.accordian_grid}>
            <p>{details[0]}</p>
          </div>
        </AccordionDetails>
        <AccordionDetails className='scrollbar'>
          <table className={styles.specifications}>
            <thead>
              <tr>
                <th>{t('specifications')}</th>
                <th>{t('descriptions')}</th>
              </tr>
            </thead>
            <tbody>
              {details.slice(1, details.length).map((info, index) => (
                <tr key={index}>
                  <td>{info.name}</td>
                  <td>{info.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AccordionDetails>
      </Accordion>
      {/* accordion for questions */}
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
        className={styles.accordian}
      >
        <AccordionSummary
          className={styles.accordian__summary}
          aria-controls='panel1d-content'
          id='panel1d-header'
        >
          {t('faq')}
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.accordian_grid}>
            <p>{t('faq')}</p>
          </div>
        </AccordionDetails>
        <AccordionDetails className='scrollbar'>
          <table className={styles.specifications}>
            <thead>
              <tr>
                <th>{t('question')}</th>
                <th>{t('answer')}</th>
              </tr>
            </thead>

            <tbody>
              {product?.questions?.map((question, index) => (
                <tr key={index}>
                  <td>{question?.question}</td>
                  <td>{question?.answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AccordionDetails>
      </Accordion>

      {/* <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
        className={styles.accordian}
      >
        <AccordionSummary
          className={styles.accordian__summary}
          aria-controls='panel1d-content'
          id='panel1d-header'
        >
          Sizes & Fit
        </AccordionSummary>
        <AccordionDetails>
          <table className={styles.sizes}>
            <thead>
              <tr>
                <th scope='col'>Size</th>
                <th scope='col'>Chest</th>
                <th scope='col'>Neek</th>
                <th scope='col'>Sleev</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Small</td>
                <td>36-38&quot;</td>
                <td>14-14.5&quot;</td>
                <td>32.5&quot;</td>
              </tr>
              <tr>
                <td>Medium</td>
                <td>39-41&quot;</td>
                <td>15-15.5&quot;</td>
                <td>33.5&quot;</td>
              </tr>
              <tr>
                <td>Large</td>
                <td>42-44&quot;</td>
                <td>16-16.5&quot;</td>
                <td>34.5&quot;</td>
              </tr>
            </tbody>
          </table>
        </AccordionDetails>
      </Accordion> */}
      <Accordion
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
        className={styles.accordian}
      >
        <AccordionSummary
          className={styles.accordian__summary}
          aria-controls='panel3d-content'
          id='panel3d-header'
        >
          {t('share')}
        </AccordionSummary>

        <AccordionDetails>
          <div className={styles.button_wrapper}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(url);
                toast.success('Успешно скопирована ссылка продукта!');
              }}
            >
              <Icon.Copy /> {t('click_to_copy')}
            </button>
          </div>
        </AccordionDetails>
        <AccordionDetails className='scrollbar'>
          <div className={styles.socials_share}>
            <span>
              <Icon.Share /> {t('share_social')}
            </span>
          </div>
          <Share />
        </AccordionDetails>
      </Accordion>
      {/* <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
        className={styles.accordian}
      >
        <AccordionSummary
          className={styles.accordian__summary}
          aria-controls="panel4d-content"
          id="panel4d-header"
        >
          Similar products
        </AccordionSummary>

        <AccordionDetails className="scrollbar">
          <SimilarSwiper product={product} />
        </AccordionDetails>
      </Accordion> */}
    </div>
  );
}
