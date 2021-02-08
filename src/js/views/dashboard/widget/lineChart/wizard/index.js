import React from 'react';

import { connect } from 'react-redux';
import { actions as dashboardActions } from 'Redux/dashboard';
import { generateScheme } from 'Utils';
import { v4 as uuidv4 } from 'uuid';

import useLine from '../../wizard/hooks/useLine';
import {
  Attributes,
  Devices,
  General,
  Summary,
  GeneralFilter as Filters,
  generalValidates,
} from '../../wizard/Steps';
import Wizard from '../../wizard/wizard';

const stepsList = [
  { label: 'steps.general', key: uuidv4() },
  { label: 'steps.devices', key: uuidv4() },
  { label: 'steps.attributes', key: uuidv4() },
  { label: 'steps.filters', key: uuidv4() },
  { label: 'steps.overview', key: uuidv4() },
];

const LineWizard = ({
  title,
  toDashboard,
  addWidget,
  addWidgetConfig,
  addWidgetSaga,
}) => {
  const { createLineWidget } = useLine(
    addWidget,
    addWidgetConfig,
    addWidgetSaga,
    generateScheme,
  );

  const handleSubmit = values => {
    createLineWidget(values);
    toDashboard();
  };

  const initialStateTest = {
    general: {
      name: 'Teste',
      description: '',
    },
    devices: {
      'chk-3b3365': {
        id: '3b3365',
        label: 'Local',
        attrs: [
          {
            label: 'location',
            valueType: 'GEO',
            isDynamic: true,
            staticValue: '',
          },
          {
            label: 'coordenada',
            valueType: 'GEO',
            isDynamic: false,
            staticValue: '-22.872659, -47.050415',
          },
        ],
      },
    },
    attributes: {
      '3b3365coordenada': {
        deviceID: '3b3365',
        attributeID: '3b3365coordenada',
        deviceLabel: 'Local',
        color: '#b80000',
        label: 'coordenada',
      },
      '3b3365location': {
        deviceID: '3b3365',
        attributeID: '3b3365location',
        deviceLabel: 'Local',
        color: '#fef3bd',
        label: 'location',
      },
    },
    filters: {
      operationType: 8,
      filterType: '0',
      dateTo: '',
      dateFrom: '',
      lastRegs: '15',
      lastDynamicsOption: undefined,
      lastDynamicsValue: '15',
      isRealTime: true,
    },
  };
  return (
    <Wizard
      initialValues={initialStateTest}
      onSubmit={handleSubmit}
      steps={stepsList}
      headerTitle={title}
    >
      <General validate={generalValidates} name='general' />
      <Devices validate={null} name='devices' />
      <Attributes validate={null} name='attributes' staticSupported={false} />
      <Filters validate={null} name='filters' />
      <Summary />
    </Wizard>
  );
};

const mapDispatchToProps = {
  ...dashboardActions,
};

export default connect(null, mapDispatchToProps)(LineWizard);