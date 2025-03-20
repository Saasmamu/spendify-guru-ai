
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload, File, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface UploadCardProps {
  onFileSelect?: (file: File) => void;
}

const UploadCard = ({ onFileSelect }: UploadCardProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a PDF file.",
      });
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsProcessing(false);
      setUploadComplete(true);
      
      if (onFileSelect) {
        onFileSelect(file);
      }
      
      toast({
        title: "Upload complete",
        description: "Your statement has been uploaded successfully.",
      });
    }, 2000);
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadComplete(false);
  };

  return (
    <Card className={cn(
      "transition-all duration-300 border-2",
      isDragging ? "border-primary/50 bg-primary/5" : "border-border bg-card",
      uploadComplete ? "border-green-500/20 bg-green-50/50 dark:bg-green-950/10" : ""
    )}>
      <CardContent className="p-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center text-center p-8 rounded-lg transition-all duration-300",
            isDragging ? "bg-primary/5" : ""
          )}
        >
          {!selectedFile ? (
            <>
              <div className="mb-4 p-4 rounded-full bg-muted/50 animate-float">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Upload Bank Statement</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Drag and drop your PDF bank statement here, or click to browse your files
              </p>
              <Button 
                onClick={() => document.getElementById('file-upload')?.click()}
                size="lg"
                className="gap-2 animate-scale-in"
              >
                <File className="w-4 h-4" />
                Browse Files
              </Button>
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </>
          ) : (
            <div className="w-full">
              <div className="flex items-center mb-4">
                {isProcessing ? (
                  <div className="flex-1 flex items-center">
                    <div className="animate-spin mr-3">
                      <File className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Processing...</p>
                      <div className="h-1 w-full bg-muted mt-2 rounded-full overflow-hidden">
                        <div className="h-full bg-primary/80 animate-pulse w-2/3 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center">
                    <div className="mr-3 p-1 rounded-full bg-green-100 dark:bg-green-900/20">
                      {uploadComplete ? (
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <File className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium truncate">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={resetUpload}
                      className="ml-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              {uploadComplete && (
                <div className="animate-fade-in">
                  <p className="text-green-600 dark:text-green-400 text-sm mt-4 flex items-center">
                    <Check className="w-4 h-4 mr-1" /> 
                    Statement uploaded successfully!
                  </p>
                  <div className="mt-4">
                    <Button
                      className="w-full gap-2"
                      onClick={resetUpload}
                    >
                      <Upload className="w-4 h-4" />
                      Upload Another
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadCard;
