import { useState } from "react";
import toast from "react-hot-toast";
import css from "./SearchBar.module.css";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

function SearchBar({ onSubmit }: SearchBarProps) {
  const [query, setQuery] = useState("");

  async function handleSubmit(formData: FormData) {
    const value = formData.get("query") as string;
    if (!value) {
      toast.error("Please enter your search query.");
      return;
    }
    onSubmit(value);
    setQuery("");
  }

  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form className={css.form} action={handleSubmit}>
          <input
            className={css.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
            value={query} //Привязывает значение поля к переменной query из useState.
            onChange={(e) => setQuery(e.target.value)}//Обновляет query при каждом вводе.
          />
          <button className={css.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}

export default SearchBar;



//const value = formData.get("query")?.toString().trim(); Если formData.get("query") вернёт null, то ?.toString() не вызовется, и не будет ошибки.
//Это безопасный способ получить строку, только если значение существует.