import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de autenticação (Requisito da Semana 3: localStorage)
    if (email === 'admin@admin.com' && password === '123456') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/home');
    } else {
      alert('E-mail ou senha incorretos! (Dica: admin@admin.com / 123456)');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleLogin} style={{ background: '#1f1f1f', padding: '2rem', borderRadius: '8px', width: '300px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Movie App</h2>
        
        <input 
          type="email" 
          placeholder="E-mail" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '4px', border: 'none' }}
        />
        
        <input 
          type="password" 
          placeholder="Senha" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '4px', border: 'none' }}
        />

        <button type="submit" style={{ width: '100%', padding: '0.8rem', background: '#e50914', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;