import React, { useState, useEffect } from 'react';

interface AddMovieModalProps {
  onAdd: (movie: any) => void;
  onClose: () => void;
  movieToEdit?: any;
}

const AddMovieModal: React.FC<AddMovieModalProps> = ({ onAdd, onClose, movieToEdit }) => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [poster, setPoster] = useState('');
  const [genre, setGenre] = useState('');
  const [actors, setActors] = useState('');
  const [plot, setPlot] = useState('');

  useEffect(() => {
    if (movieToEdit) {
      setTitle(movieToEdit.Title || '');
      setYear(movieToEdit.Year || '');
      setPoster(movieToEdit.Poster || '');
      setGenre(movieToEdit.Genre || '');
      setActors(movieToEdit.Actors || '');
      setPlot(movieToEdit.Plot || '');
    }
  }, [movieToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const yearRegex = /^\d{4}$/;

    if (!title || !year) {
      alert("Título e Ano são obrigatórios!");
      return;
    }

    if (!yearRegex.test(year)) {
      alert("O ano deve conter exatamente 4 números (Ex: 1998)");
      return;
    }

    onAdd({
      Title: title,
      Year: year,
      Poster: poster,
      Genre: genre || 'Gênero não informado',
      Actors: actors || 'Elenco não informado',
      Plot: plot || 'Sinopse não disponível para este filme.',
      imdbID: movieToEdit ? movieToEdit.imdbID : `custom-${Date.now()}`,
      isCustom: true
    });
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ marginBottom: '20px', color: '#E50914' }}>
          {movieToEdit ? 'Editar Filme' : 'Novo Filme'}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxHeight: '80vh', overflowY: 'auto', paddingRight: '5px' }}>
          <input 
            placeholder="Título do Filme *" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            style={inputStyle} 
          />
          <input 
            placeholder="Ano (Ex: 2024) *" 
            value={year} 
            onChange={e => setYear(e.target.value)} 
            style={inputStyle} 
          />
          <input 
            placeholder="URL da Imagem (Poster)" 
            value={poster} 
            onChange={e => setPoster(e.target.value)} 
            style={inputStyle} 
          />
          <input 
            placeholder="Gênero (Ex: Ação, Aventura)" 
            value={genre} 
            onChange={e => setGenre(e.target.value)} 
            style={inputStyle} 
          />
          <input 
            placeholder="Elenco (Ex: Robert Downey Jr., Chris Evans)" 
            value={actors} 
            onChange={e => setActors(e.target.value)} 
            style={inputStyle} 
          />
          <textarea 
            placeholder="Sinopse do Filme" 
            value={plot} 
            onChange={e => setPlot(e.target.value)} 
            style={textareaStyle} 
            rows={4}
          />
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={saveButtonStyle}>Salvar</button>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const overlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000
};

const modalStyle: React.CSSProperties = {
  background: '#1a1a1a', padding: '30px', borderRadius: '12px',
  width: '90%', maxWidth: '450px', border: '1px solid #333'
};

const inputStyle = {
  width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px',
  border: '1px solid #444', background: '#000', color: '#fff', fontSize: '14px',
  outline: 'none'
};

const textareaStyle = {
  width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px',
  border: '1px solid #444', background: '#000', color: '#fff', fontSize: '14px',
  outline: 'none', resize: 'vertical' as const, fontFamily: 'inherit'
};

const saveButtonStyle = {
  flex: 1, padding: '12px', background: '#E50914', color: '#fff',
  border: 'none', borderRadius: '6px', fontWeight: 'bold' as const, cursor: 'pointer'
};

const cancelButtonStyle = {
  flex: 1, padding: '12px', background: 'transparent', color: '#ccc',
  border: '1px solid #444', borderRadius: '6px', cursor: 'pointer'
};

export default AddMovieModal;