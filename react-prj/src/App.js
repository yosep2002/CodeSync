import React, { useState, useCallback, } from "react";
import Toolbar from "./Components/Toolbar";
import Canvas from "./Components/Canvas";
import Table from "./Components/Table";
import Memo from "./Components/Memo";
import Arrow from "./Components/Arrow";
import "./App.css";
import Sidebar from "./Components/Sidebar";

const App = () => {
  const [tables, setTables] = useState([]);
  const [memos, setMemos] = useState([]);
  const [arrows, setArrows] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isAddingArrow, setIsAddingArrow] = useState(false);

  // 테이블 추가
  const addTable = useCallback((position) => {
    setTables((prevTables) => [
      ...prevTables,
      {
        id: `table-${prevTables.length + 1}`,
        name: "Undefined",
        position,
        fields: [],
      },
    ]);
  }, []);

  // 테이블 업데이트
  const updateTable = useCallback((id, updatedTable) => {
    setTables((prevTables) =>
      prevTables.map((table) => (table.id === id ? updatedTable : table))
    );
  }, []);

  // 테이블 삭제
  const deleteTable = useCallback((id) => {
    setTables((prevTables) => prevTables.filter((table) => table.id !== id));
    setArrows((prevArrows) =>
      prevArrows.filter((arrow) => arrow.startId !== id && arrow.endId !== id)
    );
  }, []);

  // 테이블 복사
  const copyTable = useCallback((table) => {
    setTables((prevTables) => [
      ...prevTables,
      {
        ...table,
        id: `table-${prevTables.length + 1}`,
        name: `Copy of ${table.name}`,
        position: {
          x: table.position.x + 20,
          y: table.position.y + 20,
        },
      },
    ]);
  }, []);

  // 메모 추가
  const addMemo = useCallback((position) => {
    setMemos((prevMemos) => [
      ...prevMemos,
      {
        id: `memo-${prevMemos.length + 1}`,
        position,
        text: "",
      },
    ]);
  }, []);

  const deleteMemo = useCallback((id) => {
    setMemos((prevMemos) => prevMemos.filter((memo) => memo.id !== id));
  }, []);

  const updateMemo = useCallback((id, updatedMemo) => {
    setMemos((prevMemos) =>
      prevMemos.map((memo) =>
        memo.id === id ? { ...memo, ...updatedMemo } : memo
      )
    );
  }, []);


  const updateTablePosition = useCallback((id, newPosition) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === id ? { ...table, position: newPosition } : table
      )
    );

    // 화살표의 시작/끝이 이 테이블과 연결되어 있으면 화살표 위치도 업데이트
    setArrows((prevArrows) =>
      prevArrows.map((arrow) => {
        if (arrow.startId === id) {
          return { ...arrow, startPosition: newPosition };
        }
        if (arrow.endId === id) {
          return { ...arrow, endPosition: newPosition };
        }
        return arrow;
      })
    );
  }, []);


  const updateMemoPosition = useCallback((id, newPosition) => {
    setMemos((prevMemos) =>
      prevMemos.map((memo) =>
        memo.id === id ? { ...memo, position: newPosition } : memo
      )
    );
  }, []);


  // 화살표 추가 모드 활성화 및 테이블 클릭 처리
  const handleTableClick = useCallback(
    (id) => {
      if (!isAddingArrow) return;

      if (!selectedTable) {
        setSelectedTable(id); // 시작 테이블 설정
      } else if (selectedTable !== id) {
        // 연결된 테이블 가져오기
        const startTable = tables.find((table) => table.id === selectedTable);
        const endTable = tables.find((table) => table.id === id);

        if (startTable && endTable) {
          // 이미 연결된 화살표가 있는지 확인
          const arrowExists = arrows.some(
            (arrow) =>
              (arrow.startId === selectedTable && arrow.endId === id) ||
              (arrow.startId === id && arrow.endId === selectedTable)
          );

          if (!arrowExists) {
            // 시작 테이블에서 Primary Key 찾기
            const primaryKey = startTable.fields.find((field) => field.isPrimary);

            if (primaryKey) {
              // 끝 테이블에 Foreign Key 추가
              setTables((prevTables) =>
                prevTables.map((table) =>
                  table.id === endTable.id
                    ? {
                      ...table,
                      fields: [
                        ...table.fields,
                        {
                          ...primaryKey,
                          name: `${primaryKey.name}`,
                          isPrimary: false,
                          isForeign: true, // Foreign Key로 설정
                        },
                      ],
                    }
                    : table
                )
              );
            }

            // 화살표 추가
            setArrows((prevArrows) => [
              ...prevArrows,
              { startId: selectedTable, endId: id },
            ]);
          }
        }

        setSelectedTable(null); // 선택 초기화
        setIsAddingArrow(false); // 화살표 추가 모드 종료
      }
    },
    [isAddingArrow, selectedTable, tables, arrows]
  );

  return (
    <div className="app-container">
      <div className="content">
        <Toolbar
          onAddTable={addTable}
          onAddMemo={addMemo}
          onAddArrow={() => setIsAddingArrow(true)}  // 화살표 추가 모드 활성화
        />
        <Canvas tables={tables} arrows={arrows}>
          {tables.map((table) => (
            <Table
              key={table.id}
              table={table}
              updatePosition={updateTablePosition}
              updateTable={updateTable}
              deleteTable={deleteTable}
              copyTable={copyTable}
              handleTableClick={handleTableClick}
            />
          ))}
          {memos.map((memo) => (
            <Memo
              key={memo.id}
              memo={memo}
              updateMemo={updateMemo}
              deleteMemo={deleteMemo}
              updateMemoPosition={updateMemoPosition}
            />
          ))}
          {arrows.map((arrow, index) => {
            const startTable = tables.find((table) => table.id === arrow.startId);
            const endTable = tables.find((table) => table.id === arrow.endId);

            if (startTable && endTable) {
              return (
                <Arrow
                  key={index}
                  startPosition={startTable.position}
                  endPosition={endTable.position}
                />
              );
            }
            return null;
          })}
        </Canvas>
        <Sidebar />
      </div>
    </div>
  );
};

export default App;
