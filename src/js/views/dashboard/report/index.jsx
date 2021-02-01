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
import { formatDate } from 'Utils';

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
            consumo_energia: '',
            demanda_potencia_ponta__valor: '',
            demanda_potencia_ponta__horario: '',
            demanda_potencia_foraponta__valor: '',
            demanda_potencia_foraponta__horario: '',
            excedente_reativos: '',
          };
          dev.serial_number = values.serial;
          dev.label = values.deviceLabel;
          dev.consumo_energia = values.energyConsumption
            ? values.energyConsumption
            : '';
          dev.excedente_reativos = values.surplusReactivePower
            ? values.surplusReactivePower
            : '';

          dev.demanda_potencia_foraponta__horario = values.maxPowerDemandNormalTime
            ? formatDate(
                parseInt(values.maxPowerDemandNormalTime.ts, 10),
                'DD/MM/YYYY HH:mm:ss',
              )
            : '';
          dev.demanda_potencia_foraponta__valor = values.maxPowerDemandNormalTime
            ? values.maxPowerDemandNormalTime.value
            : '';
          dev.demanda_potencia_ponta__horario = values.maxPowerDemandRushTime
            ? formatDate(
                parseInt(values.maxPowerDemandNormalTime.ts, 10),
                'DD/MM/YYYY HH:mm:ss',
              )
            : '';
          dev.demanda_potencia_ponta__valor = values.maxPowerDemandRushTime
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
          consumo_energia: '',
          demanda_potencia_ponta__valor: '',
          demanda_potencia_ponta__horario: '',
          demanda_potencia_foraponta__valor: '',
          demanda_potencia_foraponta__horario: '',
          excedente_reativos: '',
        };
        const { getDeviceHistoryForDashboard } = response;
        const deviceHistory = JSON.parse(getDeviceHistoryForDashboard);

        // 2. Handling data
        deviceHistory.forEach(entry => {
          Object.keys(entry).forEach(key => {
            if (key === 'timestamp') return;
            const field = key.replace(DEVICE_CAMPUS_ID, '');

            if (field === 'maxCampusPowerDemandRushTime') {
              campusDict.demanda_potencia_ponta__valor = entry[key].value;
              campusDict.demanda_potencia_ponta__horario = formatDate(
                parseInt(entry[key].ts, 10),
                'DD/MM/YYYY HH:mm:ss',
              );
              return;
            }

            if (field === 'maxCampusPowerDemandNormalTime') {
              campusDict.demanda_potencia_foraponta__valor = entry[key].value;
              campusDict.demanda_potencia_foraponta__horario = formatDate(
                parseInt(entry[key].ts, 10),
                'DD/MM/YYYY HH:mm:ss',
              );
              return;
            }
            if (field === 'sumEnergyConsumption') {
              campusDict.consumo_energia = entry[key];
            }
            if (field === 'sumSurplusReactivePower') {
              campusDict.excedente_reativos = entry[key];
            }
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
    // + 2 is used to get the expected month because day 0 backs one month;
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
