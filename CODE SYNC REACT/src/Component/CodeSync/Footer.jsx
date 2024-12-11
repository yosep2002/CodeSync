import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  height: 60px;
  background-color: #282c34;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; 2024 GitSync Project</p>
    </FooterContainer>
  );
};

export default Footer;
