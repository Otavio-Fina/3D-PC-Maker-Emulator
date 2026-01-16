# 3D PC Maker Emulator

Uma aplicação web 3D interativa para construir e personalizar PCs com componentes reais utilizando React, ThreeJS e Node.js.

## 🚀 Visão Geral

O 3D PC Maker Emulator permite que usuários:
- Montem PCs em ambiente 3D interativo
- Escolham entre componentes reais (CPU, GPU, RAM, etc.)
- Verifiquem compatibilidade de hardware
- Comparem diferentes configurações
- Visualizem o montante final em tempo real

## 🏗️ Arquitetura

### Tecnologias Utilizadas

**Frontend:**
- **React 18+** - Framework principal
- **TypeScript** - Type safety
- **ThreeJS + React Three Fiber** - Renderização 3D
- **Vite** - Build tool e dev server
- **SCSS** - Estilização
- **Zustand** - State management
- **React Router** - Navegação

**Backend:**
- **Node.js + Express** - API REST
- **TypeScript** - Type safety
- **MySQL + Sequelize** - Banco de dados
- **JWT** - Autenticação
- **AWS S3** - Armazenamento de modelos 3D
- **Multer** - Upload de arquivos

**Infraestrutura:**
- **Docker** - Containerização
- **GitHub Actions** - CI/CD
- **Vercel** - Hosting frontend
- **AWS** - Hosting backend e storage

## 📁 Estrutura do Projeto

```
3D-PC-Maker-Emulator/
├── client/                 # Aplicação React + ThreeJS
│   ├── public/            # Assets estáticos
│   ├── src/
│   │   ├── @types/        # Tipos TypeScript
│   │   ├── api/           # Clientes HTTP
│   │   ├── assets/        # Assets do app
│   │   ├── components/    # Componentes React
│   │   │   ├── ui/       # Componentes genéricos
│   │   │   ├── layout/   # Layout principal
│   │   │   └── three/    # Componentes ThreeJS
│   │   ├── contexts/      # Contextos React
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Bibliotecas configuradas
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Lógica de negócio
│   │   └── utils/         # Utilitários
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── server/                 # API Node.js + Express
│   ├── src/
│   │   ├── @types/        # Tipos TypeScript
│   │   ├── config/        # Configurações
│   │   ├── controllers/   # Controladores
│   │   ├── services/      # Lógica de negócio
│   │   ├── routes/        # Definições de rotas
│   │   ├── middleware/    # Middlewares
│   │   ├── models/        # Modelos do banco
│   │   └── utils/         # Utilitários
│   ├── package.json
│   └── tsconfig.json
├── docs/                   # Documentação
├── .github/               # GitHub Actions
├── docker-compose.yml     # Docker Compose
└── package.json           # Root package.json
```

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js 18+
- npm 9+
- MySQL 8.0+
- Docker (opcional)

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/your-username/3D-PC-Maker-Emulator.git
cd 3D-PC-Maker-Emulator
```

2. **Instale as dependências:**
```bash
npm run setup
```

3. **Configure as variáveis de ambiente:**
```bash
# Frontend (client/.env)
VITE_API_URL=http://localhost:5000/api
VITE_AWS_S3_BUCKET=seu-bucket-s3

# Backend (server/.env)
DB_HOST=localhost
DB_PASSWORD=sua-senha
JWT_SECRET=seu-jwt-secret
AWS_ACCESS_KEY_ID=sua-aws-key
AWS_SECRET_ACCESS_KEY=sua-aws-secret
```

4. **Configure o banco de dados:**
```bash
npm run migrate
npm run seed
```

## 🚀 Executando a Aplicação

### Desenvolvimento Local

**Usando Docker (Recomendado):**
```bash
npm run docker:up
```

**Sem Docker:**
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

Acesse:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

### Produção

**Build:**
```bash
npm run build
```

**Deploy:**
```bash
# Frontend para Vercel
cd client && vercel --prod

# Backend para AWS
cd server && npm run build && npm start
```

## 📚 API Documentation

### Endpoints Principais

**Componentes:**
- `GET /api/components` - Listar todos os componentes
- `GET /api/components/:category` - Listar por categoria
- `GET /api/components/:id` - Detalhes do componente

**Builds:**
- `POST /api/builds` - Criar novo build
- `GET /api/builds/:id` - Obter build
- `PUT /api/builds/:id` - Atualizar build

**Compatibilidade:**
- `POST /api/compatibility/check` - Verificar compatibilidade

**Upload:**
- `POST /api/upload/model` - Upload de modelo 3D

## 🎮 Guia de Desenvolvimento

### Adicionando Novos Componentes 3D

1. **Prepare o modelo 3D:**
   - Formato: GLB/GLTF
   - Tamanho máximo: 50MB
   - Texturas otimizadas

2. **Upload via API:**
```bash
curl -X POST http://localhost:5000/api/upload/model \
  -H "Content-Type: multipart/form-data" \
  -F "file=@modelo.glb" \
  -F "category=cpu" \
  -F "name=Intel i9-13900K"
```

3. **Configure no frontend:**
```typescript
// src/components/three/models/CPUModel.tsx
import { useGLTF } from '@react-three/drei'

export function CPUModel({ url, ...props }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} {...props} />
}
```

### Estilos e Temas

O projeto utiliza SCSS com arquitetura 7-1:

```scss
// Variáveis personalizadas
$primary-color: #0ea5e9;
$bg-primary: #0f172a;

// Mixins responsivos
@include respond-to(md) {
  // Estilos para tablets
}
```

## 🧪 Testes

### Executar Testes
```bash
# Todos os testes
npm test

# Frontend
npm run test --workspace=client

# Backend
npm run test --workspace=server

# Coverage
npm run test:coverage
```

## 📦 Deploy

### Frontend (Vercel)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático via GitHub Actions

### Backend (AWS)
1. Configure EC2 instance
2. Configure RDS MySQL
3. Configure S3 bucket
4. Deploy via GitHub Actions

## 🔧 Configuração Avançada

### Performance 3D

**Otimização de Modelos:**
- Use Draco compression
- Limite polígonos (<100k)
- Texturas em potência de 2

**Render Settings:**
```typescript
// Configurações de performance
const renderer = new WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
```

### Cache Strategy

**Frontend:**
- Service Workers para modelos 3D
- LocalStorage para preferências
- Memory cache para componentes

**Backend:**
- Redis para cache de APIs
- CDN para assets estáticos
- MySQL query cache

## 🤝 Contribuindo

1. Fork o projeto
2. Crie feature branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abra Pull Request

### Code Style

- Use TypeScript strict mode
- Siga ESLint configuration
- Use Prettier para formatação
- Escreva testes para novas funcionalidades

## 📄 Licença

Este projeto está licenciado sob MIT License - veja [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- 📧 Email: support@pc-builder-3d.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/3D-PC-Maker-Emulator/issues)
- 📖 Wiki: [Documentação Completa](https://github.com/your-username/3D-PC-Maker-Emulator/wiki)

## 🙏 Agradecimentos

- [ThreeJS](https://threejs.org/) - Engine 3D
- [React Three Fiber](https://react-three-fiber.com/) - React renderer para ThreeJS
- [Vite](https://vitejs.dev/) - Build tool incrivelmente rápido
- [Express](https://expressjs.com/) - Framework web Node.js