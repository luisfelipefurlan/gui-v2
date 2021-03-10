import React, { useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import i18n from 'common/i18n/i18n';

import { useStyles } from './ChangeLanguage';

const ChangeLanguage = () => {
  const [lang, setLang] = useState();

  useEffect(() => {
    let newLang = 'pt';
    // fixing En-US and en issues
    if (i18n.language) [newLang] = i18n.language.split('-');
    setLang(newLang);
  }, []);

  useEffect(() => {
    console.log('lang', lang);

    i18n.changeLanguage(lang);
  }, [lang]);

  const classes = useStyles();
  return (
    <>
      {lang === 'pt' ? (
        <Button
          className={classes.btnlgn}
          onClick={() => setLang('en')}
          variant='outlined'
          size='small'
          color='primary'
        >
          PT-BR
        </Button>
      ) : null}
      {lang === 'en' ? (
        <Button
          className={classes.btnlgn}
          onClick={() => setLang('pt')}
          variant='outlined'
          size='small'
          color='primary'
        >
          en-US
        </Button>
      ) : null}
    </>
  );
};

ChangeLanguage.defaultProps = {};

ChangeLanguage.propTypes = {};

export default ChangeLanguage;
