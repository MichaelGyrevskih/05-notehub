import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import fetchMovies from "../../services/movieService";
import type { Movie } from "../../types/movie";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: !!searchQuery,// запрос выполняется только если есть строка поиска
    placeholderData:keepPreviousData, // чтобы не мигала сетка при переключении страниц
  });

  function handleSearch(query: string) {
    if (!query.trim()) {
      toast.error("Please enter a search term.");
      return;
    }
    setSearchQuery(query);
    setPage(1);
  }

  return (
    <>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      {isLoading ?
        <Loader /> : isError ?
          <ErrorMessage /> :
          (
          <>
          <MovieGrid movies={data?.results ?? []} onSelect={setSelectedMovie} />
          {data && data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (<MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />)}
    </>
  );
}

export default App;
