import React from "react";
import styled from "styled-components";

const Canvas = ({ children }) => {
  return (
    <CanvasContainer className="canvas">
      {children}
    </CanvasContainer>
  );
};

export default Canvas;

const CanvasContainer = styled.div`
  top: 0;
  left: 0;
  width: 100%;           
  height: 100%;          
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  overflow: hidden;
  padding: 20px;
  cursor: grab;
  box-sizing: border-box;
`;
