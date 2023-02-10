import React, { useEffect, useRef, useState } from "react";

function ControlledInput(props: React.HTMLProps<HTMLInputElement>) {
  const { value, onChange, ...rest } = props;
  const [cursor, setCursor] = useState<number | null>(null);
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const input = ref.current;
    if (input) input.setSelectionRange(cursor, cursor);
  }, [ref, cursor, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCursor(e.target.selectionStart);
    onChange && onChange(e);
  };

  return <input ref={ref} value={value} onChange={handleChange} {...rest} />;
}
export default ControlledInput;
