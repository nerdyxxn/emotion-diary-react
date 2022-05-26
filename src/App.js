import React, { useEffect, useReducer, useRef } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";

const reducer = (state, action) => {
  let newState = [];
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      newState = [action.data, ...state];
      break;
    }
    case "REMOVE": {
      newState = state.filter(it => it.id !== action.targetId);
      break;
    }
    case "EDIT": {
      newState = state.map(it =>
        it.id === action.data.id ? { ...action.data } : it
      );
      break;
    }
    default:
      return state;
  }
  localStorage.setItem("diary", JSON.stringify(newState));
  return newState;
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  const [data, dispatch] = useReducer(reducer, []);

  // App 컴포넌트 마운트될 때 localStorage에서 데이터 가져오기
  useEffect(() => {
    const localData = localStorage.getItem("diary");
    if (localData) {
      // 직렬화 되어있는 localData를 다시 복원
      const diaryList = JSON.parse(localData).sort(
        (a, b) => parseInt(b.id) - parseInt(a.id)
      );
      // dataId 중복되지 않도록 localStorage 안에 있는 id 중 가장 큰 값에 +1 해주기
      // sort 사용해 내림차순으로 정렬한 다음 0번째 요소 가져올 것
      dataId.current = parseInt(diaryList[0].id) + 1;

      // 가져온 diaryList를 data state의 초기값으로 설정
      dispatch({
        type: "INIT",
        data: diaryList,
      });
    }
  }, []);

  const dataId = useRef(0);

  // CREATE
  const onCreate = (date, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: {
        id: dataId.current,
        emotion,
        content,
        date: new Date(date).getTime(),
      },
    });
    dataId.current += 1;
  };

  // REMOVE
  const onRemove = targetId => {
    dispatch({ type: "REMOVE", targetId });
  };

  // EDIT
  const onEdit = (targetId, date, content, emotion) => {
    dispatch({
      type: "EDIT",
      data: {
        id: targetId,
        emotion,
        content,
        date: new Date(date).getTime(),
      },
    });
  };

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={{ onCreate, onEdit, onRemove }}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<New />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/diary/:id" element={<Diary />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
