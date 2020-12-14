import React, { useCallback } from 'react';

import { WidgetCard } from 'Components/Cards';
import { formatDate } from 'Utils';

import Summarizer from './summarizer';

const AccountWidget = ({ id, data, config, onDelete, onPin, onEdit }) => {
  const { fields, meta } = config;

  const renderSubheader = useCallback(() => {
    if (data && data.length) {
      const ts = data[0].timestamp;
      return `Atualizado em: ${formatDate(ts, 'DD/MM/YYYY HH:mm:ss')}`;
    }
    return null;
  }, [data]);

  const renderSumarization = useCallback(() => {
    if (data && data.length) {
      return <Summarizer columns={fields} meta={meta} rows={data} />;
    }
    return null;
  }, [data, fields]);

  return (
    <WidgetCard
      id={id}
      onDelete={onDelete}
      onPin={onPin}
      config={config}
      subHeader={renderSubheader()}
    >
      {renderSumarization()}
    </WidgetCard>
  );
};

export default AccountWidget;
