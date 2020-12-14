import React from 'react';

import { ContentContainer, RootContainer } from 'Components/Containers';

export default ({ children }) => {
  return (
    <RootContainer>
      <ContentContainer>{children}</ContentContainer>
    </RootContainer>
  );
};
