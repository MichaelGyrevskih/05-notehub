import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onSearch: (value: string) => void;
}

 function SearchBox({ onSearch }: SearchBoxProps) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue] = useDebounce(inputValue, 500);

  useEffect(() => {
    onSearch(debouncedValue.trim());
  }, [debouncedValue, onSearch]);

  return (
    <div className={css.wrapper}>
      <input
        type="text"
        placeholder="Search notes..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={css.input}
      />
    </div>
  );
}
export default SearchBox;