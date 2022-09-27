import { createRound } from "./utils/db";

interface Props {}

export function Admin(props: Props): JSX.Element {
  const onCreateRound = () => {
    createRound();
  };
  return (
    <div className="adminContainer">
      <button onClick={onCreateRound}>라운드 생성</button>
    </div>
  );
}
