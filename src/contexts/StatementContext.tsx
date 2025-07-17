
import React, { createContext, useContext, useState, useCallback } from 'react';
import { BankTransaction, ProcessedStatement } from '@/types';
import { processBankStatement } from '@/services/pdfService';

interface StatementContextType {
  uploadedFile: File | null;
  statementData: ProcessedStatement | null;
  isProcessing: boolean;
  error: string | null;
  uploadStatement: (file: File) => Promise<void>;
  clearStatement: () => void;
}

const StatementContext = createContext<StatementContextType | undefined>(undefined);

export const StatementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [statementData, setStatementData] = useState<ProcessedStatement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadStatement = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await processBankStatement(file);
      setUploadedFile(file);
      setStatementData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process statement';
      setError(errorMessage);
      console.error('Statement processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearStatement = useCallback(() => {
    setUploadedFile(null);
    setStatementData(null);
    setError(null);
  }, []);

  const value: StatementContextType = {
    uploadedFile,
    statementData,
    isProcessing,
    error,
    uploadStatement,
    clearStatement
  };

  return (
    <StatementContext.Provider value={value}>
      {children}
    </StatementContext.Provider>
  );
};

export const useStatement = () => {
  const context = useContext(StatementContext);
  if (context === undefined) {
    throw new Error('useStatement must be used within a StatementProvider');
  }
  return context;
};
