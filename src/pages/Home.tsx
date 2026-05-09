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
  const [searchTerm, setSearchTerm] = useState('Marvel'); // 'Marvel' ainda é o padrão inicial

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

  const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const response = await api.get(`?s=${searchTerm}&apikey=${API_KEY}`);
    if (response.data.Search) {
      setApiMovies(response.data.Search);
    } else {
      alert("Nenhum filme encontrado!");
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
  };

  /**
 * Importa um filme da API para a Coleção Pessoal
 * @param apiMovie Objeto do filme vindo da OMDb
 */
  const handleImportMovie = (apiMovie: Movie) => {
  // Verifica se o filme já existe na coleção para não duplicar
  const alreadyExists = myMovies.find(m => m.imdbID === apiMovie.imdbID);
  if (alreadyExists) {
    alert("Este filme já está na sua coleção!");
    return;
  }
  // Cria a cópia com a flag 'isCustom' para permitir edição/exclusão depois
  const movieToImport = {
    ...apiMovie,
    isCustom: true
  };
  const updatedList = [movieToImport, ...myMovies];
  setMyMovies(updatedList);
  localStorage.setItem('@MyMovies', JSON.stringify(updatedList));
  alert(`${apiMovie.Title} foi adicionado à sua coleção! ⭐`);
};

  if (loading) return <div style={centerStyle}>Carregando catálogo...</div>;

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={{ color: '#E50914' }}>Movie APP</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={openAddModal} style={addButtonStyle}>+ Novo Filme</button>
          <button onClick={handleLogout} style={logoutButtonStyle}>Sair</button>
        </div>
      </header>

      {/* SEÇÃO 1: BARRA DE BUSCA */}
      <form onSubmit={handleSearch} style={{ marginBottom: '40px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Pesquisar filmes na API..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
        <button type="submit" style={addButtonStyle}>Buscar na Nuvem</button>
      </form>

      {/* SEÇÃO 2: MEUS FILMES (LocalStorage) */}
      {myMovies.length > 0 && (
        <section style={{ marginBottom: '50px' }}>
          <h2 style={sectionTitleStyle}>Meus Filmes</h2>
          <div style={gridStyle}>
            {myMovies.map((movie) => (
              <div key={movie.imdbID} style={{ ...cardStyle, border: '1px solid #E50914' }}> 
                
                {/* BLOCO DA IMAGEM / PLACEHOLDER */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '2/3', background: '#1a1a1a', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                  {/* Criamos um estado local ou usamos uma técnica de 'target' para esconder a imagem 
                      se ela falhar, mostrando o placeholder que está por baixo.
                  */}
                  {movie.Poster && movie.Poster !== 'N/A' ? (
                    <img 
                      src={movie.Poster} 
                      alt={movie.Title} 
                      style={{ ...imageStyle, display: 'block', position: 'absolute', top: 0, left: 0, zIndex: 2 }} 
                      onError={(e) => { 
                        // Se a imagem falhar, nós a escondemos
                        (e.target as HTMLImageElement).style.display = 'none'; 
                      }}
                    />
                  ) : null}

                  {/* Este bloco fica SEMPRE por baixo. Se a imagem acima sumir ou não existir, ele aparece */}
                  <div style={{ textAlign: 'center', padding: '10px', zIndex: 1 }}>
                    <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>🎬</span>
                    <p style={{ fontSize: '12px', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      Cartaz Indisponível
                    </p>
                  </div>
                </div>

                <div style={{ padding: '12px' }}>
                  <h3 style={titleStyle}>{movie.Title}</h3>
                  <p style={{ color: '#aaa', fontSize: '12px' }}>{movie.Year}</p>
                  <div style={actionsStyle}>
                    <button onClick={() => openEditModal(movie)} style={editButtonStyle}>Editar</button>
                    <button onClick={() => handleDeleteMovie(movie.imdbID)} style={deleteButtonStyle}>Excluir</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SEÇÃO 3: RESULTADOS DA API */}
      <section>
        <h2 style={sectionTitleStyle}>Resultados da OMDb</h2>
        <div style={gridStyle}>
          {apiMovies.map((movie) => (
            <div key={movie.imdbID} style={cardStyle}>
              
              {/* BLOCO DA IMAGEM / PLACEHOLDER */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '2/3', background: '#1a1a1a', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                {/* Criamos um estado local ou usamos uma técnica de 'target' para esconder a imagem 
                    se ela falhar, mostrando o placeholder que está por baixo.
                */}
                {movie.Poster && movie.Poster !== 'N/A' ? (
                  <img 
                    src={movie.Poster} 
                    alt={movie.Title} 
                    style={{ ...imageStyle, display: 'block', position: 'absolute', top: 0, left: 0, zIndex: 2 }} 
                    onError={(e) => { 
                      // Se a imagem falhar, nós a escondemos
                      (e.target as HTMLImageElement).style.display = 'none'; 
                    }}
                  />
                ) : null}

                {/* Este bloco fica SEMPRE por baixo. Se a imagem acima sumir ou não existir, ele aparece */}
                <div style={{ textAlign: 'center', padding: '10px', zIndex: 1 }}>
                  <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>🎬</span>
                  <p style={{ fontSize: '12px', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Cartaz Indisponível
                  </p>
                </div>
              </div>

              {/* INFORMAÇÕES E BOTÃO */}
              <div style={{ padding: '12px' }}>
                <h3 style={titleStyle}>{movie.Title}</h3>
                <p style={{ color: '#aaa', fontSize: '12px' }}>{movie.Year}</p>
                
                <button 
                  onClick={() => handleImportMovie(movie)}
                  style={importButtonStyle}
                >
                  Adicionar à Coleção
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isModalOpen && (
        <AddMovieModal onAdd={handleSaveMovie} onClose={closeModal} movieToEdit={movieToEdit} />
      )}
    </div>
  );
};

// --- ESTILOS (Alinhados com as metas de Design e Responsividade) ---
const containerStyle: React.CSSProperties = { padding: '20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' };
const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' };
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '25px' };
const cardStyle: React.CSSProperties = {
  background: '#1a1a1a',
  borderRadius: '12px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease', // Efeito suave
  border: '1px solid #333',
  height: '100%'
};

const addButtonStyle = {
  padding: '12px 24px',
  backgroundColor: '#E50914',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold' as const,
  boxShadow: '0 4px 14px rgba(229, 9, 20, 0.4)'
};
const imageStyle: React.CSSProperties = { 
  width: '100%', 
  height: 'auto', 
  aspectRatio: '2 / 3',
  objectFit: 'cover',
  backgroundColor: '#000'
  };
const titleStyle: React.CSSProperties = { fontSize: '16px', color: 'white', margin: '8px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const actionsStyle: React.CSSProperties = { display: 'flex', gap: '8px', marginTop: '12px' };
const centerStyle: React.CSSProperties = { color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' };
const searchInputStyle = {
  flex: 1,
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #333',
  background: '#1a1a1a',
  color: '#fff',
  fontSize: '16px',
  outline: 'none'
};
const logoutButtonStyle = { padding: '10px', background: 'transparent', color: '#ccc', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' };
const editButtonStyle = { flex: 1, padding: '6px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
const deleteButtonStyle = { flex: 1, padding: '6px', background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };
const sectionTitleStyle: React.CSSProperties = {
  color: '#fff',
  fontSize: '22px',
  marginBottom: '20px',
  paddingLeft: '5px',
  borderLeft: '4px solid #E50914', // Um detalhe elegante no início do título
  lineHeight: '1.2'
};
const importButtonStyle = {
  marginTop: '10px',
  width: '100%',
  padding: '8px',
  backgroundColor: 'transparent',
  color: '#f1c40f', // Amarelo estrela
  border: '1px solid #f1c40f',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold' as const,
  transition: 'all 0.2s'
};
const placeholderContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  width: '100%',
  backgroundColor: '#1a1a1a',
};

export default Home;
