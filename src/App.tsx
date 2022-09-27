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

  return (
    <div className="App">
      <div className="subTitle">진행중인 사다리 타기</div>
      <div className="title">{`${latestRoundTitle}`}</div>

      <hr />
      <div>현재 등록한 사람 명단</div>
      {getUsers(data).map(([userName]) => (
        <span key={userName}>{userName},</span>
      ))}
      <hr />
      <div className="subTitle">
        {userName}님 선택지를 입력하세요. (쉼표로 구분, 최대 {MAX_OPTION}개까지 입력 가능)
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

      <div>
        <button className="startButton" onClick={onLadder}>
          사다리타기 시작
        </button>
      </div>

      {isAdmin() && <Admin />}
    </div>
  );
}

export default App;
