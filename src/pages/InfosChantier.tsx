
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/contexts/ClientsContext";
import { useProjetChantier } from "@/contexts/ProjetChantierContext";
import ClientForm from "@/features/admin/components/ClientForm";
import { Layout } from "@/components/Layout";

const formSchema = z.object({
  nomProjet: z.string().min(2, {
    message: "Le nom du projet doit comporter au moins 2 caractères.",
  }),
  descriptionProjet: z.string().optional(),
  adresseChantier: z.string().min(2, {
    message: "L'adresse du chantier doit comporter au moins 2 caractères.",
  }),
  occupant: z.string().optional(),
  infoComplementaire: z.string().optional(),
  clientId: z.string().optional(),
});

const InfosChantier = () => {
  const { toast } = useToast();
  const { state: clientsState, dispatch: clientsDispatch } = useClients();
  const { state, dispatch, sauvegarderProjet, chargerProjet } = useProjetChantier();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomProjet: state.projetActif?.nomProjet || "",
      descriptionProjet: state.projetActif?.descriptionProjet || "",
      adresseChantier: state.projetActif?.adresseChantier || "",
      occupant: state.projetActif?.occupant || "",
      infoComplementaire: state.projetActif?.infoComplementaire || "",
      clientId: state.projetActif?.clientId || "",
    },
  });

  useEffect(() => {
    if (state.projetActif) {
      form.reset({
        nomProjet: state.projetActif.nomProjet || "",
        descriptionProjet: state.projetActif.descriptionProjet || "",
        adresseChantier: state.projetActif.adresseChantier || "",
        occupant: state.projetActif.occupant || "",
        infoComplementaire: state.projetActif.infoComplementaire || "",
        clientId: state.projetActif.clientId || "",
      });
    } else {
      form.reset({
        nomProjet: "",
        descriptionProjet: "",
        adresseChantier: "",
        occupant: "",
        infoComplementaire: "",
        clientId: "",
      });
    }
  }, [state.projetActif, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    sauvegarderProjet({
      nomProjet: values.nomProjet,
      descriptionProjet: values.descriptionProjet || "",
      adresseChantier: values.adresseChantier,
      occupant: values.occupant || "",
      infoComplementaire: values.infoComplementaire || "",
      clientId: values.clientId || ""
    });
    
    toast({
      title: "Projet mis à jour.",
      description: "Les informations du projet ont été enregistrées avec succès.",
    });
  }

  const handleClientSubmit = (clientData: any) => {
    clientsDispatch({ type: 'ADD_CLIENT', payload: clientData });
    setOpen(false); // Ferme le modal après la soumission
    toast({
      title: "Client ajouté.",
      description: "Le client a été enregistré avec succès.",
    });
  };

  // Make sure we have clients before trying to render the list
  const clients = clientsState?.clients || [];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="container max-w-4xl mx-auto md:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Informations du projet</CardTitle>
              <CardDescription>
                Entrez les détails concernant le chantier et le client.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nomProjet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du projet</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom clair du projet" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="descriptionProjet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description du projet</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description des travaux à réaliser"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="adresseChantier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse du chantier</FormLabel>
                        <FormControl>
                          <Input placeholder="Adresse complète du chantier" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="occupant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupant</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de l'occupant" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="infoComplementaire"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Information complémentaire</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Informations utiles pour le projet"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.prenom} {client.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Mettre à jour</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Liste des clients</CardTitle>
              <CardDescription>
                Sélectionnez un client existant ou créez-en un nouveau.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-[1fr_110px] gap-4">
                  <Button variant="outline" onClick={() => setOpen(true)}>
                    Ajouter un client
                  </Button>
                </div>
                <ScrollArea className="h-[200px] w-full rounded-md border">
                  <div className="p-4">
                    {clients.length > 0 ? (
                      <ul className="list-none pl-0">
                        {clients.map((client) => (
                          <li key={client.id} className="py-2">
                            {client.prenom} {client.nom}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">Aucun client enregistré.</p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
        <ClientForm isOpen={open} onClose={() => setOpen(false)} onSubmit={handleClientSubmit} />
      </div>
    </Layout>
  );
};

export default InfosChantier;
