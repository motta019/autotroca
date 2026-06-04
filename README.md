# AutoTroca Pro

Site moderno e simples para compra, venda e troca de carros.

## O que já vem pronto

- Cadastro e login de usuários
- Página inicial com busca e filtros
- Cards modernos de carros
- Criar anúncio
- Página de detalhes do carro
- Propostas de compra ou troca
- Painel do usuário
- Mensagens entre comprador e vendedor
- Dados simulados com localStorage
- Código separado para facilitar conexão com banco de dados

## Como rodar

```bash
npm install
npm run dev
```

Abra o link que aparecer no terminal, geralmente:

```bash
http://localhost:5173
```

## Onde conectar o banco de dados

A parte de dados está em:

```txt
src/services/storage.js
```

Hoje ela usa localStorage. Depois você pode trocar essas funções por chamadas para Firebase, Supabase, MongoDB, MySQL ou API própria.

## Como publicar

1. Rode:

```bash
npm run build
```

2. Suba a pasta `dist` em uma hospedagem como Vercel, Netlify ou Hostinger.
3. Compre um domínio e conecte o DNS na hospedagem.
