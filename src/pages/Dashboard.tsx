import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Popcorn, Video, Crown, ArrowLeft, LogOut } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(() => localStorage.getItem('@User_Name') || 'Membro Comp Jr');
  const [favoriteGenre, setFavoriteGenre] = useState(() => localStorage.getItem('@User_Genre') || 'Sci-Fi');
  const [avatar, setAvatar] = useState(() => localStorage.getItem('@User_Avatar') || 'user');
  const [isEditing, setIsEditing] = useState(false);
  const [totalMovies, setTotalMovies] = useState(0);
  const [oldestMovie, setOldestMovie] = useState('N/A');
  const [newestMovie, setNewestMovie] = useState('N/A');

  useEffect(() => {
    const savedMovies = localStorage.getItem('@MyMovies');
    if (savedMovies) {
      try {
        const movies = JSON.parse(savedMovies);
        if (Array.isArray(movies)) {
          setTotalMovies(movies.length);
          const validMovies = movies.filter(m => m && m.Year && /^\d+$/.test(m.Year.trim()));
          if (validMovies.length > 0) {
            const sortedByYear = [...validMovies].sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
            setOldestMovie(`${sortedByYear[0].Title} (${sortedByYear[0].Year})`);
            setNewestMovie(`${sortedByYear[sortedByYear.length - 1].Title} (${sortedByYear[sortedByYear.length - 1].Year})`);
          }
        }
      } catch (error) {
        console.error("Erro ao processar estatísticas:", error);
      }
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('@User_Name', userName);
    localStorage.setItem('@User_Genre', favoriteGenre);
    localStorage.setItem('@User_Avatar', avatar);
    setIsEditing(false);
    alert('Perfil atualizado com sucesso!');
  };

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
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', padding: '15px 0', borderBottom: '1px solid #222' }}>
        <h1 style={{ color: '#E50914', padding: '10px 3px', margin: 8, fontSize: '26px', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {renderAvatarIcon(avatar, 28, '#E50914')}
          Painel do Usuário
        </h1>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => navigate('/home')} style={{ padding: '10px 18px', background: '#1a1a1a', color: '#fff', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Voltar ao Catálogo
          </button>
          <button onClick={() => { localStorage.removeItem('isAuthenticated'); navigate('/login'); }} style={{ padding: '10px 14px', background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LogOut size={16} /> Sair
          </button>
        </nav>
      </header>

      <div style={gridDashboardStyle}>
        <section style={panelStyle}>
          <h2 style={sectionTitleStyle}>Meu Perfil</h2>
          {!isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
              <div style={{ background: '#0a0a0a', padding: '25px', borderRadius: '50%', marginBottom: '15px', border: '2px solid #E50914', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {renderAvatarIcon(avatar, 64, '#E50914')}
              </div>
              <h3 style={{ color: '#fff', marginBottom: '5px' }}>{userName}</h3>
              <p style={{ color: '#aaa', fontSize: '14px' }}>
                <strong>Gênero Favorito:</strong> <span style={{ color: '#E50914' }}>{favoriteGenre}</span>
              </p>
              <button onClick={() => setIsEditing(true)} style={editProfileButtonStyle}>Editar Perfil</button>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Escolha seu Avatar Profissional:</label>
                <select value={avatar} onChange={e => setAvatar(e.target.value)} style={inputStyle}>
                  <option value="user">Usuário Padrão</option>
                  <option value="popcorn">Crítico Pipoca</option>
                  <option value="video">Diretor de Cinema</option>
                  <option value="crown">Membro Premium</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Nome:</label>
                <input type="text" value={userName} onChange={e => setUserName(e.target.value)} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Gênero Favorito:</label>
                <input type="text" value={favoriteGenre} onChange={e => setFavoriteGenre(e.target.value)} style={inputStyle} required />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={saveButtonStyle}>Salvar</button>
                <button type="button" onClick={() => setIsEditing(false)} style={cancelButtonStyle}>Cancelar</button>
              </div>
            </form>
          )}
        </section>

        <section style={panelStyle}>
          <h2 style={sectionTitleStyle}>Insights da Coleção</h2>
          <div style={statsContainerStyle}>
            <div style={statBoxStyle}>
              <p style={statLabelStyle}>Total de Filmes Salvos</p>
              <p style={statValueStyle}>{totalMovies}</p>
            </div>
            <div style={statBoxStyle}>
              <p style={statLabelStyle}>Filme Mais Antigo</p>
              <p style={{ ...statSubValueStyle, color: '#f1c40f' }}>{oldestMovie}</p>
            </div>
            <div style={statBoxStyle}>
              <p style={statLabelStyle}>Filme Mais Recente</p>
              <p style={{ ...statSubValueStyle, color: '#2ecc71' }}>{newestMovie}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};


const containerStyle: React.CSSProperties = { 
    padding: '20px', 
    maxWidth: '1200px', 
    margin: '0 auto', 
    minHeight: '100vh' 
};
const gridDashboardStyle: React.CSSProperties = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
    gap: '30px' 
};
const panelStyle: React.CSSProperties = { 
    background: '#1a1a1a', 
    padding: '30px', 
    borderRadius: '12px', 
    border: '1px solid #333' 
};
const labelStyle: React.CSSProperties = { 
    display: 'block',
    color: '#aaa', 
    marginBottom: '5px', 
    fontSize: '14px' 
};
const inputStyle = { 
    width: '100%', 
    padding: '10px', 
    borderRadius: '6px', 
    border: '1px solid #444', 
    background: '#000', 
    color: '#fff', 
    fontSize: '14px', 
    outline: 'none' 
};
const sectionTitleStyle: React.CSSProperties = { 
    color: '#fff', 
    fontSize: '20px', 
    marginBottom: '20px', 
    paddingLeft: '5px', 
    borderLeft: '4px solid #E50914' 
};
const editProfileButtonStyle = { 
    marginTop: '20px', 
    padding: '10px 20px', 
    background: '#333', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '6px', 
    cursor: 'pointer', 
    fontWeight: 'bold' 
};
const saveButtonStyle = { 
    flex: 1, 
    padding: '12px', 
    background: '#E50914', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '6px', 
    fontWeight: 'bold', 
    cursor: 'pointer' 
};
const cancelButtonStyle = { 
    flex: 1, 
    padding: '12px', 
    background: 'transparent', 
    color: '#ccc', 
    border: '1px solid #444', 
    borderRadius: '6px', 
    cursor: 'pointer' 
};
const statsContainerStyle: React.CSSProperties = { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '15px' 
};
const statBoxStyle: React.CSSProperties = { 
    background: '#0a0a0a', 
    padding: '15px', 
    borderRadius: '8px', 
    border: '1px solid #222' 
};
const statLabelStyle: React.CSSProperties = { 
    color: '#888', 
    fontSize: '12px', 
    textTransform: 'uppercase', 
    marginBottom: '5px' 
};
const statValueStyle: React.CSSProperties = { 
    color: '#fff', 
    fontSize: '32px', 
    fontWeight: 'bold' 
};
const statSubValueStyle: React.CSSProperties = { 
    color: '#fff', 
    fontSize: '15px', 
    fontWeight: '600', 
    marginTop: '3px' 
};

export default Dashboard;