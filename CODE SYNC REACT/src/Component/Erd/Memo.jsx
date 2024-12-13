import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import styled from "styled-components";

const Memo = ({ memo, updateMemoPosition, updateMemo, deleteMemo }) => {
    const [text, setText] = useState(memo.content);
    const [title, setTitle] = useState(memo.title);
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    const memoRef = useRef(null);
    const contentRef = useRef(null);

    // 제목 수정 후, 상태 업데이트
    const handleTitleBlur = (e) => {
        const newTitle = e.target.value || "Untitled";
        setTitle(newTitle);
        if (newTitle !== memo.memoTitle) {
            updateMemo(memo.id, { text, title: newTitle }); 
        }
        setIsEditingTitle(false); 
    };

    // 제목을 클릭하면 편집 모드로 변경
    const handleTitleClick = () => {
        setIsEditingTitle(true); // 제목 편집 모드 활성화
    };

    // 제목 수정 중에 상태 업데이트
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    // 내용이 수정된 후, 커서가 다른 곳으로 이동하면 상태 업데이트
    const handleTextBlur = () => {
        const newText = contentRef.current.innerText;
        setText(newText);
        if (newText !== memo.content) {
            updateMemo(memo.id, { text: newText, title });
        }
    };

    // 상태가 변경되면 updateMemo 호출
    useEffect(() => {
        if (memo.content !== text || memo.memoTitle !== title) {
            updateMemo(memo.id, { text, title });
        }
    }, [text, title, memo.id, memo.content, memo.memoTitle, updateMemo]);

    // 메모 삭제 기능
    const handleDeleteMemo = (e) => {
        e.stopPropagation(); // 클릭 이벤트 전파 방지
        deleteMemo(memo.id); // 삭제 동작
    };

    return (
        <Draggable
            nodeRef={memoRef}
            position={memo.position}
            onStop={(e, data) => {
                updateMemoPosition(memo.id, { x: data.x, y: data.y });
            }}
        >
            <MemoText ref={memoRef} className="memo">
                {isEditingTitle ? (
                    <TitleInput
                        type="text"
                        value={title} 
                        onBlur={handleTitleBlur} 
                        onChange={handleTitleChange} 
                        autoFocus
                    />
                ) : (
                    <MemoTitle onClick={handleTitleClick}>{title}</MemoTitle>
                )}
                <DeleteButton onClick={handleDeleteMemo}>X</DeleteButton>
                <MemoContent
                    ref={contentRef}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onBlur={handleTextBlur}
                >
                    {text}
                </MemoContent>
            </MemoText>
        </Draggable>
    );
};

export default Memo;

const MemoText = styled.div`
    position: absolute;
    padding: 15px;
    background-color: #ffeb99;
    border: 1px solid #ffd700;
    border-radius: 6px;
    width: 100px;
    height: auto;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
    background-image: linear-gradient(135deg, #fff8b3 25%, transparent 25%) -50px 0,
                      linear-gradient(225deg, #fff8b3 25%, transparent 25%) -50px 0,
                      linear-gradient(45deg, #fff8b3 25%, transparent 25%),
                      linear-gradient(315deg, #fff8b3 25%, transparent 25%);
    background-size: 50px 50px;
    background-position: 0 0, 0 0, 0 0, 0 0;
`;

const MemoTitle = styled.div`
    font-weight: bold;
    font-size: 12px;
    min-height: 20px;
    outline: none;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #4f4f4f;
    cursor: pointer;

    :empty:before {
        content: "Untitled";
        color: #bbb;
    }
`;

const TitleInput = styled.input`
    font-weight: bold;
    font-size: 12px;
    min-height: 20px;
    border: none;
    outline: none;
    background: none;
    color: #4f4f4f;
    width: 100%;
`;

const MemoContent = styled.div`
    font-size: 10px;
    min-height: 50px;
    padding: 5px;
    border-top: 1px solid #ffd700;
    margin-top: 5px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    outline: none;
    color: #4f4f4f;

    :empty:before {
        content: "Click to edit";
        color: #bbb;
    }
`;

const DeleteButton = styled.button`
    background-color: #ffeb99;
    color: gray;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    font-size: 12px;
    cursor: pointer;
    margin-left: 10px;
    position: absolute;
    top: 10px;
    right: 10px;

    :hover {
        background-color: #ff1a1a;
    }
`;
