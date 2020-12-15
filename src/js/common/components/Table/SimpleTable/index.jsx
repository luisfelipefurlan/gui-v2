import React, { useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import PropTypes from 'prop-types';
import { formatDate, compareAll } from 'Utils';
import { v4 as uuidv4 } from 'uuid';

import useStyles from './style';

const preManipulationForPowerDemand = rows => {
  // console.log('maxPowerDemandNormalTime', rows);
  let newVet = [];
  const newObj = {};

  rows.forEach(vs => {
    const keyDevice = Object.keys(vs).reduce(key => {
      // console.log('key,valeu', key);
      return key !== 'timestamp' ? key : '';
    });
    const deviceId = keyDevice.substr(0, 6);
    const attr = keyDevice.substr(6);
    if (newObj[deviceId] === undefined) {
      newObj[deviceId] = {};
    }
    newObj[deviceId][attr] = vs[keyDevice];
  });

  // console.log('newObj', newObj); // premoinuation
  newVet = Object.keys(newObj).map(id => {
    // console.log('id', id);
    const line = {
      maxPowerDemandRushTime: newObj[id].maxPowerDemandRushTime,
      maxPowerDemandNormalTime: newObj[id].maxPowerDemandNormalTime,
      valuemaxPowerDemandRushTime: newObj[id].maxPowerDemandRushTime.value,
      valuemaxPowerDemandNormalTime: newObj[id].maxPowerDemandNormalTime.value,
      valuelabel: id,
      label: id,
    };
    return line;
  });
  // console.log('newVet', newVet);
  return newVet;
};

const preManipulationForConsumption = rows => {
  const currentChart = 'energyConsumption';
  // console.log('energyConsumption', rows);
  let newVet = [];
  newVet = rows.map(vs => {
    // console.log('vs', vs);
    const keyDevice = Object.keys(vs).reduce(key => {
      // console.log('key,valeu', key);
      return key !== 'timestamp' ? key : '';
    });
    //   console.log('keyDevice', keyDevice);
    const newObj = {};
    const deviceId = keyDevice.substr(0, 6);
    newObj.label = deviceId;
    newObj[currentChart] = vs[keyDevice];
    return newObj;
  });
  return newVet;
};

const preManipulationForSurplus = rows => {
  const currentChart = 'surplusReactivePower';
  // console.log('surplusReactivePower', rows);
  let newVet = [];
  newVet = rows.map(vs => {
    // console.log('vs', vs);
    const keyDevice = Object.keys(vs).reduce(key => {
      // console.log('key,valeu', key);
      return key !== 'timestamp' ? key : '';
    });
    //   console.log('keyDevice', keyDevice);
    const newObj = {};
    const deviceId = keyDevice.substr(0, 6);
    newObj.label = deviceId;
    newObj[currentChart] = vs[keyDevice];
    return newObj;
  });
  return newVet;
};

const Icn = ({ meta, order, field, currentSortField }) => {
  let auxfield = field;
  if (meta.chart === 'PowerDemand') auxfield = `value${field}`;

  if (currentSortField !== auxfield) return null;
  if (order === 1) return <ArrowDropUpIcon fontSize='small' />;
  return <ArrowDropDownIcon fontSize='small' />;
};

const SimpleTable = ({ meta, columns, rows, hasTimestamp, withRank }) => {
  const { head, root, lines } = useStyles();
  const [sortField, setSortField] = useState({ order: -1, field: '' });
  const [rws, setRws] = useState([]);

  useEffect(() => {
    // premanipulation to handle date sorting
    let newRows = [];
    // console.log('meta.chart', meta.chart);
    if (meta.chart === 'energyConsumption') {
      newRows = preManipulationForConsumption(rows);
    } else if (meta.chart === 'surplusReactivePower') {
      newRows = preManipulationForSurplus(rows);
    } else if (meta.chart === 'PowerDemand') {
      newRows = preManipulationForPowerDemand(rows);
    } else {
      newRows = rows;
    }
    setRws(newRows);
  }, [rows, meta]);

  const changeSorting = index => {
    let obj = {};
    if (meta.chart === 'PowerDemand') {
      obj = { field: `value${index}`, order: sortField.order * -1 };
    } else {
      obj = { field: index, order: sortField.order * -1 };
    }
    setSortField(obj);
  };

  const ValueFormatter = ({ row, column }) => {
    // console.log('meta.chart', meta.chart);
    if (meta.chart === 'PowerDemand') {
      if (typeof row[column.dataKey] === 'object') {
        return (
          <pre style={{ textAlign: 'center' }}>
            <b style={{ fontSize: '14px' }}>{row[column.dataKey].value}</b>{' '}
            <br />
            {formatDate(row[column.dataKey].ts, 'DD/MM HH:mm')}
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
            {hasTimestamp ? (
              <TableCell key='timestamp' classes={{ head }}>
                <Button
                  color='inherit'
                  size='small'
                  classes={{ root: head }}
                  onClick={() => changeSorting('ts')}
                  endIcon={
                    <Icn
                      currentSortField={sortField.field}
                      field='ts'
                      order={sortField.order}
                    />
                  }
                >
                  Timestamp
                </Button>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedArray.map((row, index) => (
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

              {hasTimestamp ? (
                <TableCell
                  key={`timestamp_${uuidv4()}`}
                  classes={{ body: lines }}
                >
                  {formatDate(row.timestamp, 'DD/MM/YYYY HH:mm:ss')}
                </TableCell>
              ) : null}
              {columns.map(column => {
                return (
                  <TableCell
                    classes={{ body: lines }}
                    key={`${column.dataKey}_${uuidv4()}`}
                    align='center'
                  >
                    <ValueFormatter row={row} column={column} />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

SimpleTable.defaultProps = {
  rows: [],
  hasTimestamp: false,
  withRank: false,
};

SimpleTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  rows: PropTypes.array,
  hasTimestamp: PropTypes.bool,
  withRank: PropTypes.bool,
};

export default SimpleTable;
