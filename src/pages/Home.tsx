import React, { useEffect, useState } from 'react';
import api, { API_KEY } from '../services/api';
import AddMovieModal from '../components/AddMovieModal';
import { useNavigate } from 'react-router-dom';
import {User, Popcorn, Video, Crown} from 'lucide-react'
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
  const [apiMovies, setApiMovies] = useState<Movie[]>([]); // Dados da API externa
  const [myMovies, setMyMovies] = useState<Movie[]>([]);   // Dados do LocalStorage
  const [loading, setLoading] = useState(true);            // Feedback visual de carregamento
  const [isModalOpen, setIsModalOpen] = useState(false);   // Controle do Modal de CRUD
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null); // Estado para o Update
  const [searchTerm, setSearchTerm] = useState('Marvel'); // 'Marvel' ainda é o padrão inicial
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [userName, setUserName] = useState(() => localStorage.getItem('@User_Name') || 'Membro EJ');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('@User_Avatar') || 'user');
  const [activeTab, setActiveTab] = useState<'all' | 'my-movies' | 'api'>('all');

  const navigate = useNavigate();

  /**
   * Ciclo de Vida: Busca dados iniciais da API e do LocalStorage (Semana 2).
   */
  useEffect(() => {
    async function loadInitialData() {
      try {
        // Consome API pública à escolha (Ex: Marvel)
        const response = await api.get(`?s=Marvel&apikey=${API_KEY}`);
        if (response.data.Search) {
          setApiMovies(response.data.Search);
        }

        // Recupera dados salvos localmente para o CRUD
        const saved = localStorage.getItem('@MyMovies');
        if (saved) {
          setMyMovies(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Erro ao carregar dados da API:", error); // Tratamento de erro
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  /**
   * CREATE / UPDATE: Salva ou atualiza um filme no LocalStorage.
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
   * DELETE: Remove um filme da lista customizada.
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
    localStorage.removeItem('isAuthenticated'); // Requisito de Login
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

  const handleViewDetails = async (id: string) => {
  // 1. Verifica se o filme clicado faz parte dos MEUS FILMES (LocalStorage)
  const localMovie = myMovies.find(m => m.imdbID === id);

  if (localMovie) {
    // Se for um filme customizado, abrimos o modal diretamente com os dados locais!
    setSelectedMovie({
      Title: localMovie.Title,
      Year: localMovie.Year,
      Poster: localMovie.Poster,
      Genre: (localMovie as any).Genre || 'Gênero não informado',
      Actors: (localMovie as any).Actors || 'Elenco não informado',
      Plot: (localMovie as any).Plot || 'Sinopse não disponível.',
      imdbRating: 'N/A' // Filmes autorais não possuem nota automática do IMDb
    });
  } else {
    // 2. Se não for local, significa que veio da API. Buscamos na OMDb normalmente
    try {
      const response = await api.get(`?i=${id}&plot=full&apikey=${API_KEY}`);
      setSelectedMovie(response.data);
    } catch (error) {
      alert("Erro ao carregar detalhes do filme.");
    }
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

  const renderAvatarIcon = (avatarName: string, size: number, color: string) => {
    switch (avatarName) {
      case 'popcorn': return <Popcorn size={size} color={color} />;
      case 'video': return <Video size={size} color={color} />;
      case 'crown': return <Crown size={size} color={color} />;
      default: return <User size={size} color={color} />;
    }
  };

  return (
    <div style={containerStyle}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px', 
        padding: '15px 0',
        borderBottom: '1px solid #222' // Linha subtil divisória
      }}>
        {/* LADO ESQUERDO: TÍTULO */}
        <h1 style={{ color: '#E50914', margin: 0, fontSize: '26px', letterSpacing: '1px' }}>
          Movie APP
        </h1>

        {/* LADO DIREITO: MENU DE NAVEGAÇÃO */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>
              Olá, <span style={{ color: '#E50914', fontWeight: 'bold' }}>{userName}</span>
            </span>
            <button 
            onClick={() => navigate('/dashboard')} 
            style={{ 
              padding: '3px 9px', 
              background: '#080808', 
              border: '1px', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <div style={{ 
              background: '#141414', 
              padding: '9px', 
              borderRadius: '50%', 
              border: '1px solid #E50914',
              justifyContent: 'center',
            }}>
              {renderAvatarIcon(avatar, 25, '#E50914')}
            </div>
          </button>
          </div>
        </nav>
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
        <button type="submit" style={addButtonStyle}>Buscar por nome</button>

        <button 
            onClick={openAddModal} 
            style={{ 
              padding: '10px 18px', 
              backgroundColor: '#E50914', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            + Novo Filme
          </button>

      </form>

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px', 
        borderBottom: '1px solid #222', 
        paddingBottom: '15px' 
      }}>
        <button 
          onClick={() => setActiveTab('all')} 
          style={{
            padding: '10px 20px',
            background: activeTab === 'all' ? '#E50914' : '#1a1a1a',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Ver Tudo
        </button>

        <button 
          onClick={() => setActiveTab('my-movies')} 
          style={{
            padding: '10px 20px',
            background: activeTab === 'my-movies' ? '#E50914' : '#1a1a1a',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Minha Coleção
        </button>

        <button 
          onClick={() => setActiveTab('api')} 
          style={{
            padding: '10px 20px',
            background: activeTab === 'api' ? '#E50914' : '#1a1a1a',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Busca IMDb
        </button>
      </div>

      {/* SEÇÃO 2: MEUS FILMES (LocalStorage) */}
      {(activeTab === 'all' || activeTab === 'my-movies') && myMovies.length > 0 && (
        <section style={{ marginBottom: '50px' }}>
          <h2 style={sectionTitleStyle}>Meus Filmes</h2>
          <div style={gridStyle}>
            {myMovies.map((movie) => (
              <div key={movie.imdbID} style={cardStyle}>                
                {/* BLOCO DA IMAGEM / PLACEHOLDER */}
                <div 
                onClick={() => handleViewDetails(movie.imdbID)}
                style={{ position: 'relative', width: '100%', aspectRatio: '2/3', background: '#1a1a1a', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', cursor: 'pointer' }}>
                  {movie.Poster && movie.Poster !== 'N/A' ? (
                    <img 
                      src={movie.Poster} 
                      alt={movie.Title} 
                      style={{ ...imageStyle, display: 'block', position: 'absolute', top: 0, left: 0, zIndex: 2 }} 
                      onError={(e) => { 
                        (e.target as HTMLImageElement).style.display = 'none'; 
                      }}
                    />
                  ) : null}

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
                    {/* e.stopPropagation() evita que o clique no botão abra os detalhes do filme */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); openEditModal(movie); }} 
                      style={editButtonStyle}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteMovie(movie.imdbID); }} 
                      style={deleteButtonStyle}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Se o usuário clicar em "Minha Coleção" mas não tiver filmes salvos, mostra um aviso legal */}
      {activeTab === 'my-movies' && myMovies.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p style={{ fontSize: '18px' }}>Sua coleção está vazia. Adicione filmes acima ou importe da busca! 🎬</p>
        </div>
      )}

      {/* SEÇÃO 3: RESULTADOS DA API */}
      {(activeTab === 'all' || activeTab === 'api') && (
      <section>
        <h2 style={sectionTitleStyle}>Resultados da OMDb</h2>
        <div style={gridStyle}>
          {apiMovies.map((movie) => (
            <div key={movie.imdbID} style={cardStyle}>              
              {/* BLOCO DA IMAGEM / PLACEHOLDER */}
              <div 
              onClick={() => handleViewDetails(movie.imdbID)}
              style={{ position: 'relative', width: '100%', aspectRatio: '2/3', background: '#1a1a1a', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', cursor: 'pointer' }}>
                {movie.Poster && movie.Poster !== 'N/A' ? (
                  <img 
                    src={movie.Poster} 
                    alt={movie.Title} 
                    style={{ ...imageStyle, display: 'block', position: 'absolute', top: 0, left: 0, zIndex: 2 }} 
                    onError={(e) => { 
                      (e.target as HTMLImageElement).style.display = 'none'; 
                    }}
                  />
                ) : null}

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
                  onClick={(e) => { e.stopPropagation(); handleImportMovie(movie); }}
                  style={importButtonStyle}
                >
                  Adicionar à Coleção
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* MODAL DE CADASTRO/EDIÇÃO (CRUD) */}
      {isModalOpen && (
        <AddMovieModal onAdd={handleSaveMovie} onClose={closeModal} movieToEdit={movieToEdit} />
      )}

      {/* MODAL DE DETALHES COMPLETOS (SINOPSE) */}
      {selectedMovie && (
        <div style={modalOverlayStyle} onClick={() => setSelectedMovie(null)}>
          <div style={detailsModalStyle} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedMovie(null)} style={closeButtonStyle}>X</button>
            
            <div style={detailsContainerStyle}>
              <div style={{ width: '250px', position: 'relative', aspectRatio: '2/3', background: '#1a1a1a', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px', overflow: 'hidden' }}>
                {selectedMovie.Poster && selectedMovie.Poster !== 'N/A' ? (
                  <img src={selectedMovie.Poster} alt={selectedMovie.Title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>🎬</span>
                    <p style={{ fontSize: '12px', color: '#666', fontWeight: 'bold' }}>SEM CARTAZ</p>
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h2 style={{ color: '#E50914', marginBottom: '10px' }}>{selectedMovie.Title}</h2>
                <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '14px' }}>
                  <strong>Ano:</strong> {selectedMovie.Year} | <strong>Duração:</strong> {selectedMovie.Runtime} | <strong>Gênero:</strong> {selectedMovie.Genre}
                </p>
                <p style={{ lineHeight: '1.6', color: '#fff', fontSize: '15px' }}>
                  {selectedMovie.Plot && selectedMovie.Plot !== 'N/A' ? selectedMovie.Plot : 'Sinopse não disponível.'}
                </p>
                <p style={{ marginTop: '20px', color: '#aaa', fontSize: '14px' }}>
                  <strong>Elenco:</strong> {selectedMovie.Actors && selectedMovie.Actors !== 'N/A' ? selectedMovie.Actors : 'Informação indisponível.'}
                </p>
                {selectedMovie.imdbRating && (
                  <p style={{ marginTop: '10px', color: '#f1c40f', fontSize: '14px' }}>
                    <strong>Nota IMDb:</strong> ⭐ {selectedMovie.imdbRating}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
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
  transition: 'transform 0.2s ease', 
  border: '1px solid #333',
  height: '100%',
  cursor: 'pointer'
};

const addButtonStyle = {
  padding: '12px 24px',
  backgroundColor: '#E50914',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold' as const,
  cursor: 'pointer',
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
  borderLeft: '4px solid #E50914',
  lineHeight: '1.2'
};

const importButtonStyle = {
  marginTop: '10px',
  width: '100%',
  padding: '8px',
  backgroundColor: 'transparent',
  color: '#f1c40f', 
  border: '1px solid #f1c40f',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold' as const,
  transition: 'all 0.2s'
};

// ESTILOS ADICIONADOS PARA O MODAL DE DETALHES
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.85)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2000
};

const detailsModalStyle: React.CSSProperties = {
  background: '#141414',
  padding: '40px',
  borderRadius: '12px',
  width: '90%',
  maxWidth: '750px',
  maxHeight: '85vh',
  overflowY: 'auto',
  position: 'relative',
  border: '1px solid #333'
};

const detailsContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '30px',
  flexWrap: 'wrap'
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '15px',
  right: '20px',
  background: 'transparent',
  border: 'none',
  color: 'white',
  fontSize: '22px',
  cursor: 'pointer'
};

export default Home;