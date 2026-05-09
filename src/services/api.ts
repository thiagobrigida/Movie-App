import axios from 'axios';

// Configuração base para buscar os filmes 
const api = axios.create({
  baseURL: 'https://www.omdbapi.com/',
});

export const API_KEY = '75709455'; 

export default api;