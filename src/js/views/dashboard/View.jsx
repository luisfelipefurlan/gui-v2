import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import React, { useCallback, useState, useEffect } from 'react';

import _ from 'lodash';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { actions as dashboardActions } from 'Redux/dashboard';
import { queryLastOperation } from 'Redux/data_layout';
import {
  dashboardConfig,
  dashboardData,
  dashboardLayout,
  dashboardSaga,
} from 'Selectors/dashboardSelector';
import { Device as DeviceService } from 'Services';

import { ViewContainer } from '../stateComponents';
import { ReportFilter } from './report';
import { AccountWidget } from './widget/account';
import { AreaChartWidget } from './widget/areaChart';
import { BarChartWidget } from './widget/barChart';
import { CSMapWidget } from './widget/csMap';
import { LineChartWidget } from './widget/lineChart';
import { MapWidget } from './widget/map';
import { TableWidget } from './widget/table';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Dashboard = props => {
  const {
    cols,
    rowHeight,
    className,
    layout,
    data,
    configs,
    sagaConfig,
    stopPolling,
    startPolling,
    history,
    changeLayout,
    removeWidget,
    removeWidgetConfig,
    removeWidgetSaga,
    removeWidgetData,
    checkData,
  } = props;

  const { bar, line, area, table, account, map, csMap } = __CONFIG__;
  const [lastOperation, setLastOperation] = useState({});
  const handleClick = useCallback(() => {
    history.push('/dashboard/widget');
  }, [history]);

  useEffect(() => {
    // 1. Fetch info about last operation
    DeviceService.getDevicesHistoryParsed(queryLastOperation)
      .then(resp => {
        const { getDeviceHistoryForDashboard } = resp;
        const deviceHistory = JSON.parse(getDeviceHistoryForDashboard);
        let attrs = {};
        deviceHistory.forEach(lin => {
          attrs = { ...lin, ...attrs };
        });
        setLastOperation(attrs);
      })
      .catch(error => {
        console.error(error);
      });

    if (!_.isEmpty(sagaConfig)) {
      startPolling(sagaConfig);
    }
    return () => stopPolling();
  }, [sagaConfig, startPolling, stopPolling]);

  useEffect(() => {
    if (_.isEmpty(sagaConfig)) {
      checkData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { t } = useTranslation(['dashboard', 'common']);

  const onLayoutChange = useCallback(
    newLayout => {
      changeLayout(newLayout, configs, sagaConfig);
    },
    [changeLayout, configs, sagaConfig],
  );

  const onRemoveItem = useCallback(
    i => {
      removeWidget(i);
      removeWidgetConfig(i);
      removeWidgetSaga(i);
      removeWidgetData(i);
      stopPolling();
    },
    [
      removeWidget,
      removeWidgetConfig,
      removeWidgetSaga,
      removeWidgetData,
      stopPolling,
    ],
  );

  const onPin = useCallback(
    i => {
      const newArr = _.map(layout, item => {
        const { static: iStatic, ...otherProps } = item;
        return item.i === i ? { static: !iStatic, ...otherProps } : item;
      });
      changeLayout(newArr, configs, sagaConfig);
    },
    [layout, changeLayout, configs, sagaConfig],
  );

  const createElement = useCallback(
    element => {
      const { i } = element;
      const [type] = i.split('/');
      // console.log('i', i, type, configs[i]);
      switch (type) {
        case line:
          return (
            <div key={i}>
              <LineChartWidget
                id={i}
                onDelete={onRemoveItem}
                onPin={onPin}
                data={data[i]}
                config={configs[i]}
              />
            </div>
          );
        case area:
          return (
            <div key={i}>
              <AreaChartWidget
                id={i}
                onDelete={onRemoveItem}
                onPin={onPin}
                data={data[i]}
                config={configs[i]}
              />
            </div>
          );
        case bar:
          return (
            <div key={i}>
              <BarChartWidget
                id={i}
                onDelete={onRemoveItem}
                onPin={onPin}
                data={data[i]}
                config={configs[i]}
              />
            </div>
          );
        case table:
          return (
            <div key={i}>
              <TableWidget
                id={i}
                onDelete={onRemoveItem}
                lastOperation={lastOperation}
                onPin={onPin}
                data={data[i]}
                config={configs[i]}
              />
            </div>
          );
        case account:
          return (
            <div key={i}>
              <AccountWidget
                id={i}
                onDelete={onRemoveItem}
                onPin={onPin}
                data={data[i]}
                config={configs[i]}
              />
            </div>
          );
        case map:
          return (
            <div key={i}>
              <MapWidget
                id={i}
                onDelete={onRemoveItem}
                onPin={onPin}
                data={data[i]}
                config={configs[i]}
              />
            </div>
          );
        case csMap:
          return (
            <div key={i}>
              <CSMapWidget
                id={i}
                onDelete={onRemoveItem}
                onPin={onPin}
                data={data[i]}
                config={configs[i]}
              />
            </div>
          );
        default:
          return <div key={i} />;
      }
    },
    [area, bar, account, configs, line, data, onPin, onRemoveItem, table, map],
  );

  const getHeaderContent = useCallback(() => {
    return (
      <>
        <ReportFilter t={t} />
      </>
    );
  }, [handleClick, startPolling, stopPolling, sagaConfig]);

  return (
    <ViewContainer
      headerTitle={t('dashboard:dashboard')}
      headerContent={getHeaderContent}
    >
      <ResponsiveReactGridLayout
        cols={cols}
        rowHeight={rowHeight}
        className={className}
        layouts={{ lg: layout }}
        onLayoutChange={onLayoutChange}
        measureBeforeMount={false}
        compactType='vertical'
        verticalCompact
        preventCollision={false}
        draggableHandle='.MuiCardHeader-root'
      >
        {_.map(layout, element => createElement(element))}
      </ResponsiveReactGridLayout>
    </ViewContainer>
  );
};

Dashboard.defaultProps = {
  className: 'layout',
  rowHeight: 30,
  cols: {
    lg: 12,
    md: 12,
    sm: 6,
    xs: 4,
    xxs: 2,
  },
};

Dashboard.propTypes = {
  className: PropTypes.string,
  rowHeight: PropTypes.number,
  cols: PropTypes.any,
};

const mapStateToProps = state => ({
  ...dashboardLayout(state),
  ...dashboardData(state),
  ...dashboardConfig(state),
  ...dashboardSaga(state),
});

const mapDispatchToProps = {
  ...dashboardActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
