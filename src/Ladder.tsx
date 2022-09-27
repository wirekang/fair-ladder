import { useState } from "react";
import { LadderRender } from "./LadderRender";
import { getOptions } from "./utils/data";
import { DBSchema } from "./utils/db";

interface Props {
  onEnd: () => void;
  data: DBSchema;
}

export function Ladder(props: Props): JSX.Element {
  const options = getOptions(props.data);
  const [isRender, setIsRender] = useState(false);

  const onStart = () => {
    setIsRender(false);
    setTimeout(() => {
      setIsRender(true);
    }, 500);
  };

  return (
    <div>
      <div className="title">
        "공정한" 사다리타기
        <div>
          <button onClick={onStart}>시작하기</button>
          <button onClick={props.onEnd}>종료</button>
        </div>
      </div>
      {isRender && <LadderRender options={options} />}
    </div>
  );
}
