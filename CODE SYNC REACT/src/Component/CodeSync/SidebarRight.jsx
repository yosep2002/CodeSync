import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const SidebarContainer = styled.div`
  width: 250px;
  background-color: #e0e0e0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BottomButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  position: absolute;
  bottom: 20px;
  width: calc(100% - 20px);
  padding: 0 10px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1565c0;
  }
`;

const SaveButton = styled(Button)`
  background-color: #4caf50;

  &:hover {
    background-color: #388e3c;
  }
`;

const RevertButton = styled(Button)`
  background-color: #f44336;

  &:hover {
    background-color: #d32f2f;
  }
`;

const Message = styled.div`
  font-size: 14px;
  margin-top: 10px;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity 2s ease-out;
  color: ${({ type }) => (type === 'error' ? 'red' : 'green')};
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 90px;
  left: 10px;
  z-index: 1;
  max-width: 220px;
  padding: 0 10px;
  font-weight: bold;
  box-shadow: none;
`;

const SidebarRight = ({ socket, fileNo }) => {
  const { codeSyncNo } = useParams();
  const user = useSelector((state) => state.user);
  const userNo = user.user.userNo;
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleInviteUser = () => {
    axios
      .post('/api/invite', { userId: 123 })
      .then((response) => console.log('User invited'))
      .catch((error) => console.error('Error inviting user:', error));
  };

  const handleSaveCode = () => {
    let content = null;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('_modified')) {
        content = localStorage.getItem(key);
        break;
      }
    }

    if (content && fileNo) {
      console.log(content);
      console.log(fileNo);

      axios.post('http://localhost:9090/api/codeSync/saveCode', { fileNo, content })
        .then((response) => {
          console.log('Code saved:', response.data);

          const unlockRequest = {
            code: '4',
            lockedBy: userNo,
            fileNo: fileNo,
          };

          if (socket && socket.readyState === WebSocket.OPEN) {
            console.log('Sending unlock request via WebSocket:', unlockRequest);
            socket.send(JSON.stringify(unlockRequest));
          } else {
            console.log('WebSocket not open. Current readyState:', socket?.readyState);
          }

          setMessage("수정이 완료되었습니다");
          setMessageType("success");
          setShowMessage(true);
          setTimeout(() => {
            setShowMessage(false);
          }, 3000);
        })
        .catch((error) => {
          console.error('Error saving code:', error);
        });
    } else {
      console.log('No modified content or fileNo found.');
      setMessage("수정사항이 없습니다");
      setMessageType("error");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  };

  const handleRevertCode = () => {
    console.log('Code reverted');
  };

  return (
    <SidebarContainer>
      <ButtonGroup>
        <Button onClick={handleInviteUser}>Invite User</Button>
        <Button>Open Chat</Button>
        <Button>View History</Button>
        <Button>View Project Participants</Button>
      </ButtonGroup>

      {showMessage && <Message show={showMessage} type={messageType}>{message}</Message>}

      <BottomButtons>
        <SaveButton onClick={handleSaveCode}>Save Code</SaveButton>
        <RevertButton onClick={handleRevertCode}>Revert Code</RevertButton>
      </BottomButtons>
    </SidebarContainer>
  );
};

export default SidebarRight;
