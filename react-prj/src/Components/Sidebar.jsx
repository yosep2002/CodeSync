import React from 'react';
import styled from 'styled-components';

const Sidebar = () => {
    return (
        <SidebarContainer>
            <h3>Sidebar</h3>
            <button>Live Chat</button>
            <button>Share</button>
            <button>History</button>
            <button>Project Users</button>
        </SidebarContainer>
    );
};

const SidebarContainer = styled.div`
  width: 200px;
  background-color: #f9f9f9;
  border-right: 1px solid #ccc;
  padding: 20px;
  box-sizing: border-box;

  h3 {
    font-size: 18px;
    margin-bottom: 20px;
  }

  button {
    padding: 8px 12px;
    font-size: 14px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
    transition: background-color 0.2s ease;
    width: 100%;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

export default Sidebar;