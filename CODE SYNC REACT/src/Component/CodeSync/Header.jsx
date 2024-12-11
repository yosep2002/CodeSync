import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  height: 60px;
  background-color: #282c34;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <h1>GitSync Project</h1>
    </HeaderContainer>
  );
};

export default Header;
