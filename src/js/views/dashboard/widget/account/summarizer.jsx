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
      padding: '0px 20px',
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
      fontFamily: 'Raleway',
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

  const ValueFormatter = ({ row, column }) => {
    return row[column.dataKey].toFixed(2);
  };

  return (
    <Grid
      container
      key={uuidv4()}
      justify='flex-start'
      className={classes.root}
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
              <ValueFormatter row={rows[0]} column={column} />
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
