import { getOptions } from "./utils/data";
import { DBSchema } from "./utils/db";

interface Props {
  onEnd: () => void;
  data: DBSchema;
}

export function Ladder(props: Props): JSX.Element {
  const options = getOptions(props.data);
  return (
    <div>
      사다리타기
      <div>{options.join("__")}</div>
      <div>
        <button onClick={props.onEnd}>종료</button>
      </div>
    </div>
  );
}
