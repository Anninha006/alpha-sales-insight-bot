# Alpha Insights - Bot Analítico de Vendas

Sistema de análise de vendas com Inteligência Artificial, desenvolvido para a empresa Alpha Insights. O bot utiliza a Gemini API para processar e analisar dados de vendas mensais, fornecendo insights em linguagem natural.

## 🚀 Funcionalidades

- **Upload de Planilhas**: Carregue 12 planilhas mensais de vendas (Janeiro a Dezembro)
- **Análise com IA**: Faça perguntas em linguagem natural sobre seus dados de vendas
- **Insights Acionáveis**: Receba análises detalhadas e recomendações estratégicas
- **Interface Moderna**: Design profissional e responsivo com tema corporativo

## 📊 Estrutura de Dados

Cada planilha deve conter as seguintes colunas:

- **Data**: Data da transação (formato: YYYY-MM-DD)
- **ID_Transacao**: Identificador único da venda
- **Produto**: Nome do produto vendido
- **Categoria**: Categoria do produto
- **Região**: Região de venda
- **Quantidade**: Número de unidades vendidas
- **Preço_Unitário**: Preço de venda por unidade
- **Receita_Total**: Quantidade × Preço_Unitário

**Requisitos**: Mínimo de 200 linhas por planilha | Formatos aceitos: .xlsx, .xls, .csv

## 🔧 Tecnologias

- **Frontend**: React + TypeScript + Vite
- **Estilização**: Tailwind CSS + shadcn/ui
- **IA**: Google Gemini API
- **Processamento**: SheetJS (xlsx)
- **Hospedagem**: Vercel

## 🌐 Deploy no Vercel

### Método 1: Deploy Direto via GitHub

1. Faça push do código para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Clique em "Add New" > "Project"
4. Importe seu repositório
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Clique em "Deploy"

### Método 2: Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel
```

## 📝 Como Usar

### 1. Configuração Inicial

Após o deploy, acesse o site e:

1. Vá para a página de **Upload**
2. Configure sua **Gemini API Key** (obtenha em [ai.google.dev](https://ai.google.dev))
3. Faça upload das 12 planilhas mensais

### 2. Análise de Dados

1. Acesse a página do **Bot Analítico**
2. Faça perguntas como:
   - "Qual foi o produto mais vendido no terceiro trimestre?"
   - "Qual a variação percentual de receita entre janeiro e dezembro?"
   - "Qual região teve melhor desempenho em vendas?"
   - "Mostre as tendências de vendas por categoria"

### 3. Exemplos de Perguntas

- Análise de performance: "Qual mês teve maior receita total?"
- Comparações: "Compare as vendas do primeiro e segundo semestre"
- Tendências: "Quais produtos tiveram crescimento constante?"
- Por região: "Qual região vendeu mais notebooks?"

## 🔐 Segurança

⚠️ **IMPORTANTE**: A API Key da Gemini é armazenada localmente no navegador (localStorage). 

**Para produção**, considere:
- Implementar um backend para proteger a API Key
- Usar variáveis de ambiente do Vercel
- Adicionar autenticação de usuários

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📱 Páginas

- **`/`** - Página inicial com informações do sistema
- **`/upload`** - Upload e gerenciamento das planilhas mensais
- **`/bot`** - Interface do bot analítico

## 🎨 Design System

O projeto utiliza um design system profissional com:

- **Cores primárias**: Azul corporativo (#1E40AF)
- **Cores secundárias**: Verde para insights positivos (#22C55E)
- **Tema**: Suporte a modo claro e escuro
- **Componentes**: shadcn/ui customizados

## 📦 Estrutura do Projeto

```
src/
├── components/ui/     # Componentes UI (shadcn)
├── pages/            # Páginas da aplicação
│   ├── Index.tsx     # Página inicial
│   ├── Upload.tsx    # Upload de planilhas
│   ├── Bot.tsx       # Bot analítico
│   └── NotFound.tsx  # Página 404
├── hooks/            # Custom hooks
├── lib/              # Utilitários
├── App.tsx           # Configuração de rotas
└── index.css         # Design system
```

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte da atividade de "Desenvolvimento de um Bot Analítico de Vendas com Gemini API".

## 🎓 Projeto Acadêmico

Desenvolvido por: [Seu Nome]
Disciplina: [Nome da Disciplina]
Instituição: [Nome da Instituição]

---

**Alpha Insights** - Transformando dados em decisões estratégicas 🚀
