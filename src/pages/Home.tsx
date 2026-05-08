import React, { useEffect, useState } from 'react';
import api, { API_KEY } from '../services/api';

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca inicial de filmes (Ex: Batman) para popular a tela
    api.get(`?s=Batman&apikey=${API_KEY}`)
      .then(response => {
        setMovies(response.data.Search || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar filmes", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Carregando filmes...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🎬 Catálogo de Filmes</h1>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ background: '#e50914', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px' }}>Sair</button>
      </header>

      {/* Grid Responsivo (Requisito: Mobile, Tablet, Desktop) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '20px' 
      }}>
        {movies.map(movie => (
          <div key={movie.imdbID} style={{ background: '#1f1f1f', padding: '10px', borderRadius: '8px' }}>
            <img src={movie.Poster} alt={movie.Title} style={{ width: '100%', borderRadius: '4px' }} />
            <h3 style={{ fontSize: '1rem', marginTop: '10px' }}>{movie.Title}</h3>
            <p style={{ color: '#aaa' }}>{movie.Year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;