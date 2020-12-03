import React, { useState, useCallback } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import More from '@material-ui/icons/MoreVert';
import { useTranslation } from 'react-i18next';
import { formatDate } from 'Utils';

import Summarizer from './summarizer';

const useStyles = makeStyles(() => {
  return {
    content: {
      padding: '0px',
      height: 'calc(100% - 72px)',
      position: 'relative',
    },
    card: {
      height: '100%',
      width: '100%',
    },
    subTitle: {
      lineHeight: '2',
    },
  };
});

const AccountWidget = ({ id, data, config, onDelete, onPin, onEdit }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { fields, meta } = config;

  const { t } = useTranslation(['common']);

  const handleClickMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (callback = () => {}) => {
    setAnchorEl(null);
    callback(id);
  };

  const renderSubheader = useCallback(() => {
    if (data && data.length) {
      const ts = data[0].timestamp;
      return `Atualizado em: ${formatDate(ts, 'DD/MM/YYYY HH:mm:ss')}`;
    }
    return null;
  }, [data]);

  const renderSumarization = useCallback(() => {
    console.log('data', data);
    if (data && data.length) {
      return <Summarizer columns={fields} meta={meta} rows={data} />;
    }
    return null;
  }, [data, fields]);

  return (
    <Card className={classes.card} variant='outlined'>
      <CardHeader
        action={
          <div>
            <IconButton
              aria-controls='fade-menu-1'
              aria-haspopup='true'
              aria-label='settings'
              onClick={handleClickMenu}
            >
              <More />
            </IconButton>
            <Menu
              id='fade-menu-1'
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleClose(onPin)}>
                <ListItemText primary={t('common:pin')} />
              </MenuItem>
            </Menu>
          </div>
        }
        title={config.meta.title}
        subheader={renderSubheader()}
      />
      <CardContent className={classes.content}>
        {renderSumarization()}
      </CardContent>
    </Card>
  );
};

export default AccountWidget;
