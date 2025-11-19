# 📅 COMO FUNCIONA O CALENDÁRIO DE RESULTADOS

## ✅ SALVAMENTO AUTOMÁTICO

Quando você carrega um relatório CSV do dia, o sistema **automaticamente**:

1. 📄 **Extrai a data** do arquivo CSV (coluna DATA)
2. 💰 **Calcula os resultados** de todos os robôs
3. 💾 **Salva no histórico** (localStorage do navegador)
4. 📅 **Adiciona ao calendário** mensal
5. ✅ **Mostra confirmação** com data e resultado

## 📆 EXEMPLO PRÁTICO

### Hoje é dia 18/11/2025

1. Você carrega o CSV do dia 18
2. Sistema lê: `DATA: 18.11.2025`
3. Sistema calcula:
   - CRONOS WDO: +R$ 500,00
   - ZARION WIN: -R$ 300,00
   - ATRION WDO: +R$ 800,00
   - **TOTAL: +R$ 1.000,00**
4. Sistema salva automaticamente
5. No calendário de Novembro/2025, o dia **18** aparece:
   ```
   ┌──────┐
   │  18  │
   │+1000 │ ← Resultado do dia
   └──────┘
   ```

## 🗓️ CALENDÁRIO MENSAL

### Visualização:
- ✅ **Verde** = Dia positivo (lucro)
- ❌ **Vermelho** = Dia negativo (perda)
- ⚪ **Cinza** = Dia sem operações

### Informações:
- **Mobile**: Mostra valor arredondado (+637)
- **Desktop**: Mostra valor completo (R$ 637,34)
- **Hover (Desktop)**: Tooltip com breakdown por robô

## 📊 FORMATO DO CSV

O sistema detecta automaticamente a data do CSV:

```csv
DATA;ROBÔ;OPERAÇÃO;ENTRADA;SAÍDA;RESULTADO
18.11.2025;CRONOS WDO;COMPRA;125500;125700;500.00
18.11.2025;ZARION WIN;VENDA;125600;125800;-300.00
```

### Formatos aceitos:
- `DD.MM.AAAA` → 18.11.2025
- `DD/MM/AAAA` → 18/11/2025

## 🔄 ATUALIZAÇÃO AUTOMÁTICA

### Quando você carrega um CSV:
1. ✅ Dados são processados
2. ✅ Histórico é atualizado
3. ✅ Calendário é re-renderizado
4. ✅ Planilha é atualizada
5. ✅ Alert confirma salvamento

### Mensagem de confirmação:
```
✅ Relatório do dia 18/11/2025 salvo com sucesso!

Resultado: R$ 1.000,00

Já aparece no calendário mensal! 📅
```

## 📱 TODOS OS MESES ABERTOS

Por padrão, **TODOS** os meses aparecem automaticamente expandidos:
- ✅ Janeiro/2025
- ✅ Fevereiro/2025
- ✅ Março/2025
- ...
- ✅ Dezembro/2025

Você pode clicar no header para colapsar/expandir cada mês.

## 💾 PERSISTÊNCIA

Os dados são salvos em:
- **localStorage** do navegador
- Chave: `xtraders_historical_results`
- Formato: JSON com todas as datas

### Estrutura:
```json
{
  "18.11.2025": {
    "totalDia": 1000.00,
    "robots": {
      "CRONOS WDO": 500.00,
      "ZARION WIN": -300.00,
      "ATRION WDO": 800.00,
      "ATRION WIN": 0.00,
      "GIRION": 0.00,
      "ORION WIN": 0.00
    }
  }
}
```

## 🎯 FLUXO COMPLETO

```
┌─────────────────────────────────────┐
│  1. Carregar CSV do dia            │
│     (botão "Carregar Relatório")   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  2. Sistema extrai DATA do CSV     │
│     Exemplo: 18.11.2025            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  3. Calcula resultados por robô    │
│     CRONOS: +500, ZARION: -300     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  4. Salva no localStorage          │
│     historicalData["18.11.2025"]   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  5. Atualiza calendário            │
│     Dia 18 = +R$ 1.000,00         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  6. Mostra alert de confirmação    │
│     ✅ Salvo com sucesso!          │
└─────────────────────────────────────┘
```

## 🔧 RECURSOS ADICIONAIS

### Importar Dados 2025:
- Botão azul "Importar Dados 2025"
- Carrega dados pré-existentes de todo o ano
- Popula calendário com histórico completo

### Deletar Registro:
- Na planilha histórica, clique no "X" vermelho
- Remove o dia do calendário
- Atualiza totais automaticamente

### Responsividade:
- 📱 **Mobile**: Layout compacto, valores arredondados
- 💻 **Desktop**: Layout completo, tooltips detalhados
- 📟 **Tablet**: Layout intermediário

## 🎨 CORES DOS ROBÔS

No tooltip (hover desktop):
- 🟠 **CRONOS WDO**: Laranja (#f59e0b)
- 🔴 **ZARION WIN**: Vermelho (#da3633)
- 🟢 **ATRION WDO**: Verde (#2ea043)
- 🔵 **ATRION WIN**: Azul (#58a6ff)
- 🟣 **ORION WIN**: Roxo (#a855f7)
- ⚪ **GIRION**: A definir

## ❓ DÚVIDAS COMUNS

### "O dia não apareceu no calendário?"
- Verifique se a coluna DATA existe no CSV
- Formato deve ser DD.MM.AAAA ou DD/MM/AAAA
- Aguarde o alert de confirmação

### "Posso atualizar um dia já carregado?"
- ✅ Sim! Carregar novamente sobrescreve
- O último CSV carregado é o que vale

### "Os dados ficam salvos?"
- ✅ Sim, no localStorage do navegador
- ❌ Limpar cache = perder dados
- 💾 Use "Exportar Histórico" para backup

## 🚀 PRÓXIMOS PASSOS

1. Carregue um CSV do dia de hoje
2. Veja o alert de confirmação
3. Volte à tela inicial (botão "← Voltar à planilha")
4. Veja o calendário atualizado com o dia de hoje!

---

**Sistema desenvolvido por XTRADERS Intelligence** 🎯
