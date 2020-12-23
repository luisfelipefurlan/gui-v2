import React, { useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { formatDate, compareAll } from 'Utils';
import { v4 as uuidv4 } from 'uuid';

import useStyles from './style';

const Icn = ({ meta, order, field, currentSortField }) => {
  let auxfield = field;
  if (meta.chart === 'PowerDemand') auxfield = `value${field}`;

  if (currentSortField !== auxfield) return null;
  if (order === 1) return <ArrowDropUpIcon fontSize='small' />;
  return <ArrowDropDownIcon fontSize='small' />;
};

const CollapsibleTable = ({ meta, columns, rows, withRank }) => {
  const { head, root } = useStyles();
  const [sortField, setSortField] = useState({ order: -1, field: '' });
  const [sortedArray, setSortedArray] = useState([]);
  const [renderTable, setRenderTable] = useState([]);

  useEffect(() => {
    // convert object to array
    setSortedArray(Object.values(rows));
  }, [rows]);

  const changeSorting = index => {
    setSortField({ field: index, order: sortField.order * -1 });
  };

  useEffect(() => {
    if (!_.isEmpty(sortedArray)) {
      switch (sortField.field) {
        case 'maxPowerDemandRushTime':
        case 'maxPowerDemandNormalTime':
          setSortedArray(
            sortedArray.sort((a, b) =>
              compareAll(
                a[sortField.field].value,
                b[sortField.field].value,
                sortField.order,
              ),
            ),
          );
          break;
        default:
          setSortedArray(
            sortedArray.sort((a, b) =>
              compareAll(
                a[sortField.field],
                b[sortField.field],
                sortField.order,
              ),
            ),
          );
      }
    }
    setRenderTable(
      <TableContainer classes={{ root }}>
        <Table stickyHeader size='small' aria-label='customized table'>
          <TableHead key='theader'>
            <TableRow key='headerrow'>
              {withRank ? (
                <TableCell key='rank' classes={{ head }} align='center'>
                  #
                </TableCell>
              ) : null}
              {columns.map(column => {
                return (
                  <TableCell
                    key={column.dataKey}
                    classes={{ head }}
                    align={column.align}
                  >
                    <Button
                      color='inherit'
                      size='small'
                      classes={{ root: head }}
                      onClick={() => changeSorting(column.dataKey)}
                      endIcon={
                        <Icn
                          meta={meta}
                          currentSortField={sortField.field}
                          field={column.dataKey}
                          order={sortField.order}
                        />
                      }
                    >
                      {column.name}
                    </Button>
                  </TableCell>
                );
              })}
              <TableCell key='opts' classes={{ head }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedArray.map((row, index) => {
              return (
                <CustomRow
                  index={index}
                  columns={columns}
                  chartType={meta.chart}
                  key={`line${uuidv4()}`}
                  withRank={withRank}
                  row={row}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>,
    );
  }, [sortField, sortedArray]);

  return renderTable;
};

CollapsibleTable.defaultProps = {
  rows: [],
  withRank: false,
};

CollapsibleTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  rows: PropTypes.array,
  withRank: PropTypes.bool,
};

function CustomRow({ index, columns, row, withRank, chartType }) {
  const [open, setOpen] = useState(false);
  const { lines, gridLabel, gridRoot } = useStyles();

  const getAttr = attr => {
    if (row[attr]) {
      return row[attr];
    }
    return '-';
  };

  const ValueFormatter = ({ column }) => {
    if (chartType === 'PowerDemand') {
      if (typeof row[column.dataKey] === 'object') {
        return (
          <pre style={{ textAlign: 'inherit' }}>
            <b style={{ fontSize: '14px' }}>
              {row[column.dataKey].value.toLocaleString()}
            </b>{' '}
            <br />
            {row[column.dataKey].ts === 0
              ? ''
              : formatDate(row[column.dataKey].ts, 'DD/MM HH:mm')}
          </pre>
        );
      }
    }

    if (!row[column.dataKey] && row[column.dataKey] !== 0) {
      return '-';
    }
    if (typeof row[column.dataKey] === 'object') {
      return (
        <span style={{ textAlign: 'left' }}>
          {JSON.stringify(row[column.dataKey], undefined, 2)}
        </span>
      );
    }
    if (typeof row[column.dataKey] === 'number') {
      return (
        <span style={{ textAlign: 'center' }}>
          <b style={{ fontSize: '14px' }}>
            {row[column.dataKey].toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </b>
        </span>
      );
    }
    return row[column.dataKey];
  };

  return (
    <>
      <TableRow hover key={`${row.timestamp}_${uuidv4()}`}>
        {withRank ? (
          <TableCell
            key={`rank_${uuidv4()}`}
            classes={{ body: lines }}
            align='center'
          >
            <b> {index + 1}</b>
          </TableCell>
        ) : null}
        {columns.map(column => {
          return (
            <TableCell
              classes={{ body: lines }}
              key={`${column.dataKey}_${uuidv4()}`}
              align={column.align}
            >
              <ValueFormatter column={column} />
            </TableCell>
          );
        })}
        <TableCell style={{ padding: '0px 4px 0px 0px' }}>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
          align='left'
        >
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Grid
              container
              key={uuidv4()}
              justify='flex-start'
              className={gridRoot}
            >
              <Grid item md={6} xs={12} className={gridLabel}>
                <b>MAC Address:&nbsp;</b>
                {getAttr('MAC')}
              </Grid>
              <Grid item md={6} xs={12} className={gridLabel}>
                <b>Localização:&nbsp;</b>
                {getAttr('point')}
              </Grid>
            </Grid>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default CollapsibleTable;
