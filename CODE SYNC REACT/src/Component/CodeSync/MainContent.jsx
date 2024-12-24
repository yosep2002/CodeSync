import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html, body, #root {
    height: 100%;
    overflow: hidden; /* 전체 페이지 스크롤 방지 */
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden; /* 스크롤 방지 */
  position: relative; /* 오버레이를 MainContent에 제한하기 위해 추가 */
`;

const EditorWrapper = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden; /* 불필요한 스크롤 제거 */
`;

const CodeMirrorWrapper = styled.div`
  width: 100%;
  height: 100%; /* 부모 높이 채우기 */
  .CodeMirror {
    height: calc(1.2em * 50); /* 최소 50줄 */
    font-size: 14px;
    overflow-x: hidden; /* 가로 스크롤 제거 */
    white-space: pre-wrap; /* 코드 줄바꿈 강제 적용 */
  }
`;

const Overlay = styled.div`
  position: absolute; /* 부모(ContentWrapper) 기준으로 오버레이 제한 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* 약간 불투명한 검은색 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const LockMessage = styled.div`
  color: white;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
`;

const LockIcon = styled.div`
  font-size: 60px;
  margin-bottom: 20px;
`;

const MainContent = ({ fileContent, fileNo, socket }) => {
  const [code, setCode] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false); // 반대로 설정: 기본값을 false로 설정
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [isLockedByUser, setIsLockedByUser] = useState(1); // 기본값을 1로 설정 (잠금 안 됨)
  const [messageStatus, setMessageStatus] = useState(''); // 메시지 상태 관리
  const user = useSelector((state) => state.user);
  const userId = user.user.userId;
  const userNo = user.user.userNo;
  const { codeSyncNo } = useParams();

  useEffect(() => {
    if (fileContent && fileNo) {
      // localStorage에서 userState를 제외하고 다른 항목 삭제
      Object.keys(localStorage).forEach((key) => {
        if (key !== 'userState') {
          localStorage.removeItem(key);
        }
      });

      localStorage.setItem(`${fileNo}_original`, fileContent);
      setCode(fileContent);
      setShowLineNumbers(true);

      // 서버에 잠금 상태 확인 요청
      if (socket && socket.readyState === WebSocket.OPEN) {
        const lockCheckMessage = JSON.stringify({
          code: '5', // 잠금 상태 확인 코드
          fileNo: fileNo,
          userNo: userNo,
          codeSyncNo: codeSyncNo,
        });
        socket.send(lockCheckMessage);
      }
      axios.post('http://localhost:9090/api/codeSync/checkLocked', {
        fileNo: fileNo,
        userNo: userNo,
      })
      .then((response) => {
        console.log(response.data);
        const { isLocked } = response.data;
        // isLocked가 true일 때만 readOnly를 true로 설정 (반대 설정)
        setIsReadOnly(!isLocked); // isLocked가 false일 때 readOnly가 true
      })
      .catch((error) => {
        console.error('잠금 상태 확인 실패:', error);
      });
    }
  }, [fileContent, fileNo, socket, userNo, messageStatus]); // messageStatus 추가

  useEffect(() => {
    if (socket) {
      const handleMessage = (event) => {
        try {
          const message = JSON.parse(event.data); // 메시지를 JSON으로 파싱
          const lockStatus = message?.file?.isLockedByUser;

          if (lockStatus === 1 || lockStatus === 2) {
            setIsLockedByUser(lockStatus); // 1 또는 2일 때 잠금 상태 업데이트
          } else if (lockStatus === 3) {
            setIsLockedByUser(3); // 3일 때는 잠금 오버레이 표시
          }

          if (['checked'].includes(message?.status)) {
            setMessageStatus(message.status); // 메시지 상태 업데이트
          }

          console.log('isLockedByUser:', lockStatus); // 값 출력
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      socket.addEventListener('message', handleMessage);

      // Clean up on unmount
      return () => {
        socket.removeEventListener('message', handleMessage);
      };
    }
  }, [socket]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (fileNo) {
      localStorage.setItem(`${fileNo}_modified`, newCode);
    }
  };

  return (
    <>
      <GlobalStyle />
      <ContentWrapper>
        {isLockedByUser === 3 && ( // isLockedByUser가 3일 때만 오버레이 표시
          <Overlay>
            <div>
              <LockIcon>🔒</LockIcon>
              <LockMessage>
                작업을 진행 중입니다!
              </LockMessage>
            </div>
          </Overlay>
        )}
        <EditorWrapper>
          <CodeMirrorWrapper>
           <CodeMirror
  value={code}
  options={{
    mode: 'javascript',
    lineNumbers: showLineNumbers,
    theme: 'default',
    lineWrapping: true,
    readOnly: isReadOnly, // 읽기 전용 상태 반영
    inputStyle: 'contenteditable', // 기본 동작 변경
  }}
  onBeforeChange={(editor, data, value) => {
    setCode(value);
  }}
  onChange={(editor, data, value) => {
    if (fileNo) {
      localStorage.setItem(`${fileNo}_modified`, value);
    }
  }}
/>
          </CodeMirrorWrapper>
        </EditorWrapper>
      </ContentWrapper>
    </>
  );
};

export default MainContent;
