import React, { useEffect, useState } from 'react';
import api, { API_KEY } from '../services/api';
import AddMovieModal from '../components/AddMovieModal';
import { useNavigate } from 'react-router-dom';

/**
 * Interface Movie: Define a estrutura de dados para consistência no TypeScript.
 * Cobre o requisito de organização e tipagem.
 */
interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  isCustom?: boolean; // Flag para identificar filmes criados manualmente
}

const Home: React.FC = () => {
  // ESTADOS DA APLICAÇÃO
  const [apiMovies, setApiMovies] = useState<Movie[]>([]); // Dados da API externa [cite: 25]
  const [myMovies, setMyMovies] = useState<Movie[]>([]);   // Dados do LocalStorage [cite: 25]
  const [loading, setLoading] = useState(true);            // Feedback visual de carregamento [cite: 50]
  const [isModalOpen, setIsModalOpen] = useState(false);   // Controle do Modal de CRUD
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null); // Estado para o Update

  const navigate = useNavigate();

  /**
   * Ciclo de Vida: Busca dados iniciais da API e do LocalStorage (Semana 2).
   */
  useEffect(() => {
    async function loadInitialData() {
      try {
        // Consome API pública à escolha (Ex: Marvel) [cite: 10, 56]
        const response = await api.get(`?s=Marvel&apikey=${API_KEY}`);
        if (response.data.Search) {
          setApiMovies(response.data.Search);
        }

        // Recupera dados salvos localmente para o CRUD [cite: 25, 76]
        const saved = localStorage.getItem('@MyMovies');
        if (saved) {
          setMyMovies(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Erro ao carregar dados da API:", error); // Tratamento de erro [cite: 51]
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  /**
   * CREATE / UPDATE: Salva ou atualiza um filme no LocalStorage[cite: 24, 76].
   */
  const handleSaveMovie = (movieData: Movie) => {
    let updatedList;

    const exists = myMovies.find(m => m.imdbID === movieData.imdbID);

    if (exists) {
      // Lógica de UPDATE (Editar)
      updatedList = myMovies.map(m => m.imdbID === movieData.imdbID ? movieData : m);
    } else {
      // Lógica de CREATE (Adicionar)
      updatedList = [movieData, ...myMovies];
    }

    setMyMovies(updatedList);
    localStorage.setItem('@MyMovies', JSON.stringify(updatedList));
    closeModal();
  };

  /**
   * DELETE: Remove um filme da lista customizada[cite: 24, 76].
   */
  const handleDeleteMovie = (id: string) => {
    if (window.confirm("Deseja realmente excluir este filme?")) {
      const filtered = myMovies.filter(m => m.imdbID !== id);
      setMyMovies(filtered);
      localStorage.setItem('@MyMovies', JSON.stringify(filtered));
    }
  };

  /**
   * Funções de Controle da Interface (UX)
   */
  const openAddModal = () => {
    setMovieToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (movie: Movie) => {
    setMovieToEdit(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMovieToEdit(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated'); // Requisito de Login [cite: 21, 67]
    navigate('/login');
  };

  // Combinação dos dados para exibição (Read completo) [cite: 25]
  const allMovies = [...myMovies, ...apiMovies];

  if (loading) return <div style={centerStyle}>Carregando catálogo...</div>;

  return (
    <div style={containerStyle}>
      {/* Cabeçalho Reutilizável [cite: 72] */}
      <header style={headerStyle}>
        <h1 style={{ color: '#E50914' }}>🎥 MovieChallenge</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={openAddModal} style={addButtonStyle}>+ Novo Filme</button>
          <button onClick={handleLogout} style={logoutButtonStyle}>Sair</button>
        </div>
      </header>

      {/* Grid Responsivo: Mobile, Tablet e Desktop  */}
      <div style={gridStyle}>
        {allMovies.map((movie) => (
          <div key={movie.imdbID} style={cardStyle}>
            <img 
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450'} 
              alt={movie.Title} 
              style={imageStyle} 
            />
            <div style={{ padding: '12px' }}>
              <h3 style={titleStyle}>{movie.Title}</h3>
              <p style={{ color: '#aaa', fontSize: '12px' }}>{movie.Year}</p>
              
              {/* Opções de Manipulação Dinâmica para itens criados [cite: 24] */}
              {movie.isCustom && (
                <div style={actionsStyle}>
                  <button onClick={() => openEditModal(movie)} style={editButtonStyle}>Editar</button>
                  <button onClick={() => handleDeleteMovie(movie.imdbID)} style={deleteButtonStyle}>Excluir</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Formulário: Reutilizado para Create e Update [cite: 29] */}
      {isModalOpen && (
        <AddMovieModal 
          onAdd={handleSaveMovie} 
          onClose={closeModal} 
          movieToEdit={movieToEdit} 
        />
      )}
    </div>
  );
};

// --- ESTILOS (Alinhados com as metas de Design e Responsividade) ---
const containerStyle: React.CSSProperties = { padding: '20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' };
const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' };
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '25px' };
const cardStyle: React.CSSProperties = { background: '#1f1f1f', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s' };
const imageStyle: React.CSSProperties = { width: '100%', height: '300px', objectFit: 'cover' };
const titleStyle: React.CSSProperties = { fontSize: '16px', color: 'white', margin: '8px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const actionsStyle: React.CSSProperties = { display: 'flex', gap: '8px', marginTop: '12px' };
const centerStyle: React.CSSProperties = { color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' };

const addButtonStyle = { padding: '10px 20px', background: '#E50914', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const logoutButtonStyle = { padding: '10px', background: 'transparent', color: '#ccc', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' };
const editButtonStyle = { flex: 1, padding: '6px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
const deleteButtonStyle = { flex: 1, padding: '6px', background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };

export default Home;