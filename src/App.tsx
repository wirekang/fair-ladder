import { useEffect, useState } from "react";
import { Admin } from "./Admin";
import { Ladder } from "./Ladder";
import { SetName } from "./SetName";
import { MAX_OPTION } from "./utils/const";
import { getLatestRoundTitle, getMyOptions, getUsers } from "./utils/data";
import { addDataListener, DBSchema, isAdmin, removeDataListener, setOptions } from "./utils/db";

function App() {
  const [data, setData] = useState<DBSchema>({ round: {} });
  const [isLadder, setIsLadder] = useState(false);

  useEffect(() => {
    const l = (v: DBSchema) => {
      setData(v);
    };
    addDataListener(l);
    return () => {
      removeDataListener(l);
    };
  }, []);

  const [userName, setUserName] = useState(localStorage.getItem("name"));
  const [optionsLocal, setOptionsLocal] = useState("");

  if (userName === null || typeof userName !== "string" || userName.length < 2) {
    return <SetName setName={setUserName} />;
  }

  if (isLadder) {
    return (
      <Ladder
        data={data}
        onEnd={() => {
          setIsLadder(false);
        }}
      />
    );
  }

  const onSetOptions = () => {
    if (!userName) {
      alert("이름을 설정하세요");
      return;
    }

    setOptionsLocal("");
    setOptions(data, userName, optionsLocal);
  };

  const latestRoundTitle = getLatestRoundTitle(data);
  const onLadder = () => {
    setIsLadder(true);
  };
  const users = getUsers(data);

  return (
    <div className="App">
      <div className="subTitle">진행중인 사다리 타기</div>
      <div className="title">{`${latestRoundTitle}`}</div>

      <hr />
      <div className="subTitle">
        현재 선택지를 등록한 사람들:
        <div className="title">{users.join(", ")}</div>
      </div>
      <hr />
      <div className="subTitle">
        {userName}님 선택지들을 입력하고 엔터를 누르세요.
        <div>(쉼표로 구분, 최대 {MAX_OPTION}개까지 입력 가능, 바꾸려면 다시 입력하고 엔터)</div>
      </div>
      <div>
        <div>현재 등록된 선택지:</div>
        {getMyOptions(data, userName).map((o, i) => (
          <span key={i} className="options">
            {i + 1}. {o}
          </span>
        ))}
      </div>
      <input
        className="optionInput"
        type="text"
        value={optionsLocal}
        onChange={(e) => setOptionsLocal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSetOptions();
          }
        }}
      />
      <hr />
      {users.length > 1 && (
        <div>
          <button className="startButton" onClick={onLadder}>
            사다리타기 시작
          </button>
        </div>
      )}

      {isAdmin() && <Admin />}
    </div>
  );
}

export default App;
