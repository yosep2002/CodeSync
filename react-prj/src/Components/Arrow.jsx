import React from 'react';

const Arrow = ({ startPosition, endPosition }) => {
  // 각 테이블의 중앙 위치를 기준으로 계산
  const startX = startPosition.x + 165;  
  const startY = startPosition.y + 70;   
  const endX = endPosition.x + 165;      
  const endY = endPosition.y + 70;      

  // 두 테이블 사이의 각도 계산 (화살표 회전)
  const angle = Math.atan2(endY - startY, endX - startX);
  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));


  // 화살표 스타일
  const arrowStyle = {
    position: 'absolute',
    top: startY,
    left: startX,
    width: length,
    height: 2, // 화살표 두께
    backgroundColor: 'purple',
    transform: `rotate(${angle}rad)`,
    transformOrigin: '0% 50%',
  };

  // 화살표 끝에 삼각형 모양을 추가
  const arrowHeadStyle = {
    position: 'absolute',
    top: '50%',
    right: '-5px', // 끝에서 약간 띄운다
    width: 0,
    height: 0,
    borderLeft: '5px solid black',
    borderTop: '3px solid transparent',
    borderBottom: '3px solid transparent',
    transform: 'translateY(-50%)',
  };

  return (
    <div style={arrowStyle}>
      <div style={arrowHeadStyle}></div>
    </div>
  );
};

export default Arrow;
