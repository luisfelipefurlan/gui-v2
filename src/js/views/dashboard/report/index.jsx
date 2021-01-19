import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import AssessmentIcon from '@material-ui/icons/Assessment';
import GetAppIcon from '@material-ui/icons/GetApp';
import { ExportToCsv } from 'export-to-csv';
import moment from 'moment';
import {
  DEVICE_CAMPUS_ID,
  queryAllDevices,
  queryCampusDevice,
} from 'Redux/data_layout';
import { Device as DeviceService } from 'Services';

import useStyles from './style';

const csvDeviceConfig = dateWhen => ({
  fieldSeparator: ',',
  showLabels: true,
  filename: `report_devices_${dateWhen}`,
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true,
});

const csvCampusConfig = dateWhen => ({
  fieldSeparator: ',',
  showLabels: true,
  filename: `report_campus_${dateWhen}`,
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true,
});

export const ReportFilter = ({ t }) => {
  const [dateWhen, setDateWhen] = useState(moment(Date()).format('YYYY-MM'));
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  const toggleReport = () => {
    setIsOpen(!isOpen);
  };

  const getCsvDevice = finalDateIso => {
    // 1. Fetch Device History
    DeviceService.getDevicesHistoryParsed(queryAllDevices('', finalDateIso))
      .then(resp => {
        const { getDeviceHistoryForDashboard } = resp;
        const deviceHistory = JSON.parse(getDeviceHistoryForDashboard);

        const devDict = [];
        // 2. Handling data
        Object.entries(deviceHistory).forEach(([key, values]) => {
          const dev = {
            id: key,
            energyConsumption: '',
            maxPowerDemandRushTime_value: '',
            maxPowerDemandRushTime_ts: '',
            maxPowerDemandNormalTime_value: '',
            maxPowerDemandNormalTime_ts: '',
            surplusReactivePower: '',
          };
          dev.serial = values.serial;
          dev.label = values.deviceLabel;
          dev.energyConsumption = values.energyConsumption
            ? values.energyConsumption
            : '';
          dev.surplusReactivePower = values.surplusReactivePower
            ? values.surplusReactivePower
            : '';

          dev.maxPowerDemandNormalTime_ts = values.maxPowerDemandNormalTime
            ? values.maxPowerDemandNormalTime.ts
            : '';
          dev.maxPowerDemandNormalTime_value = values.maxPowerDemandNormalTime
            ? values.maxPowerDemandNormalTime.value
            : '';
          dev.maxPowerDemandRushTime_ts = values.maxPowerDemandRushTime
            ? values.maxPowerDemandRushTime.ts
            : '';
          dev.maxPowerDemandRushTime_value = values.maxPowerDemandRushTime
            ? values.maxPowerDemandRushTime.value
            : '';
          devDict.push(dev);
        });
        // 4. Transforming Map to List
        const devList = Object.values(devDict);
        // 5. Generates and download CSV
        const csvExporter = new ExportToCsv(csvDeviceConfig(dateWhen));
        csvExporter.generateCsv(devList);
      })
      .catch(error => {
        // @Todo show error to user
        console.error(error);
      });
  };

  const getCsvCampus = finalDateIso => {
    // 1. Do request
    DeviceService.getDevicesHistoryParsed(queryCampusDevice('', finalDateIso))
      .then(response => {
        const campusDict = {
          sumEnergyConsumption: '',
          maxCampusPowerDemandRushTime_value: '',
          maxCampusPowerDemandRushTime_ts: '',
          maxCampusPowerDemandNormalTime_value: '',
          maxCampusPowerDemandNormalTime_ts: '',
          sumSurplusReactivePower: '',
        };
        const { getDeviceHistoryForDashboard } = response;
        const deviceHistory = JSON.parse(getDeviceHistoryForDashboard);

        // 2. Handling data
        deviceHistory.forEach(entry => {
          // console.log('entry', entry);
          Object.keys(entry).forEach(key => {
            if (key === 'timestamp') return;

            const field = key.replace(DEVICE_CAMPUS_ID, '');

            if (field === 'maxCampusPowerDemandRushTime') {
              campusDict.maxCampusPowerDemandRushTime_value = entry[key].value;
              campusDict.maxCampusPowerDemandRushTime_ts = entry[key].ts;
              return;
            }

            if (field === 'maxCampusPowerDemandNormalTime') {
              campusDict.maxCampusPowerDemandNormalTime_value =
                entry[key].value;
              campusDict.maxCampusPowerDemandNormalTime_ts = entry[key].ts;
              return;
            }
            // case Consumption and Surplus
            campusDict[field] = entry[key];
          });
        });
        // 3. Generates and download CSV
        const csvExporter = new ExportToCsv(csvCampusConfig(dateWhen));
        csvExporter.generateCsv([campusDict]);
      })
      .catch(error => {
        // @Todo show error to user
        console.error(error);
      });
  };

  const getData = () => {
    // 1. Create the last moment in select month/year
    const dy = new Date(dateWhen);
    const lastMomentOfMonth = new Date(dy.getFullYear(), dy.getMonth() + 2, 0);
    // + 2 is used to get the corrected month
    lastMomentOfMonth.setHours(23, 59, 59, 999);
    const finalDateIso = lastMomentOfMonth.toISOString();
    // 2. Get devices data and create CSV
    getCsvDevice(finalDateIso);
    // 3.  Get Campus data and create CSV
    getCsvCampus(finalDateIso);
    // 4. Close box
    setIsOpen(false);
  };

  return (
    <div
      className={classes.boxReport + (!isOpen ? ' ' : ` ${classes.width400}`)}
    >
      {!isOpen ? (
        <Button
          size='small'
          color='inherit'
          startIcon={<AssessmentIcon />}
          onClick={() => toggleReport()}
        >
          {t('common:report')}
        </Button>
      ) : (
        <>
          <span>
            <FormControl>
              <TextField
                className={classes.textField}
                id='dateWhen'
                type='month'
                value={dateWhen}
                onChange={event => setDateWhen(event.target.value)}
                max={new Date()}
              />
            </FormControl>
          </span>
          <Button
            style={{ marginLeft: 10 }}
            color='inherit'
            size='small'
            startIcon={<GetAppIcon />}
            onClick={() => getData()}
          >
            {t('common:download')}
          </Button>
        </>
      )}
    </div>
  );
};
