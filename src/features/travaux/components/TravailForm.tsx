
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from 'sonner';
import { Service, Travail } from '@/types';
import TypeTravauxSelect from './TypeTravauxSelect';
import ServiceGroupSelect from './ServiceGroupSelect';
import SousTypeSelect from './SousTypeSelect';
import UpdateServiceModal from './UpdateServiceModal';
import { Input } from "@/components/ui/input";

interface TravailFormProps {
  piece: { id: string; name: string; surface: number } | null;
  onAddTravail: (travailData: Omit<Travail, 'id'>) => void;
  travailAModifier?: Travail | null;
}

const DescriptionSection: React.FC<{ service: Service; onChange: (updatedService: Service) => void }> = ({ service }) => (
  <div>
    <Label>Description</Label>
    <Textarea 
      value={service.description || ''} 
      readOnly
      className="bg-gray-100 text-gray-700"
    />
  </div>
);

const QuantitySection: React.FC<{ 
  service: Service; 
  onChange: (updatedService: Service) => void; 
  quantity: number; 
  onQuantityChange: (quantity: number) => void; 
}> = ({ service, quantity, onQuantityChange }) => (
  <div>
    <Label>Quantité ({service.unit})</Label>
    <Input
      type="number"
      value={quantity}
      onChange={(e) => onQuantityChange(parseFloat(e.target.value))}
      className="w-24"
    />
  </div>
);

const PriceSection: React.FC<{ service: Service; onChange: (updatedService: Service) => void }> = ({ service }) => (
  <div>
    <Label>Prix total</Label>
    <Input
      type="number"
      value={(service.labor_price + service.supply_price).toFixed(2)}
      readOnly
      className="bg-gray-100 text-gray-700"
    />
  </div>
);

const TvaSelect: React.FC<{ value: number; onChange: (tva: number) => void }> = ({ value, onChange }) => (
  <select 
    value={value}
    onChange={(e) => onChange(parseFloat(e.target.value))}
    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <option value={5.5}>5.5% - Travaux de rénovation énergétique</option>
    <option value={10}>10% - Travaux de rénovation</option>
    <option value={20}>20% - Taux normal</option>
  </select>
);

const TravailForm: React.FC<TravailFormProps> = ({ 
  piece, 
  onAddTravail, 
  travailAModifier = null 
}) => {
  const [selectedType, setSelectedType] = useState<{ id: string; label: string } | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<{ id: string; label: string } | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [tauxTva, setTauxTva] = useState<number>(10);
  const [commentaire, setCommentaire] = useState<string>('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleTypeChange = (id: string, label: string) => {
    setSelectedType({ id, label });
    setSelectedGroup(null);
    setSelectedService(null);
  };

  const handleGroupChange = (id: string, label: string) => {
    setSelectedGroup({ id, label });
    setSelectedService(null);
  };

  const handleSousTypeChange = (id: string, label: string, service: Service) => {
    setSelectedService(service);
  };

  // Détection des modifications apportées au service sélectionné
  const [hasServiceChanges, setHasServiceChanges] = useState(false);
  const [initialService, setInitialService] = useState<Service | null>(null);

  // Ajout de la logique pour détecter les changements dans le service
  useEffect(() => {
    if (selectedService && initialService && 
      (selectedService.name !== initialService.name || 
       selectedService.description !== initialService.description ||
       selectedService.labor_price !== initialService.labor_price ||
       selectedService.supply_price !== initialService.supply_price ||
       selectedService.unit !== initialService.unit ||
       selectedService.surface_impactee !== initialService.surface_impactee)) {
      setHasServiceChanges(true);
    } else {
      setHasServiceChanges(false);
    }
  }, [selectedService, initialService]);

  // Sauvegarde du service initial pour comparaison
  useEffect(() => {
    if (selectedService && !initialService) {
      setInitialService({...selectedService});
    }
  }, [selectedService, initialService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType || !selectedGroup || !selectedService) {
      toast.error("Veuillez sélectionner un type, un groupe et une prestation");
      return;
    }

    // Si des modifications ont été apportées au service, proposer la mise à jour
    if (hasServiceChanges) {
      const confirmUpdate = window.confirm(
        "Des modifications ont été apportées à la prestation. Souhaitez-vous mettre à jour la base de données avec ces changements?"
      );
      
      if (confirmUpdate) {
        setShowUpdateModal(true);
        return; // Ne pas soumettre le travail tout de suite
      }
    }
    
    submitTravail();
  };

  const submitTravail = () => {
    if (!selectedService || !piece) return;

    const travailData: Omit<Travail, 'id'> = {
      pieceId: piece.id,
      typeTravauxId: selectedType!.id,
      typeTravauxLabel: selectedType!.label,
      sousTypeId: selectedService.id,
      sousTypeLabel: selectedService.name,
      description: selectedService.description || '',
      quantite: quantity,
      unite: selectedService.unit || 'unité',
      prixFournitures: selectedService.supply_price,
      prixMainOeuvre: selectedService.labor_price,
      tauxTVA: tauxTva,
      commentaire: commentaire,
      surfaceImpactee: selectedService.surface_impactee
    };

    onAddTravail(travailData);
    toast.success("Le travail a été ajouté avec succès.");
  };

  const handleServiceUpdate = async (updateType: 'update' | 'create', serviceData: Partial<Service>) => {
    return new Promise<Service | null>((resolve) => {
      console.log("Mise à jour du service:", updateType, serviceData);
      
      setTimeout(() => {
        toast.success(`Service ${updateType === 'update' ? 'mis à jour' : 'créé'} avec succès (Mock)`);
        setShowUpdateModal(false);
        resolve({
          ...selectedService!,
          ...serviceData,
        });
      }, 1000);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Section Type de Travaux */}
      <div>
        <Label>Type de travaux</Label>
        <TypeTravauxSelect 
          value={selectedType?.id || ''}
          onChange={handleTypeChange}
        />
      </div>
      
      {/* Section Groupe de prestations */}
      <div>
        <Label>Groupe de prestations</Label>
        <ServiceGroupSelect 
          workTypeId={selectedType?.id || ''}
          value={selectedGroup?.id || ''}
          onChange={handleGroupChange}
          disabled={!selectedType}
        />
      </div>
      
      {/* Section Prestation */}
      <div>
        <Label>Prestation</Label>
        <SousTypeSelect 
          groupId={selectedGroup?.id || ''}
          value={selectedService?.id || ''}
          onChange={handleSousTypeChange}
          disabled={!selectedGroup}
        />
      </div>
      
      {/* Description */}
      {selectedService && (
        <DescriptionSection 
          service={selectedService} 
          onChange={(updatedService) => setSelectedService(updatedService)}
        />
      )}
      
      {/* Quantité et Surface impactée */}
      {selectedService && (
        <QuantitySection 
          service={selectedService}
          onChange={(updatedService) => setSelectedService(updatedService)}
          quantity={quantity}
          onQuantityChange={setQuantity}
        />
      )}
      
      {/* Prix */}
      {selectedService && (
        <PriceSection 
          service={selectedService}
          onChange={(updatedService) => setSelectedService(updatedService)}
        />
      )}
      
      {/* Section TVA */}
      <div>
        <Label>Taux de TVA</Label>
        <TvaSelect 
          value={tauxTva}
          onChange={setTauxTva}
        />
      </div>
      
      {/* Commentaires */}
      <div>
        <Label htmlFor="comment">Commentaires</Label>
        <Textarea 
          id="comment" 
          placeholder="Commentaires sur ce travail (optionnel)"
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
        />
      </div>
      
      {/* Note: Le champ "Personnalisation" a été supprimé comme demandé */}
      
      <div className="pt-4 flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setShowUpdateModal(false)}
        >
          Annuler
        </Button>
        
        {hasServiceChanges && (
          <Button 
            type="button" 
            variant="reset" 
            onClick={() => setShowUpdateModal(true)}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Mettre à jour la base de données
          </Button>
        )}
        
        <Button 
          type="submit"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter le travail
        </Button>
      </div>

      {showUpdateModal && selectedService && (
        <UpdateServiceModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          currentService={initialService || selectedService}
          updatedService={selectedService}
          onConfirmUpdate={handleServiceUpdate}
        />
      )}
    </form>
  );
};

export default TravailForm;
