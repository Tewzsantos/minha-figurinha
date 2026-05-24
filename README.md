# 🎴 Minha Figurinha da Copa 2026

Site completo para geração de figurinhas personalizadas no estilo Panini Copa do Mundo 2026.

**Stack:** Next.js 14 · Tailwind CSS · Stripe · OpenAI GPT-4o / DALL-E 3 · Vercel Blob

---

## 🚀 Setup rápido

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

| Variável | Onde obter |
|---|---|
| `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com) |
| `STRIPE_SECRET_KEY` | [dashboard.stripe.com](https://dashboard.stripe.com) |
| `STRIPE_WEBHOOK_SECRET` | CLI Stripe ou Dashboard → Webhooks |
| `BLOB_READ_WRITE_TOKEN` | Vercel Dashboard → Storage → Blob |
| `NEXT_PUBLIC_BASE_URL` | URL do seu deploy (ex: https://minha-figurinha.vercel.app) |

### 3. Rodar localmente

```bash
npm run dev
```

Acesse `http://localhost:3000`

---

## 📁 Estrutura do projeto

```
minha-figurinha/
├── app/
│   ├── page.tsx               # Landing page (/)
│   ├── criar/page.tsx         # Formulário multi-etapas (/criar)
│   ├── preview/page.tsx       # Preview com marca d'água (/preview)
│   ├── sucesso/page.tsx       # Página de sucesso e download (/sucesso)
│   ├── api/
│   │   ├── generate/route.ts  # Gera figurinha via OpenAI
│   │   ├── checkout/route.ts  # Cria sessão Stripe + verifica pagamento
│   │   ├── webhook/route.ts   # Recebe eventos Stripe
│   │   └── download/route.ts  # Serve figurinha sem marca d'água
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── FigurinhaCard.tsx      # Card visual da figurinha
│   └── AnimatedCounter.tsx    # Contador animado na landing
├── public/
│   └── figurinha-ref.png      # ⚠️ OBRIGATÓRIO: imagem de referência Panini
└── vercel.json
```

---

## 🖼️ Imagem de referência

Coloque uma figurinha Panini Copa 2026 de alta qualidade em `public/figurinha-ref.png`.

Esta imagem é enviada ao GPT-4o como referência visual para gerar a figurinha do usuário.

**Requisitos:**
- Formato PNG, resolução mínima 400×560px
- Figurinha oficial Panini Copa do Mundo 2026 (ou similar)
- Fundo limpo, boa qualidade

---

## 💳 Configurar Stripe

### Modo de teste

Use as chaves `sk_test_...` e `pk_test_...` do dashboard.

**Cartão de teste:** `4242 4242 4242 4242` · Qualquer data futura · Qualquer CVV

### Webhook local (desenvolvimento)

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Redirecionar eventos para seu servidor local
stripe listen --forward-to localhost:3000/api/webhook
```

### Webhook em produção

No Stripe Dashboard → Developers → Webhooks → Add endpoint:
- URL: `https://seu-site.vercel.app/api/webhook`
- Events: `checkout.session.completed`

---

## 🤖 Lógica de geração de imagem

O fluxo completo de geração:

1. Usuário envia foto + dados no formulário (`/criar`)
2. `POST /api/generate` recebe o `FormData`
3. Foto + imagem de referência + dados → GPT-4o (análise visual)
4. DALL-E 3 gera a figurinha personalizada com o prompt correto
5. Sharp adiciona marca d'água diagonal
6. Ambas as versões (com/sem marca d'água) são salvas no Vercel Blob
7. Preview com marca d'água é mostrado em `/preview`
8. Após pagamento confirmado via webhook Stripe, versão limpa fica disponível
9. `/sucesso` exibe figurinha final + botão de download

---

## ☁️ Deploy na Vercel

```bash
npm install -g vercel
vercel --prod
```

Configure as variáveis de ambiente no Vercel Dashboard ou via CLI:

```bash
vercel env add OPENAI_API_KEY
vercel env add STRIPE_SECRET_KEY
# ... etc
```

### Habilitar Vercel Blob

No Vercel Dashboard → Storage → Create Database → Blob → conecte ao projeto.

---

## 🎨 Customização

### Cores (tailwind.config.ts)
```ts
verde: '#009C3B'      // Verde Brasil
amarelo: '#FFDF00'    // Amarelo Brasil  
azul: '#002776'       // Azul Brasil
ciano: '#00C4C8'      // Fundo da figurinha
```

### Preço
Em `app/api/checkout/route.ts`, linha `unit_amount: 990` (centavos BRL = R$9,90)

---

## 📄 Licença

MIT — use à vontade para fins comerciais.
