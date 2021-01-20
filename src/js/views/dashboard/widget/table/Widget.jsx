import React, { useCallback, useState, useEffect } from 'react';

import { WidgetCard } from 'Components/Cards';
import { CollapsibleTable } from 'Components/Table';
import _ from 'lodash';
import { DEVICE_OPERATION_ID } from 'Redux/data_layout';
import { formatDate } from 'Utils';

const TableWidget = ({ id, data, config, onDelete, onPin, lastOperation }) => {
  const { table, meta } = config;
  const withRank = !!meta.withRank;
  const hasTimestamp = !meta.removeTimestamp;
  const [subHeader, setSubHeader] = useState();

  useEffect(() => {
    if (lastOperation === {}) return;
    if (meta) {
      const ts = lastOperation[`${DEVICE_OPERATION_ID}${meta.timestampField}`];
      setSubHeader(`Atualizado em: ${formatDate(ts, 'DD/MM/YYYY HH:mm:ss')}`);
    }
  }, [meta, lastOperation]);

  const renderTable = useCallback(() => {
    if (!_.isEmpty(data)) {
      return (
        <CollapsibleTable
          withRank={withRank}
          columns={table}
          meta={meta}
          rows={data}
          hasTimestamp={hasTimestamp}
        />
      );
    }
    return null;
  }, [data, meta, table, withRank, hasTimestamp]);

  return (
    <WidgetCard
      id={id}
      onDelete={onDelete}
      onPin={onPin}
      config={config}
      subHeader={subHeader}
    >
      {renderTable()}
    </WidgetCard>
  );
};

export default TableWidget;
