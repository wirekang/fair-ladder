import { createRound } from "./utils/db";

interface Props {}

export function Admin(props: Props): JSX.Element {
  const onCreateRound = () => {
    if (window.confirm("ㄹㅇ?")) {
      createRound();
    }
  };
  return (
    <div className="adminContainer">
      <button onClick={onCreateRound}>라운드 초기화</button>
    </div>
  );
}
