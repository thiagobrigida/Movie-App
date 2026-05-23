**O EMAIL DO LOGIN DEVE SER "admin@admin.com" E A SENHA "123456"***

# Movie APP — Gerenciador de Catálogo de Cinema

O **Movie APP** é uma aplicação web desenvolvida em **React**, **TypeScript** e **Vite** para o gerenciamento dinâmico e personalizado de catálogos de filmes. A plataforma integra a API pública **OMDb (Open Movie Database)** e oferece um ecossistema completo de CRUD local, controle de perfil customizável e análises estatísticas simples em tempo real.

O projeto foi construído sob uma arquitetura focada em critérios de **Usabilidade (UX/UI)**, **Componentização Eficiente** e **Tratamento de Exceções (Programação Defensiva)**, atendendo aos requisitos do desafio técnico para a Comp Junior.

---

## Instalação, Execução e Testes

### Pré-requisitos
Antes de começar, certifique-se de ter o **Node.js** instalado em sua máquina.

### Passo a Passo para Configuração Local

1. **Clonar o Repositório:**
   ```bash
   git clone [https://github.com/SEU-USUARIO/nome-do-seu-repositorio.git](https://github.com/SEU-USUARIO/nome-do-seu-repositorio.git)
   cd nome-do-seu-repositorio

2. **Intalar depenências:**
   ```bash
   npm install

2. **Executar:**
   ```bash
   npm run dev

A aplicação estará disponível no endereço indicado no seu terminal (geralmente http://localhost:5173).

**O EMAIL DO LOGIN DEVE SER "admin@admin.com" E A SENHA "123456"***

### Roteiro de Teste das Funcionalidades
Para validar o comportamento do software durante a avaliação, siga este roteiro:

Acesso à Plataforma: Use as credenciais padrão na tela de login:

E-mail: admin@ej.com

Senha: 123456

Teste de Busca Curta: Digite "Us" na barra de busca e clique em buscar. Note que o sistema contornará a limitação da API e trará o filme perfeitamente.

Teste de Validação de Ano: Clique em + Novo Filme, tente cadastrar um título digitando "202" ou "Ano Passado" no campo de ano. O sistema bloqueará o envio exibindo um alerta informando que são exigidos exatamente 4 números.

Teste de Reatividade do Perfil: Vá em Perfil, altere o nome e escolha o avatar de "Diretor de Cinema" ou "Membro Premium". Clique em salvar, volte ao catálogo e observe o cabeçalho no canto esquerdo atualizado em tempo real.

Teste de Isolamento de Cliques (Propagação): Na aba de "Minha Coleção", clique no botão Editar de um card. O formulário de edição se abrirá corretamente, sem disparar a abertura do modal de sinopse que está por trás do card.
---

## Principais Funcionalidades

### 1. Autenticação e Guarda de Rotas
* Tela de login moderna e centralização estável.
* Sessão persistida de forma segura via `localStorage`.

### 2. Busca Inteligente (Integração OMDb)
* **Tratamento de Casos Extremos (Edge Cases):** A API OMDb exige no mínimo 3 caracteres para buscas gerais (`?s=`). O sistema detecta termos curtos automaticamente (ex: *"Us"*, *"Pi"*, *"It"*) e altera a estratégia de consumo para busca por Título Exato (`?t=`).
* **Fallback de Cartazes Quebrados:** Caso a API retorne uma URL inválida ou sem imagem (`"N/A"`), o sistema renderiza um placeholder em CSS puro com um ícone de claquete, impedindo quebra de layout no grid.

### 3. Sistema de Abas e Filtros de Exibição
* Navegação intuitiva por abas para alternar a exibição do catálogo instantaneamente:
  * **Ver Tudo:** Exibição combinada do acervo local e resultados da API.
  * **Minha Coleção:** Foco exclusivo nos filmes gerenciados pelo usuário.
  * **Busca OMDb:** Área limpa dedicada à exploração da API externa com mensagens de guia textuais.

### 4. CRUD Expandido de Filmes (Coleção Pessoal)
* **Create:** Adição de novos títulos preenchendo Título, Ano, Gênero, Elenco, Sinopse e URL do Poster.
* **Read:** Janela de detalhes (Modal responsivo) com as informações do filme. Para filmes da API, busca os dados técnicos completos; para filmes autorais, lê os campos personalizados direto da memória local com resposta imediata.
* **Update:** Edição total e dinâmica de qualquer campo de dados de um filme criado.
* **Delete:** Exclusão segura com caixas de diálogo de confirmação do navegador.

### 5. Painel do Usuário (Dashboard & Perfil Conectado)
* **Insights Analíticos:** Algoritmo realiza a varredura automática dos dados salvos, isola entradas inconsistentes via expressões regulares (`Regex`) e calcula em tempo real o total de filmes salvos, o título mais antigo e o mais recente da coleção.
* **Perfil do Usuário:** Customização de Nome, Gênero Favorito e troca de avatares com ícones (via `lucide-react`). As mudanças alteram o cabeçalho reativo da página inicial.

---

## Tecnologias Utilizadas

* **React** — Criação de interfaces reativas baseadas em componentes.
* **TypeScript** — Tipagem estática para prevenção de bugs em tempo de desenvolvimento.
* **Vite** — Ferramenta de build para desenvolvimento rápido.
* **Axios** — Cliente HTTP otimizado para o consumo da OMDb API.
* **Lucide React** — Biblioteca de ícones vetoriais.
* **CSS** — Estilização com suporte a layouts flexíveis e responsivos.

---

***README AUTOMÁTICO DO REACT ->***
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
