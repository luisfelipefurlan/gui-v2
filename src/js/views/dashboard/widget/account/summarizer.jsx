import React from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

// import useStyles from './style';

const useStyles = makeStyles(() => {
  return {
    gridRoot: {
      flexGrow: 1,
      padding: '0px 8px',
      paddingTop: '10px',
    },
    attrLabel: {
      fontFamily: 'Raleway',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '12px',
      lineHeight: '24px',
      textAlign: 'center',
      color: '#000000',
      paddingBottom: '10px',
    },
    attrValue: {
      fontFamily: 'Open Sans',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '24px',
      lineHeight: '30px',
      textAlign: 'center',
      wordBreak: 'break-all',
    },
  };
});

const Summarizer = ({ columns, rows }) => {
  const classes = useStyles();

  let row = {};
  // console.log('rows', rows);

  rows.forEach(vs => {
    // console.log('vs', vs);
    const obj2 = { ...vs };
    delete obj2.timestamp;
    row = { ...row, ...obj2 };
  });
  // console.log('row', row);

  const ValueFormatter = ({ column }) => {
    if (row[column.dataKey] === undefined) return null;
    if (column.dataKey.substr(6) === 'maxCampusPowerDemandNormalTime') {
      return row[column.dataKey].value
        ? row[column.dataKey].value.toLocaleString(undefined, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })
        : '';
    }
    if (column.dataKey.substr(6) === 'maxCampusPowerDemandRushTime') {
      return row[column.dataKey].value
        ? row[column.dataKey].value.toLocaleString(undefined, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })
        : '';
    }

    return row[column.dataKey].toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  };

  return (
    <Grid
      container
      key={uuidv4()}
      justify='flex-start'
      className={classes.gridRoot}
    >
      {columns.map(column => {
        return (
          <>
            <Grid
              key={`${column.dataKey}01`}
              item
              md={3}
              xs={6}
              className={classes.attrLabel}
            >
              {column.name}
            </Grid>
            <Grid
              key={`${column.dataKey}02`}
              item
              md={3}
              xs={6}
              style={{ color: column.color }}
              className={classes.attrValue}
            >
              <ValueFormatter column={column} />
            </Grid>
          </>
        );
      })}
    </Grid>
  );
};

Summarizer.defaultProps = {
  rows: [],
};

Summarizer.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  rows: PropTypes.array,
};

export default Summarizer;
