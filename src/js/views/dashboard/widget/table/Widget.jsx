import React, { useCallback } from 'react';

import { WidgetCard } from 'Components/Cards';
import { CollapsibleTable } from 'Components/Table';
import _ from 'lodash';
import { formatDate } from 'Utils';

const TableWidget = ({
  id,
  data,
  config,
  onDelete,
  onPin,
  onEdit,
  deviceData,
}) => {
  const { table, meta } = config;
  const withRank = !!meta.withRank;
  const hasTimestamp = !meta.removeTimestamp;

  const renderSubheader = useCallback(() => {
    if (data && data.length) {
      const ts = data[0].timestamp;
      return `Atualizado em: ${formatDate(ts, 'DD/MM/YYYY HH:mm:ss')}`;
    }
    return null;
  }, [data]);

  const renderTable = useCallback(() => {
    if (data && data.length && !_.isEmpty(deviceData)) {
      return (
        <CollapsibleTable
          withRank={withRank}
          columns={table}
          deviceData={deviceData}
          meta={meta}
          rows={data}
          hasTimestamp={hasTimestamp}
        />
      );
    }
    return null;
  }, [data, deviceData, meta, table, withRank, hasTimestamp]);

  return (
    <WidgetCard
      id={id}
      onDelete={onDelete}
      onPin={onPin}
      config={config}
      subHeader={renderSubheader()}
    >
      {renderTable()}
    </WidgetCard>
  );
};

export default TableWidget;
