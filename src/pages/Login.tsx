import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react'; // Ícones profissionais para os inputs

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples (Substitua pelas suas credenciais se necessário)
    if (email === 'admin@ej.com' && password === '123456') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
    } else {
      alert('Credenciais inválidas! Dica: admin@ej.com / 123456');
    }
  };

  return (
    <div style={backgroundContainerStyle}>
      {/* Camada escurecida para dar o clima de cinema de fundo */}
      <div style={overlayStyle}>
        
        <div style={loginCardStyle}>
          <h1 style={logoStyle}>Movie APP</h1>
          <h2 style={titleStyle}>Entrar</h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* CAMPO DE EMAIL */}
            <div style={inputGroupStyle}>
              <Mail size={18} color="#666" style={iconStyle} />
              <input 
                type="email" 
                placeholder="E-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            {/* CAMPO DE SENHA */}
            <div style={inputGroupStyle}>
              <Lock size={18} color="#666" style={iconStyle} />
              <input 
                type="password" 
                placeholder="Senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <button type="submit" style={loginButtonStyle}>
              Acessar Plataforma
            </button>
          </form>

          <div style={footerStyle}>
            <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>
              Thiago Lucas Soares Brigida - Trainee Front-end Comp Junior
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- ESTILOS VISUAIS PREMIUM (DARK MODE / NETFLIX STYLE) ---

const backgroundContainerStyle: React.CSSProperties = {
  width: '100vw',
  height: '100vh',
  background: '#000000', // Fundo preto puro para destacar o card
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden'
};

const overlayStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'radial-gradient(circle, rgba(20,20,20,0.4) 0%, rgba(0,0,0,0.85) 100%)' // Efeito de holofote sutil de cinema
};

const loginCardStyle: React.CSSProperties = {
  background: 'rgba(26, 26, 26, 0.85)', // Cinza escuro translúcido
  padding: '50px 40px',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '400px',
  border: '1px solid #333',
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(8px)', // Efeito de vidro jateado moderno
  boxSizing: 'border-box'
};

const logoStyle: React.CSSProperties = {
  color: '#E50914',
  fontSize: '32px',
  textAlign: 'center',
  margin: '0 0 30px 0',
  letterSpacing: '1px',
  fontWeight: 'bold'
};

const titleStyle: React.CSSProperties = {
  color: '#fff',
  fontSize: '24px',
  marginBottom: '25px',
  fontWeight: '600'
};

const inputGroupStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%'
};

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '15px',
  zIndex: 10
};

const inputStyle = {
  width: '100%',
  padding: '14px 14px 14px 45px', // Espaço extra na esquerda para o ícone não cobrir o texto
  borderRadius: '6px',
  border: '1px solid #444',
  background: '#0a0a0a',
  color: '#fff',
  fontSize: '15px',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  boxSizing: 'border-box' as const,
};

const loginButtonStyle = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#E50914',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold' as const,
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '10px',
  boxShadow: '0 4px 14px rgba(229, 9, 20, 0.3)',
  transition: 'transform 0.1s ease, background-color 0.2s ease'
};

const footerStyle: React.CSSProperties = {
  marginTop: '35px',
  borderTop: '1px solid #333',
  paddingTop: '20px',
  textAlign: 'center'
};

export default Login;