# Deploy no GitHub Pages

Este projeto está configurado para fazer deploy automático no GitHub Pages.

## 🚀 Como fazer deploy

### Método 1: Deploy Automático (Recomendado)

1. **Faça push do código para o GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Configure o GitHub Pages:**
   - Vá para **Settings** → **Pages** no seu repositório
   - Em **Source**, selecione **GitHub Actions**
   - O workflow irá rodar automaticamente a cada push na branch `main`

3. **Acesse seu site:**
   - Após o deploy, seu site estará disponível em: `https://[seu-usuario].github.io/[nome-do-repo]/`

### Método 2: Deploy Manual

Se preferir fazer deploy manual usando gh-pages:

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Faça o build:**
   ```bash
   npm run build
   ```

3. **Faça o deploy:**
   ```bash
   npm run deploy
   ```

## 📋 Comandos disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria o build de produção
- `npm run preview` - Visualiza o build localmente
- `npm run deploy` - Faz deploy manual para gh-pages

## ⚙️ Configurações importantes

- **Base URL**: Configurado como `./` para funcionar em qualquer caminho
- **Output**: Build gerado na pasta `dist/`
- **Branch de deploy**: `gh-pages` (criada automaticamente)

## 🔧 Troubleshooting

Se o site não carregar corretamente:

1. Verifique se o GitHub Pages está ativado nas configurações do repositório
2. Confirme que a source está definida como "GitHub Actions"
3. Verifique os logs do workflow em **Actions**
4. Aguarde alguns minutos após o primeiro deploy

## 📁 Estrutura de arquivos

```
├── .github/
│   └── workflows/
│       └── deploy.yml      # Workflow de deploy automático
├── src/                    # Código fonte
├── dist/                   # Build de produção (gerado automaticamente)
├── index.html
├── package.json
├── vite.config.ts         # Configuração do Vite com base: './'
└── tsconfig.json
```
