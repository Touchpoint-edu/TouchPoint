import React, {useState} from "react";

const textStyles = "text-lg text-grey-darker font-sans";

export default function FloatingTF({
  className,
  name,
  placeholder,
  value,
  onChange,
  type,
  error,
  onBlur,
}) {
  const [active, setActive] = useState(false);

  function handleActivation(e) {
    const prevState = active;
    const currState = !!e.target.value;
    if (currState !== prevState) setActive(currState);
    !!onChange && onChange(e);
  }

  return (
      <input
        className={[
          textStyles,
          "outline-none w-100 rounded bg-transparent text-sm my-3 px-3 py-2",
          "transition-all duration-200 ease-in-out",
          active && "pt-7",
        ].join(" ")}
        type={type}
        name={name}
        value={value}
        onChange={handleActivation}
        onBlur={onBlur}
        placeholder = {placeholder}
      />
  );
}