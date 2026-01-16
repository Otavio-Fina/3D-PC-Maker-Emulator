---
trigger: manual
---

## CONTEXTO TECNOLÓGICO

**Frontend:**
- **Linguagem:** TypeScript
- **Framework Principal:** React (presumo React 18+)
- **Biblioteca 3D:** ThreeJS
- **Estilização:** SCSS
- **Build Tool:** Vite (recomendado para ThreeJS + React)com plugin de PWA

**Backend:**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Linguagem:** TypeScript
- **Banco de Dados:** MySQL

**Infraestrutura & Hosting:**
- **Armazenamento de Assets:** AWS S3 Bucket (modelos 3D, texturas, imagens)
- **Hosting Frontend:** Vercel (sugerido) ou Netlify
- **Hosting Backend:** AWS
- **Variáveis de Ambiente:** Gerenciamento seguro

## TAREFA PRINCIPAL

Como Tech Lead, projete a estrutura completa do projeto considerando:

### 1. ESTRUTURA DE PASTAS RAIZ DO PROJETO (MONOREPO RECOMENDADO)
```
project-root/
├── client/                 # Aplicação React + ThreeJS
├── server/                 # API Node.js + Express
├── docs/                   # Documentação técnica
├── .github/               # GitHub Actions workflows
└── README.md
```

### 2. ARQUITETURA DETALHADA DO FRONTEND (CLIENT)
Desenvolva a estrutura dentro da pasta client/ incluindo:

**Estrutura de Pastas:**
```
client/
├── public/                # Assets estáticos
│   ├── models/           # Modelos 3D locais (desenvolvimento)
│   ├── textures/         # Texturas
│   └── favicon/
├── src/
│   ├── @types/           # Definições TypeScript personalizadas
│   ├── api/              # Clientes HTTP, configuração Axios
│   ├── assets/           # Assets do app (imagens, fonts, etc.)
│   │   └── scss/         # Estilos globais, variáveis, mixins
│   ├── components/       # Componentes React
│   │   ├── ui/          # Componentes genéricos (Button, Card, Modal)
│   │   ├── layout/      # Layout principal (Header, Footer, Sidebar)
│   │   └── three/       # Componentes ThreeJS especializados
│   │       ├── scene/   # Gerenciador de cena principal
│   │       ├── models/  # Componentes 3D específicos (CPU, GPU, etc.)
│   │       ├── controls/# Controles de câmera e interação
│   │       └── utils/   # Utilitários ThreeJS (loaders, helpers)
│   ├── contexts/         # Contextos React (Theme, 3DState, Auth)
│   ├── hooks/            # Custom Hooks (useThreeScene, useComponentFetch)
│   ├── lib/              # Bibliotecas de terceiros configuradas
│   │   └── three/       # Configurações ThreeJS, instância customizada
│   ├── pages/            # Páginas da aplicação (rotas)
│   │   ├── Builder/     # Página principal do configurador
│   │   ├── Catalog/     # Catálogo de componentes
│   │   ├── Compare/     # Comparação de builds
│   ├── services/         # Lógica de negócio
│   │   ├── compatibility/ # Serviço de verificação de compatibilidade
│   │   ├── builder/      # Gerenciamento do estado do build
│   │   └── modelLoader/  # Carregamento e cache de modelos 3D
│   ├── utils/            # Funções utilitárias (formatação, cálculos)
│   ├── App.tsx           # Componente raiz
│   ├── main.tsx          # Ponto de entrada
│   └── vite-env.d.ts     # Tipos do Vite
├── .env          		   # Variáveis ambiente frontend
├── index.html           # Template HTML
├── package.json
├── tsconfig.json        # Configuração TypeScript
├── vite.config.ts       # Configuração Vite
└── README.md
```

**Configurações Específicas ThreeJS:**
- Setup de gerenciamento de cena, iluminação, renderer
- Estratégia de carregamento de modelos (S3 vs. local)
- Sistema de performance (culling, LOD, cache)
-  ThreeJS puro

### 3. ARQUITETURA DETALHADA DO BACKEND (SERVER)
Desenvolva a estrutura dentro da pasta server/ incluindo:

**Estrutura de Pastas:**
```
server/
├── src/
│   ├── @types/           # Tipos TypeScript personalizados
│   ├── config/           # Configurações da aplicação
│   │   ├── database/    # Configuração do DB, migrations
│   │   ├── aws/         # Configuração AWS S3
│   │   └── constants.ts # Constantes da aplicação
│   ├── controllers/      # Controladores das rotas
│   │   ├── component.controller.ts
│   │   ├── build.controller.ts
│   │   ├── compatibility.controller.ts
│   │   └── user.controller.ts
│   ├── services/         # Lógica de negócio
│   │   ├── component.service.ts
│   │   ├── compatibility.service.ts
│   │   ├── s3.service.ts # Upload/download modelos 3D
│   │   └── build.service.ts
│   ├── routes/          # Definições de rotas Express
│   │   ├── api/         # Rotas /api/*
│   │   └── index.ts     # Agrupador de rotas
│   ├── middleware/      # Middlewares customizados
│   │   ├── auth.ts      # Autenticação/autorização
│   │   ├── validation.ts # Validação de inputs
│   │   └── errorHandler.ts
│   ├── models/          # Modelos do banco de dados (ORM)
│   ├── interfaces/      # Interfaces TypeScript
│   ├── utils/           # Utilitários (validators, helpers)
│   ├── scripts/         # Scripts utilitários (seed, migration)
│   └── app.ts           # Configuração da aplicação Express
├── .env                # Variáveis ambiente
├── package.json
├── tsconfig.json
├── nodemon.json        # Para desenvolvimento
└── README.md
```


### 4. CONFIGURAÇÕES TÉCNICAS ESPECÍFICAS
Para cada parte do projeto, inclua:

**Frontend (client/):**
- Configuração do Vite para otimização de assets 3D
- Setup do ThreeJS com React (ThreeJS)
- Code splitting para modelos 3D pesados

**Backend (server/):**
- Setup do Express com TypeScript
- Estrutura de conexão com AWS S3
- Sistema de autenticação (JWT recomendado)
- Rate limiting e segurança básica

**Comunicação Frontend-Backend:**
- Definição de API REST (endpoints principais)
- Estratégia de erro e loading states

### 5. INFRAESTRUTURA E DEPLOY
- Configuração AWS S3 para modelos 3D (ACL, CORS)
- Variáveis de ambiente por ambiente (dev, staging, prod)
- Configuração do Vercel para frontend (vercel.json)
- Configuração do hosting backend (AWS)
- Pipeline CI/CD básico

### 6. CONSIDERAÇÕES DE PERFORMANCE E OTIMIZAÇÃO
- Otimização de modelos 3D (glTF/GLB, compressão)
- Lazy loading de componentes pesados
- Cache estratégico (service workers, CDN)
- Monitoramento de performance (Web Vitals)

## ENTREGÁVEIS ESPERADOS

1. **Estrutura de pastas completa** como mostrado acima
2. **Configurações técnicas específicas** para cada tecnologia
3. **Explicação das decisões arquiteturais** (por que esta estrutura?)
4. **Boas práticas recomendadas** para o stack
5. **Scripts e comandos** essenciais para desenvolvimento
6. **Recomendações de pacotes NPM** específicos para ThreeJS + React

**Formato de resposta:** Estruturado, técnico e pronto para implementação, com explicações claras sobre cada decisão arquitetural.
