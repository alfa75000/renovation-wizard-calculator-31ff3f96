
import React, { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const { saveProjectAsDraft } = useProject();

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  const saveProject = async () => {
    await saveProjectAsDraft(projectName);
    setSaveDialogOpen(false);
    toast.success('Projet sauvegardé');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b py-4 px-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-gray-500">{subtitle}</p>
          </div>
          <Button variant="outline" onClick={() => setSaveDialogOpen(true)}>
            Sauvegarder le projet
          </Button>
        </div>
      </header>
      
      <main className="flex-1 p-6 container mx-auto">
        {children}
      </main>

      <AlertDialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sauvegarder le projet</AlertDialogTitle>
            <AlertDialogDescription>
              Entrez le nom du projet pour sauvegarder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="name">Nom du projet</Label>
              <Input 
                id="name" 
                value={projectName} 
                onChange={handleProjectNameChange}
                placeholder="Nom du projet" 
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={saveProject}>Sauvegarder</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Layout;
