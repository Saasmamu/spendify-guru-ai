
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProcessedStatement } from '@/services/pdfService';
import { Loader2 } from 'lucide-react';

interface SaveAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statementData: ProcessedStatement;
  insights: string[];
  categories: any[];
}

const SaveAnalysisDialog: React.FC<SaveAnalysisDialogProps> = ({
  open,
  onOpenChange,
  statementData,
  insights,
  categories
}) => {
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for this analysis",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Use the correct column mapping for the saved_analyses table
      const { error } = await supabase.from('saved_analyses').insert({
        name: name.trim(),
        user_id: user.id,
        transactions: JSON.parse(JSON.stringify(statementData.transactions)),
        total_income: statementData.totalIncome,
        total_expense: statementData.totalExpense,
        categories: JSON.parse(JSON.stringify(categories)),
        insights: JSON.parse(JSON.stringify(insights))
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Analysis saved successfully!",
        variant: "default"
      });

      setName('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving analysis:', error);
      toast({
        title: "Error",
        description: "Failed to save analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Analysis</DialogTitle>
          <DialogDescription>
            Give this analysis a name to save it for future reference.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., January 2024 Analysis"
              disabled={isSaving}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !name.trim()}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Analysis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveAnalysisDialog;
