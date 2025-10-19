import { useNavigate } from "react-router-dom";
import { Bot, Upload, BarChart3, TrendingUp, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient">Alpha Insights</h1>
              <p className="text-sm text-muted-foreground">Sistema de Análise de Vendas Inteligente</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-16 animate-fade-in">
          <section className="text-center space-y-6">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full gradient-primary mb-4">
              <Bot className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Análise de Vendas com{" "}
              <span className="text-gradient">Inteligência Artificial</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transforme seus dados de vendas em insights acionáveis com nosso bot analítico
              potencializado pela Gemini API
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/upload")} className="shadow-elegant">
                <Upload className="mr-2 h-5 w-5" />
                Upload de Planilhas
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/bot")}>
                <Bot className="mr-2 h-5 w-5" />
                Acessar Bot
              </Button>
            </div>
          </section>

          <section className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 gradient-card shadow-elegant hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Simplificado</h3>
              <p className="text-muted-foreground">
                Carregue suas 12 planilhas mensais de vendas de forma rápida e segura
              </p>
            </Card>

            <Card className="p-6 gradient-card shadow-elegant hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Análise Inteligente</h3>
              <p className="text-muted-foreground">
                IA analisa seus dados e responde perguntas complexas em linguagem natural
              </p>
            </Card>

            <Card className="p-6 gradient-card shadow-elegant hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Insights Acionáveis</h3>
              <p className="text-muted-foreground">
                Receba recomendações estratégicas baseadas em tendências e padrões
              </p>
            </Card>
          </section>

          <section className="bg-muted/50 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Database className="h-16 w-16 mx-auto text-primary" />
              <h3 className="text-3xl font-bold">Estrutura de Dados</h3>
              <p className="text-muted-foreground">
                Cada planilha deve conter as seguintes colunas:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {["Data", "ID_Transacao", "Produto", "Categoria", "Região", "Quantidade", "Preço_Unitário", "Receita_Total"].map((col) => (
                  <div key={col} className="bg-card px-3 py-2 rounded-lg border">
                    {col}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Formatos aceitos: .xlsx, .xls, .csv | Mínimo: 200 linhas por planilha
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Alpha Insights - Sistema de Análise de Vendas</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
