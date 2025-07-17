
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProcessedStatement } from '@/types';

export interface StatementContextType {
  uploadedFile: File | null;
  statementData: ProcessedStatement | null;
  isProcessing: boolean;
  error: string | null;
  setUploadedFile: (file: File | null) => void;
  setStatementData: (data: ProcessedStatement | null) => void;
  setIsProcessing: (processing: boolean) => void;
  setError: (error: string | null) => void;
}

const StatementContext = createContext<StatementContextType | null>(null);

export const useStatement = () => {
  const context = useContext(StatementContext);
  if (!context) {
    throw new Error('useStatement must be used within a StatementProvider');
  }
  return context;
};

interface StatementProviderProps {
  children: ReactNode;
}

export const StatementProvider: React.FC<StatementProviderProps> = ({ children }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [statementData, setStatementData] = useState<ProcessedStatement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value: StatementContextType = {
    uploadedFile,
    statementData,
    isProcessing,
    error,
    setUploadedFile,
    setStatementData,
    setIsProcessing,
    setError,
  };

  return (
    <StatementContext.Provider value={value}>
      {children}
    </StatementContext.Provider>
  );
};
