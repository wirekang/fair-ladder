import { useState } from "react";

interface Props {
  setName: (v: string) => void;
}

export function SetName(props: Props): JSX.Element {
  const [value, setValue] = useState("");

  return (
    <div>
      <div className="title">이름을 입력하세요.</div>
      <input
        className="nameInput"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            localStorage.setItem("name", value);
            props.setName(value);
          }
        }}
      />
    </div>
  );
}
