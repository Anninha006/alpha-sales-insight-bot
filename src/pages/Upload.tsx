import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const Upload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = async (monthIndex: number, file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validar estrutura
      if (jsonData.length === 0) {
        throw new Error("Planilha vazia");
      }

      const firstRow = jsonData[0] as any;
      const requiredColumns = ["Data", "ID_Transacao", "Produto", "Categoria", "Região", "Quantidade", "Preço_Unitário", "Receita_Total"];
      const hasAllColumns = requiredColumns.every(col => col in firstRow);

      if (!hasAllColumns) {
        throw new Error("Planilha não contém todas as colunas necessárias");
      }

      // Salvar no localStorage
      localStorage.setItem(`sales_${monthIndex}`, JSON.stringify(jsonData));
      
      setUploadedFiles(prev => ({ ...prev, [monthIndex]: true }));
      toast({
        title: "Upload concluído",
        description: `Planilha de ${MONTHS[monthIndex]} carregada com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Erro ao processar planilha",
        variant: "destructive",
      });
    }
  };

  const allFilesUploaded = Object.keys(uploadedFiles).length === 12;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gradient">Alpha Insights</h1>
            <p className="text-sm text-muted-foreground">Sistema de Análise de Vendas</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Voltar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Upload de Planilhas Mensais</h2>
            <p className="text-muted-foreground">
              Faça upload das 12 planilhas de vendas mensais (Janeiro a Dezembro)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MONTHS.map((month, index) => (
              <Card key={index} className="p-6 gradient-card shadow-elegant hover:shadow-lg transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{month}</h3>
                    </div>
                    {uploadedFiles[index] && (
                      <CheckCircle2 className="h-5 w-5 text-secondary" />
                    )}
                  </div>
                  
                  <label className="block">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(index, file);
                      }}
                    />
                    <Button 
                      variant={uploadedFiles[index] ? "secondary" : "default"}
                      className="w-full"
                      asChild
                    >
                      <span className="cursor-pointer">
                        <UploadIcon className="h-4 w-4 mr-2" />
                        {uploadedFiles[index] ? "Atualizar" : "Upload"}
                      </span>
                    </Button>
                  </label>
                </div>
              </Card>
            ))}
          </div>

          {allFilesUploaded && (
            <Card className="p-6 gradient-primary text-primary-foreground shadow-elegant">
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 mx-auto" />
                <div>
                  <h3 className="text-xl font-bold">Todas as planilhas carregadas!</h3>
                  <p className="text-primary-foreground/80">
                    Agora você pode acessar o bot analítico
                  </p>
                </div>
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/bot")}
                >
                  Ir para o Bot Analítico
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Upload;
