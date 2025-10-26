import tmdb from "../api/tmdb";
import type { Movie } from "../types/movie";

interface AxiosMovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

async function fetchMovies(query: string, page: number = 1) {
  const response = await tmdb.get<AxiosMovieResponse>("/search/movie", {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page,
    },
  });

  return response.data;
}

export default fetchMovies;
