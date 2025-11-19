# 📊 XTRADERS Intelligence - Sistema Completo

## 🎯 Visão Geral

Sistema completo de análise de performance para auditoria de algoritmos de trading, com duas abas funcionais:

### 🔷 **ABA 1: AUDITORIA COMPLETA**
Sistema de análise histórica profunda com múltiplos arquivos CSV:
- ✅ **Curva de Patrimônio** - Evolução do capital ao longo do tempo
- ✅ **Heatmap Mensal** - Matriz de desempenho mês a mês
- ✅ **Distribuição por Dia da Semana** - Análise de padrões semanais
- ✅ **Distribuição por Robô** - Performance individual de cada algoritmo
- ✅ **Métricas Avançadas** - Profit Factor, SQN, Drawdown, Sharpe Ratio
- ✅ **Histórico Completo** - Tabela detalhada de todas as operações
- ✅ **Filtros Dinâmicos** - Por ano, mês e robô

### 🔷 **ABA 2: RELATÓRIO DIÁRIO** ⭐ NOVO!
Sistema de visualização de relatórios diários com planilha histórica:
- ✅ **Upload de CSV diário** - Formato específico de relatório do dia
- ✅ **Cards por robô** - Visualização detalhada de cada operação
- ✅ **Suporte a parciais** - ATRION WIN e ORION WIN com saídas parciais
- ✅ **Planilha histórica** - Tabela com resultados de todos os dias
- ✅ **Resultado acumulado** - Cálculo progressivo dia a dia
- ✅ **Exclusão de registros** - Botão para remover dias específicos
- ✅ **Exportação em CSV** - Individual ou histórico completo
- ✅ **Persistência automática** - Dados salvos no localStorage

---

## 📁 Formato do CSV - Relatório Diário

### Estrutura Obrigatória
```csv
DATA;ROBÔ;OPERAÇÃO;HORA ENTRADA;HORA SAÍDA;PREÇO ENTRADA;PREÇO SAÍDA;CONTRATOS;RESULTADO
```

### Exemplo Completo
```csv
DATA;ROBÔ;OPERAÇÃO;HORA ENTRADA;HORA SAÍDA;PREÇO ENTRADA;PREÇO SAÍDA;CONTRATOS;RESULTADO
18.11.2024;ATRION WIN;COMPRA;09:15;09:45;125500;125550;1;250,00
18.11.2024;ATRION WIN;COMPRA;09:15;09:50;125500;125575;1;375,00
18.11.2024;CRONOS WDO;VENDA;10:30;11:00;5450;5445;5;1250,00
18.11.2024;ZARION;COMPRA;14:20;14:50;125450;125400;2;-500,00
18.11.2024;ORION WIN;VENDA;15:00;15:20;125600;125550;3;750,00
18.11.2024;OPERAÇÕES NA MÃO;COMPRA;16:00;16:30;125500;125600;1;500,00
```

### Colunas Detalhadas

| Coluna | Formato | Descrição | Exemplo |
|--------|---------|-----------|---------|
| **DATA** | DD.MM.YYYY | Data do relatório | 18.11.2024 |
| **ROBÔ** ou **ROBO** | Texto | Nome do algoritmo | ATRION WIN |
| **OPERAÇÃO** | COMPRA/VENDA | Tipo de operação | COMPRA |
| **HORA ENTRADA** | HH:MM | Horário de abertura | 09:15 |
| **HORA SAÍDA** | HH:MM | Horário de fechamento | 09:45 |
| **PREÇO ENTRADA** | Número | Preço de entrada | 125500 |
| **PREÇO SAÍDA** | Número | Preço de saída | 125550 |
| **CONTRATOS** | Número | Quantidade de contratos | 1 |
| **RESULTADO** | Número com vírgula | Resultado financeiro | 250,00 |

### ⚠️ Observações Importantes
- **Separador**: Ponto e vírgula (`;`)
- **Encoding**: Windows-1252 (padrão brasileiro)
- **Decimais**: Use vírgula (`,`) não ponto (`.`)
- **Data**: Formato DD.MM.YYYY (não DD/MM/YYYY no CSV)
- **Case-insensitive**: Aceita ROBÔ ou ROBO no header

---

## 🤖 Robôs Suportados

### Tabela de Configuração

| Robô | Logo | Margem | Parciais | Cor |
|------|------|--------|----------|-----|
| **ATRION WIN** | ✅ | 50k: 5 contratos WDO | ✅ SIM | 🔵 Azul #58a6ff |
| **ATRION WDO** | ✅ | 50k: 10 contratos WIN | ❌ NÃO | 🟢 Verde #2ea043 |
| **CRONOS WDO** | ✅ | 50k: 5 contratos WDO | ❌ NÃO | 🟠 Laranja #f59e0b |
| **ORION WIN** | ✅ | 50k: 10 contratos WIN | ✅ SIM | 🟣 Roxo #a855f7 |
| **ZARION** | ✅ | 50k: 10 contratos WIN | ❌ NÃO | 🔴 Vermelho #da3633 |
| **GIRION** | ❌ | N/A | ❌ NÃO | A definir |
| **OPERAÇÕES NA MÃO** | ❌ | Manual | ❌ NÃO | N/A |

### 🎯 Lógica de Parciais

**Robôs com Parciais**: ATRION WIN e ORION WIN

**Como Funciona:**
1. Sistema detecta múltiplas saídas da mesma entrada (mesmo HORA ENTRADA)
2. **Primeira saída** = Parcial (mostra preço e contratos)
3. **Última saída** = Fechamento final
4. **Resultado total** = Soma de todas as parciais

**Exemplo Visual:**
```
Entrada: 09:15 @ 125500 (2 contratos)
├─ Saída Parcial: 09:45 @ 125550 (1 contrato) = +250
└─ Saída Final: 09:50 @ 125575 (1 contrato) = +375
   RESULTADO TOTAL: +625
```

**No card será exibido:**
- Entrada: 125500
- Parcial: 125550(1)
- Saída: 125575(1)
- Resultado: R$ 625,00

---

## 💾 Persistência de Dados

### LocalStorage - Estrutura

#### 1. Relatórios Completos
```typescript
// Chave: 'xtraders_daily_reports'
{
  date: "18.11.2024",
  robots: {
    "ATRION WIN": { trades: [...] },
    "CRONOS WDO": { trades: [...] },
    ...
  },
  totalAutomation: 5250.00
}
```

#### 2. Planilha Histórica
```typescript
// Chave: 'xtraders_historical_results'
{
  "18.11.2024": {
    totalDia: 5250.00,
    robots: {
      "ATRION WIN": 1200.00,
      "ATRION WDO": 0,
      "CRONOS WDO": 2500.00,
      "ORION WIN": 0,
      "ZARION": 1550.00,
      "GIRION": 0
    }
  },
  "19.11.2024": { ... }
}
```

### Funcionalidades de Persistência

✅ **Auto-save** - Salva automaticamente ao carregar novo relatório  
✅ **Histórico ilimitado** - Sem limite de dias salvos  
✅ **Exclusão segura** - Confirmação antes de deletar  
✅ **Ordenação cronológica** - Datas sempre em ordem  
✅ **Atualização dinâmica** - Se carregar mesmo dia, sobrescreve  

---

## 📤 Exportação de Dados

### 1. **Exportar Relatório Atual**
- **Botão**: "Exportar Relatório" (ícone download)
- **Conteúdo**: Apenas o relatório sendo visualizado
- **Arquivo**: `XTRADERS_Relatorio_DDMMYYYY.csv`
- **Formato**: CSV com todas as operações do dia

### 2. **Exportar Histórico Completo**
- **Botão**: "Exportar Histórico (X)" (ícone tabela)
- **Conteúdo**: TODOS os relatórios salvos
- **Arquivo**: `XTRADERS_Historico_YYYYMMDD.csv`
- **Uso**: Análise completa em Excel/Google Sheets

### Estrutura do CSV Exportado
```csv
DATA;ROBÔ;OPERAÇÃO;HORA ENTRADA;HORA SAÍDA;PREÇO ENTRADA;PARCIAL;PREÇO SAÍDA;CONTRATOS;RESULTADO
18.11.2024;ATRION WIN;COMPRA;09:15;09:50;125500;125550(1);125575(1);2;625,00
18.11.2024;CRONOS WDO;VENDA;10:30;11:00;5450;;5445;5;1250,00
```

**Nota**: Coluna PARCIAL vazia para robôs sem parciais

---

## 🎨 Design System

### Cores Principais
```css
--background: #0d1117      /* Fundo principal */
--surface: #161b22         /* Cards e containers */
--green: #2ea043           /* Lucro / Sucesso */
--red: #da3633             /* Prejuízo / Erro */
--blue: #58a6ff            /* Destaque / Links */
--text-primary: #c9d1d9    /* Texto principal */
--text-secondary: #8b949e  /* Texto secundário */
--border: #30363d          /* Bordas */
```

### Tipografia
```css
--font-titles: 'Orbitron'  /* Títulos e headers */
--font-body: 'Inter'       /* Corpo de texto */
--font-mono: 'Space Mono'  /* Valores numéricos */
```

### Efeitos Visuais
- **Glow Verde**: Gradiente radial difuso no fundo (apenas aba diária)
- **Hover States**: Elevação + shadow em cards
- **Animations**: fadeInUp com delay cascata
- **Transitions**: 0.3s ease para estados

---

## 🔄 Fluxo de Uso - Relatório Diário

### Primeira Vez
1. **Acessar aba** "RELATÓRIO DIÁRIO"
2. Ver planilha vazia com mensagem
3. **Clicar** "Carregar Relatório do Dia"
4. **Selecionar CSV** do relatório
5. Sistema processa e exibe:
   - Cards dos robôs na parte superior
   - Planilha histórica na parte inferior
6. Dados salvos automaticamente

### Próximas Vezes
1. **Acessar aba** - planilha já aparece populada
2. **Carregar novo CSV** - sidebar aparece
3. Visualizar cards + planilha atualizada
4. Opção de exportar dados
5. Botão "Voltar à planilha" remove cards

### Gestão de Dados
- **Exclusão**: Botão lixeira em cada linha
- **Confirmação**: Modal de "tem certeza?"
- **Atualização**: Planilha recalcula acumulado
- **Export**: Baixar tudo em CSV

---

## 📊 Planilha Histórica - Recursos

### Estrutura da Tabela

| Data | ATRION WIN | ATRION WDO | CRONOS | ORION | ZARION | GIRION | Resultado Dia | Acumulado | Ações |
|------|------------|------------|--------|-------|--------|--------|---------------|-----------|-------|
| 18/11 | R$ 1.200 | R$ 0 | R$ 2.500 | R$ 0 | R$ 1.550 | R$ 0 | **R$ 5.250** | **R$ 5.250** | 🗑️ |
| 19/11 | R$ 800 | R$ 500 | R$ 1.200 | R$ 300 | -R$ 200 | R$ 0 | **R$ 2.600** | **R$ 7.850** | 🗑️ |
| Total Geral Acumulado: ||||||| **R$ 7.850** | |

### Funcionalidades

✅ **Colunas Dinâmicas** - Uma para cada robô configurado  
✅ **Scroll Horizontal** - Suporta muitas colunas  
✅ **Primeira coluna fixa** (sticky) - Data sempre visível  
✅ **Ordenação automática** - Datas em ordem cronológica  
✅ **Cores inteligentes** - Verde (lucro), Vermelho (prejuízo)  
✅ **Rodapé destacado** - Total geral em negrito  
✅ **Hover effect** - Linha destaca ao passar mouse  

### Cálculos Automáticos

**Resultado do Dia** = Soma de todos os robôs de automação  
**Resultado Acumulado** = Soma progressiva linha a linha  
**Total Geral** = Acumulado final (última linha)  

**Nota**: OPERAÇÕES NA MÃO não entra nos cálculos

---

## 🛠️ Arquitetura Técnica

### Componentes React

```
/components/
├── DailyReport.tsx          # Componente principal do relatório diário
├── HistoricalSheet.tsx      # Tabela histórica de resultados
├── RobotCard (interno)      # Card individual de robô
├── Header.tsx               # Header da auditoria completa
├── InitialScreen.tsx        # Tela inicial da auditoria
└── ... (outros componentes)
```

### Utilitários

```
/utils/
├── dailyReportParser.ts          # Parser de CSV diário
├── historicalDataManager.ts      # Gerenciamento de localStorage
├── exportToSpreadsheet.ts        # Exportação de dados
├── fileParser.ts                 # Parser de CSV da auditoria
└── calculations.ts               # Cálculos de métricas
```

### Interfaces TypeScript

```typescript
interface DailyTrade {
  robotName: string;
  operacao: string;
  horaEntrada: string;
  horaSaida: string;
  precoEntrada: string;
  precoSaida: string;
  parcial?: string;
  contratos: number;
  resultado: number;
}

interface HistoricalDayData {
  totalDia: number;
  robots: { [robotName: string]: number };
}

interface HistoricalData {
  [dateKey: string]: HistoricalDayData;
}
```

---

## 🚀 Como Usar

### Instalação
```bash
npm install
npm run dev
```

### Workflow Completo

#### **AUDITORIA COMPLETA** (Analytics)
1. Upload múltiplos CSV (MT5, planilhas)
2. Sistema processa e exibe dashboard
3. Aplica filtros (ano, mês, robô)
4. Analisa gráficos e métricas
5. Exporta relatórios

#### **RELATÓRIO DIÁRIO** (Daily)
1. Acessa aba "RELATÓRIO DIÁRIO"
2. Upload CSV do dia
3. Visualiza cards dos robôs
4. Confere planilha histórica
5. Exporta dados se necessário
6. Repete diariamente

---

## 🎯 Próximas Melhorias Sugeridas

### Relatório Diário
- [ ] Filtros por robô na planilha
- [ ] Gráfico de evolução do acumulado
- [ ] Comparação entre períodos
- [ ] Estatísticas semanais/mensais
- [ ] Export em Excel nativo (.xlsx)
- [ ] Backup automático em nuvem

### Auditoria Completa
- [ ] Análise de drawdown intraday
- [ ] Correlação entre robôs
- [ ] Monte Carlo simulation
- [ ] Relatórios PDF automáticos
- [ ] Dashboard comparativo

---

## 📝 Notas Técnicas

### Performance
- **LocalStorage**: Limite ~5-10MB (suficiente para anos de dados)
- **React**: Renderização otimizada com keys únicas
- **CSS**: Animações aceleradas por GPU

### Compatibilidade
- **Navegadores**: Chrome, Edge, Firefox, Safari
- **Mobile**: Responsivo com breakpoints
- **CSV**: Suporta Windows-1252 e UTF-8

### Segurança
- **Dados locais**: Nunca enviados para servidor
- **Privacy**: 100% offline após carregar
- **Backup**: Responsabilidade do usuário

---

## 🏆 Recursos Destacados

✨ **Sistema Dual**: Analytics + Relatório Diário  
✨ **Persistência Inteligente**: Auto-save no localStorage  
✨ **Parciais Automáticas**: Detecta saídas graduais  
✨ **Planilha Acumulativa**: Cálculo progressivo  
✨ **Export Flexível**: Individual ou histórico  
✨ **Design Profissional**: Dark mode + glow effects  
✨ **Zero Configuração**: Detecta colunas automaticamente  
✨ **Responsivo**: Desktop, tablet e mobile  

---

**Desenvolvido para XTRADERS Intelligence** 🎯  
**Versão**: 2.0  
**Data**: Novembro 2024  
