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
import PropTypes from 'prop-types';
import { formatDate, compareAll } from 'Utils';
import { v4 as uuidv4 } from 'uuid';

import {
  preManipulationForPowerDemand,
  preManipulationForConsumption,
  preManipulationForSurplus,
} from './csConverter';
import useStyles from './style';

const Icn = ({ meta, order, field, currentSortField }) => {
  let auxfield = field;
  if (meta.chart === 'PowerDemand') auxfield = `value${field}`;

  if (currentSortField !== auxfield) return null;
  if (order === 1) return <ArrowDropUpIcon fontSize='small' />;
  return <ArrowDropDownIcon fontSize='small' />;
};

const CollapsibleTable = ({ meta, columns, rows, withRank, deviceData }) => {
  const { head, root } = useStyles();
  const [sortField, setSortField] = useState({ order: -1, field: '' });
  const [rws, setRws] = useState([]);

  useEffect(() => {
    // premanipulation to handle date sorting
    let newRows = [];
    if (meta.chart === 'energyConsumption') {
      newRows = preManipulationForConsumption(deviceData, rows);
    } else if (meta.chart === 'surplusReactivePower') {
      newRows = preManipulationForSurplus(deviceData, rows);
    } else if (meta.chart === 'PowerDemand') {
      newRows = preManipulationForPowerDemand(deviceData, rows);
    } else {
      newRows = rows;
    }
    setRws(newRows);
  }, [deviceData, rows, meta]);

  const changeSorting = index => {
    let obj = {};
    if (meta.chart === 'PowerDemand') {
      obj = { field: `value${index}`, order: sortField.order * -1 };
    } else {
      obj = { field: index, order: sortField.order * -1 };
    }
    setSortField(obj);
  };

  const sortedArray = rws;
  sortedArray.sort((a, b) => {
    return compareAll(a[sortField.field], b[sortField.field], sortField.order);
  });

  return (
    <TableContainer classes={{ root }}>
      <Table stickyHeader size='small' aria-label='customized table'>
        <TableHead key='theader'>
          <TableRow key='headerrow'>
            {withRank ? (
              <TableCell key='rank' classes={{ head }}>
                #
              </TableCell>
            ) : null}
            {columns.map(column => {
              return (
                <TableCell
                  key={column.dataKey}
                  classes={{ head }}
                  align='center'
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
          {sortedArray.map((row, index) => (
            <CustomRow
              index={index}
              columns={columns}
              device={deviceData[row.id]}
              chartType={meta.chart}
              key={`line${uuidv4()}`}
              withRank={withRank}
              row={row}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

CollapsibleTable.defaultProps = {
  rows: [],
  deviceData: {},
  withRank: false,
};

CollapsibleTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  deviceData: PropTypes.shape({}),
  rows: PropTypes.array,
  withRank: PropTypes.bool,
};

function CustomRow({ device, index, columns, row, withRank, chartType }) {
  const [open, setOpen] = useState(false);
  const { lines, gridLabel, gridRoot } = useStyles();

  const getAttr = attr => {
    if (device === undefined) return '';

    // TODO: find another way to do that being more efficient
    const res = device.attrs.filter(el => {
      return el.label === attr;
    });
    if (res[0] === undefined) return '';
    return res[0].staticValue;
  };

  const ValueFormatter = ({ column }) => {
    if (chartType === 'PowerDemand') {
      if (typeof row[column.dataKey] === 'object') {
        return (
          <pre style={{ textAlign: 'center' }}>
            <b style={{ fontSize: '14px' }}>{row[column.dataKey].value}</b>{' '}
            <br />
            {row[column.dataKey].ts === 0
              ? ''
              : formatDate(row[column.dataKey].ts, 'DD/MM HH:mm')}
          </pre>
        );
      }
    }

    if (!row[column.dataKey]) {
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
          <b style={{ fontSize: '14px' }}>{row[column.dataKey].toFixed(3)}</b>
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
              align='center'
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
