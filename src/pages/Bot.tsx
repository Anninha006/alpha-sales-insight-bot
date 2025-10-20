import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Bot, User, FileSpreadsheet, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const DEFAULT_API_KEY = "AIzaSyD0fuAwdtnCMzqjiST6_Y76QXhs2T6ff5A";

const BotPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadedSheets, setLoadedSheets] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Carregar planilhas do localStorage
    const sheets: string[] = [];
    for (let i = 0; i < 12; i++) {
      const data = localStorage.getItem(`sales_${i}`);
      if (data) {
        sheets.push(MONTHS[i]);
      }
    }
    setLoadedSheets(sheets);

    // Carregar API key (usa a padrão se não houver salva)
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      localStorage.setItem("gemini_api_key", DEFAULT_API_KEY);
    }

    if (sheets.length === 0) {
      toast({
        title: "Nenhuma planilha carregada",
        description: "Faça upload das planilhas primeiro",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getAllSalesData = () => {
    const allData: any[] = [];
    for (let i = 0; i < 12; i++) {
      const data = localStorage.getItem(`sales_${i}`);
      if (data) {
        const parsed = JSON.parse(data);
        allData.push(...parsed.map((item: any) => ({ ...item, mes: MONTHS[i], mes_index: i + 1 })));
      }
    }
    return allData;
  };

  const getDataStructure = (data: any[]) => {
    if (data.length === 0) return "Sem dados disponíveis";
    const columns = Object.keys(data[0]);
    return `Colunas disponíveis: ${columns.join(", ")}`;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    if (!apiKey) {
      toast({
        title: "API Key não configurada",
        description: "Configure sua chave da Gemini API nas configurações",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const salesData = getAllSalesData();
      
      if (salesData.length === 0) {
        throw new Error("Nenhum dado disponível para análise");
      }

      const dataStructure = getDataStructure(salesData);
      
      // Enviar todos os dados (limitar a 500 linhas para não exceder limite da API)
      const dataToSend = salesData.slice(0, 500);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Você é um analista de dados especializado em vendas. Você TEM CAPACIDADE de processar e analisar dados JSON.

**DADOS DE VENDAS (formato JSON):**
${JSON.stringify(dataToSend, null, 2)}

**INFORMAÇÕES:**
- Total de transações disponíveis: ${salesData.length}
- Meses com dados: ${loadedSheets.join(", ")}
- ${dataStructure}

**INSTRUÇÕES IMPORTANTES:**
1. Você DEVE processar os dados JSON fornecidos acima
2. Você PODE e DEVE fazer cálculos matemáticos (somas, médias, porcentagens, etc.)
3. Analise os dados reais, NÃO use placeholders como "R$ X" ou "R$ Y"
4. Forneça números específicos e exatos extraídos dos dados
5. Identifique os nomes reais das colunas nos dados (elas podem variar)
6. Use a coluna que representa valor/receita para cálculos financeiros
7. Use a coluna "mes" para agrupar por mês

**PERGUNTA DO USUÁRIO:** ${input}

**FORMATO DE RESPOSTA:**
- Forneça números reais e específicos
- Mostre cálculos quando relevante
- Seja direto e objetivo
- Inclua insights acionáveis ao final`
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao chamar Gemini API");
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui processar sua solicitação.";

      setMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
    } catch (error) {
      toast({
        title: "Erro na análise",
        description: "Não foi possível processar sua pergunta",
        variant: "destructive",
      });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = () => {
    localStorage.setItem("gemini_api_key", apiKey);
    toast({
      title: "API Key salva",
      description: "Configuração atualizada com sucesso",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex flex-col">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gradient">Alpha Insights Bot</h1>
            <p className="text-sm text-muted-foreground">Assistente Analítico de Vendas</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configurações</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Gemini API Key</Label>
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Cole sua API key aqui"
                    />
                    <p className="text-xs text-muted-foreground">
                      Obtenha sua chave em: ai.google.dev
                    </p>
                  </div>
                  <Button onClick={saveApiKey} className="w-full">
                    Salvar Configuração
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={() => navigate("/")}>
              Voltar
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-6 flex gap-6">
        <aside className="w-64 space-y-4 hidden lg:block">
          <Card className="p-4 gradient-card shadow-elegant">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              Planilhas Carregadas
            </h3>
            <div className="space-y-2">
              {loadedSheets.length > 0 ? (
                loadedSheets.map((month, idx) => (
                  <div key={idx} className="text-sm flex items-center gap-2 text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-secondary" />
                    {month}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma planilha carregada</p>
              )}
            </div>
          </Card>
        </aside>

        <main className="flex-1 flex flex-col">
          <Card className="flex-1 gradient-card shadow-elegant flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center space-y-4">
                  <div>
                    <Bot className="h-16 w-16 mx-auto text-primary mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Bem-vindo ao Alpha Insights Bot</h2>
                    <p className="text-muted-foreground max-w-md">
                      Faça perguntas sobre suas vendas em linguagem natural. Por exemplo:
                      "Qual foi o produto mais vendido no terceiro trimestre?" ou 
                      "Qual a variação percentual de receita entre janeiro e dezembro?"
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === "user" && (
                      <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-accent-foreground" />
                      </div>
                    )}
                  </div>
                ))
              )}
              {loading && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary-foreground animate-pulse" />
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-muted-foreground">Analisando dados...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Digite sua pergunta sobre vendas..."
                  disabled={loading || loadedSheets.length === 0}
                />
                <Button onClick={handleSend} disabled={loading || !input.trim() || loadedSheets.length === 0}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default BotPage;
