import axios from 'axios';

const tmdb = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {},
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
});

export default tmdb;
