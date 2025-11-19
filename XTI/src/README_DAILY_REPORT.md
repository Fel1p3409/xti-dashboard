# 📊 XTRADERS Intelligence - Sistema de Relatórios

## 🎯 Visão Geral

O **XTRADERS Intelligence** agora possui **duas abas principais** para análise completa de trading:

### 1️⃣ **AUDITORIA COMPLETA** (Analytics)
Sistema original de auditoria com análise histórica profunda:
- ✅ Curva de Patrimônio
- ✅ Heatmap Mensal
- ✅ Distribuição por Dia da Semana
- ✅ Distribuição por Robô
- ✅ Métricas: Profit Factor, SQN, Drawdown
- ✅ Histórico completo de operações

### 2️⃣ **RELATÓRIO DIÁRIO** (Daily Report) ⭐ NOVO!
Sistema de visualização de relatórios diários com:
- ✅ Upload de CSV com formato específico de relatório diário
- ✅ Visualização por robô com detalhes de cada operação
- ✅ Suporte a **parciais** (ATRION WIN e ORION WIN)
- ✅ **Histórico persistente** (salvo no localStorage)
- ✅ **Exportação em planilha** (CSV)
- ✅ Exportação individual ou de todo histórico

---

## 📁 Formato do CSV de Relatório Diário

O arquivo CSV deve ter as seguintes colunas (separadas por **`;`**):

```csv
DATA;ROBÔ;OPERAÇÃO;HORA ENTRADA;HORA SAÍDA;PREÇO ENTRADA;PREÇO SAÍDA;CONTRATOS;RESULTADO
```

### Exemplo:
```csv
DATA;ROBÔ;OPERAÇÃO;HORA ENTRADA;HORA SAÍDA;PREÇO ENTRADA;PREÇO SAÍDA;CONTRATOS;RESULTADO
18.11.2024;ATRION WIN;COMPRA;09:15;09:45;125500;125550;1;250,00
18.11.2024;CRONOS WDO;VENDA;10:30;11:00;5450;5445;5;1250,00
18.11.2024;ZARION;COMPRA;14:20;14:50;125450;125400;2;-500,00
```

### Colunas Obrigatórias:
- **DATA**: Data do relatório (formato: DD.MM.YYYY)
- **ROBÔ** ou **ROBO**: Nome do robô
- **OPERAÇÃO**: COMPRA ou VENDA
- **HORA ENTRADA**: Horário de entrada (HH:MM)
- **HORA SAÍDA**: Horário de saída (HH:MM)
- **PREÇO ENTRADA**: Preço de entrada
- **PREÇO SAÍDA**: Preço de saída
- **CONTRATOS**: Quantidade de contratos
- **RESULTADO**: Resultado financeiro (use vírgula para decimais)

---

## 🤖 Robôs Suportados

O sistema reconhece automaticamente os seguintes robôs:

| Robô | Logo | Margem | Parciais |
|------|------|--------|----------|
| **ATRION WIN** | ✅ | Margem 50k: 5 contratos WDO | ✅ SIM |
| **ATRION WDO** | ✅ | Margem 50k: 10 contratos WIN | ❌ NÃO |
| **CRONOS WDO** | ✅ | Margem 50k: 5 contratos WDO | ❌ NÃO |
| **ORION WIN** | ✅ | Margem 50k: 10 contratos WIN | ✅ SIM |
| **ZARION** | ✅ | Margem 50k: 10 contratos WIN | ❌ NÃO |
| **GIRION** | ❌ | N/A | ❌ NÃO |
| **OPERAÇÕES NA MÃO** | ❌ | Manual | ❌ NÃO |

### 🎯 Robôs com Suporte a Parciais

**ATRION WIN** e **ORION WIN** possuem lógica especial para saídas parciais:
- O sistema detecta automaticamente múltiplas saídas da mesma entrada (baseado em HORA ENTRADA)
- A primeira saída é marcada como **Parcial**
- A última saída é o **fechamento final**
- O resultado total é a **soma de todas as parciais**

---

## 💾 Persistência de Dados

### LocalStorage
Todos os relatórios carregados são salvos automaticamente no navegador usando `localStorage`:
- **Chave**: `xtraders_daily_reports`
- **Formato**: JSON array com todos os relatórios
- **Persistência**: Dados permanecem mesmo após fechar o navegador

### Histórico
- Mostra os **5 relatórios mais recentes** na tela inicial
- Clique em qualquer relatório no histórico para visualizá-lo novamente
- **Sem necessidade de recarregar o arquivo CSV**

---

## 📤 Exportação de Dados

### 1. **Exportar Relatório Atual**
- Botão: **"Exportar Relatório"** (ícone de download)
- Exporta apenas o relatório sendo visualizado
- Nome do arquivo: `XTRADERS_Relatorio_DDMMYYYY.csv`

### 2. **Exportar Histórico Completo**
- Botão: **"Exportar Histórico (X)"** (ícone de tabela)
- Exporta **TODOS** os relatórios salvos em um único arquivo
- Nome do arquivo: `XTRADERS_Historico_YYYYMMDD.csv`
- **Perfeito para análise completa em Excel/Google Sheets**

### Formato do CSV Exportado
```csv
DATA;ROBÔ;OPERAÇÃO;HORA ENTRADA;HORA SAÍDA;PREÇO ENTRADA;PARCIAL;PREÇO SAÍDA;CONTRATOS;RESULTADO
```

---

## 🎨 Interface

### Layout Sidebar + Cards
- **Sidebar Fixa**: Logo, resumo do dia, botões de ação
- **Grid Responsivo**: Cards de robôs em 3 colunas (ajusta automaticamente)
- **Animações**: FadeInUp com delay cascata
- **Cores Dinâmicas**: 
  - Verde (#2ea043) para lucro
  - Vermelho (#da3633) para prejuízo
  - Cinza (#30363d) para neutro

### Estados Visuais
- **Borda do card** muda de cor conforme resultado
- **Ponto de status** (verde/vermelho/cinza)
- **Hover effect** com elevação e glow

---

## 🔄 Fluxo de Uso

1. **Acessar aba "RELATÓRIO DIÁRIO"**
2. **Carregar arquivo CSV** com relatório do dia
3. **Visualizar operações** organizadas por robô
4. **Exportar dados** (individual ou histórico completo)
5. **Carregar novos relatórios** - dados anteriores são preservados
6. **Acessar histórico** a qualquer momento sem recarregar arquivos

---

## 🛠️ Arquitetura Técnica

### Componentes
- `/components/DailyReport.tsx` - Componente principal
- `/utils/dailyReportParser.ts` - Parser de CSV
- `/utils/exportToSpreadsheet.ts` - Exportação de dados

### Parser
- Suporta encoding **windows-1252** (padrão brasileiro)
- Detecta automaticamente colunas ROBÔ/ROBO (case-insensitive)
- Agrupa trades com parciais automaticamente
- Validação robusta de dados

### Estado
```typescript
interface DailyReportData {
  date: string;
  robots: { [key: string]: DailyRobotData };
  totalAutomation: number;
}
```

---

## 🚀 Próximas Melhorias

- [ ] Filtros por robô/período
- [ ] Gráficos de evolução diária
- [ ] Comparação entre dias
- [ ] Estatísticas acumuladas
- [ ] Export em outros formatos (Excel, PDF)

---

**Desenvolvido para XTRADERS Intelligence** 🎯
