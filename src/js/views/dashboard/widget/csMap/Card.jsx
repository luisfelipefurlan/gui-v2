import React from 'react';

import Map from 'Assets/images/map.png';
import { ImageCard } from 'Components/Cards';
import { useTranslation } from 'react-i18next';

export default ({ onClick }) => {
  const { t } = useTranslation(['dashboard']);
  return (
    <ImageCard
      title={t('dashboard:csMap.title')}
      image={Map}
      description={t('dashboard:csMap.description')}
      handleClick={() => onClick()}
    />
  );
};
