
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProject } from "@/contexts/ProjectContext";
import { toast } from "sonner";

const Layout: React.FC = () => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const { saveProjectAsDraft } = useProject();

  const handleProjectNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProjectName(e.target.value);
  };

  const saveProject = async () => {
    await saveProjectAsDraft(projectName);
    setSaveDialogOpen(false);
    toast.success("Projet sauvegardé");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 mb-6 flex-grow">
        <Outlet />
      </main>

      <AlertDialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Sauvegarder le projet</Button>
        </AlertDialogTrigger>
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
