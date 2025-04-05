
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formaterPrix } from "@/lib/utils";

// Définition des sous-types de travaux (déplacée depuis Travaux.tsx)
const sousTravaux = {
  murs: [
    { id: "lessivage-travaux", label: "Lessivage pour travaux", prixUnitaire: 2.2, unite: "M²" },
    { id: "lessivage-soigne", label: "Lessivage soigné en conservation", prixUnitaire: 3.5, unite: "M²" },
    { id: "grattage", label: "Grattage, ouverture des fissures", prixUnitaire: 5, unite: "M²" },
    { id: "rebouchage", label: "Rebouchage, ponçage", prixUnitaire: 20, unite: "M²" },
    { id: "enduit-repassage", label: "Enduit repassé, ponçage", prixUnitaire: 25, unite: "M²" },
    { id: "toile-renfort", label: "Toile de renfort anti-fissures", prixUnitaire: 15, unite: "M²" },
    { id: "bande-calicot", label: "Bande Calicot anti-fissure", prixUnitaire: 10, unite: "Ml" },
    { id: "toile-verre", label: "Toile de verre à peindre", prixUnitaire: 18, unite: "M²" },
    { id: "peinture-acrylique", label: "Peinture type acrylique", prixUnitaire: 30, unite: "M²" },
    { id: "peinture-glycero", label: "Peinture type glycéro", prixUnitaire: 35, unite: "M²" },
    { id: "vernis", label: "Vernis", prixUnitaire: 40, unite: "M²" },
    { id: "enduit-decoratif", label: "Enduit décoratif", prixUnitaire: 45, unite: "M²" },
    { id: "papier-peint", label: "Papier peint", prixUnitaire: 22, unite: "M²" },
    { id: "faience", label: "Faïence / Carrelage", prixUnitaire: 80, unite: "M²" },
    { id: "lambris", label: "Lambris", prixUnitaire: 60, unite: "M²" },
    { id: "autre", label: "Autre", prixUnitaire: 0, unite: "M²" }
  ],
  plafond: [
    { id: "lessivage-travaux", label: "Lessivage pour travaux", prixUnitaire: 2.5, unite: "M²" },
    { id: "rebouchage", label: "Rebouchage, ponçage", prixUnitaire: 22, unite: "M²" },
    { id: "peinture-acrylique", label: "Peinture type acrylique", prixUnitaire: 32, unite: "M²" },
    { id: "peinture-glycero", label: "Peinture type glycéro", prixUnitaire: 38, unite: "M²" },
    { id: "autre", label: "Autre", prixUnitaire: 0, unite: "M²" }
  ],
  sol: [
    { id: "depose-ancien", label: "Dépose ancien revêtement", prixUnitaire: 15, unite: "M²" },
    { id: "preparation", label: "Préparation support", prixUnitaire: 25, unite: "M²" },
    { id: "carrelage", label: "Carrelage", prixUnitaire: 90, unite: "M²" },
    { id: "parquet", label: "Parquet", prixUnitaire: 85, unite: "M²" },
    { id: "stratifie", label: "Stratifié", prixUnitaire: 65, unite: "M²" },
    { id: "moquette", label: "Moquette", prixUnitaire: 45, unite: "M²" },
    { id: "linoleum", label: "Linoléum", prixUnitaire: 40, unite: "M²" },
    { id: "beton-cire", label: "Béton ciré", prixUnitaire: 120, unite: "M²" },
    { id: "autre", label: "Autre", prixUnitaire: 0, unite: "M²" }
  ],
  menuiseries: [
    { id: "depose-porte", label: "Dépose porte", prixUnitaire: 50, unite: "Ens." },
    { id: "depose-fenetre", label: "Dépose fenêtre", prixUnitaire: 70, unite: "Ens." },
    { id: "pose-porte", label: "Pose porte", prixUnitaire: 180, unite: "Ens." },
    { id: "pose-porte-fenetre", label: "Pose porte-fenêtre", prixUnitaire: 280, unite: "Ens." },
    { id: "pose-fenetre", label: "Pose fenêtre", prixUnitaire: 250, unite: "Ens." },
    { id: "peinture-menuiserie", label: "Peinture menuiserie", prixUnitaire: 45, unite: "M²" },
    { id: "autre", label: "Autre", prixUnitaire: 0, unite: "Unité" }
  ],
  electricite: [
    { id: "interrupteur", label: "Pose interrupteur", prixUnitaire: 40, unite: "Unité" },
    { id: "prise", label: "Pose prise", prixUnitaire: 45, unite: "Unité" },
    { id: "luminaire", label: "Pose luminaire", prixUnitaire: 70, unite: "Unité" },
    { id: "tableau", label: "Tableau électrique", prixUnitaire: 350, unite: "Unité" },
    { id: "autre", label: "Autre", prixUnitaire: 0, unite: "Unité" }
  ],
  plomberie: [
    { id: "evacuation", label: "Évacuation", prixUnitaire: 120, unite: "Ml" },
    { id: "alimentation", label: "Alimentation", prixUnitaire: 140, unite: "Ml" },
    { id: "sanitaire", label: "Sanitaire", prixUnitaire: 180, unite: "Unité" },
    { id: "autre", label: "Autre", prixUnitaire: 0, unite: "Unité" }
  ],
  platrerie: [
    { id: "cloison", label: "Cloison placo", prixUnitaire: 85, unite: "M²" },
    { id: "doublage", label: "Doublage", prixUnitaire: 75, unite: "M²" },
    { id: "faux-plafond", label: "Faux plafond", prixUnitaire: 90, unite: "M²" },
    { id: "autre", label: "Autre", prixUnitaire: 0, unite: "M²" }
  ],
  maconnerie: [
    { id: "ouverture", label: "Création ouverture", prixUnitaire: 450, unite: "Forfait" },
    { id: "demolition", label: "Démolition", prixUnitaire: 250, unite: "M3" },
    { id: "autre", label: "Autre", prixUnitaire: 0, unite: "Forfait" }
  ],
  autre: [
    { id: "autre", label: "Personnalisé", prixUnitaire: 0, unite: "Unité" }
  ]
};

// Exporter la constante pour réutilisation
export { sousTravaux };

interface SousTypeSelectProps {
  typeTravauxId: string | null;
  value: string | null;
  onChange: (value: string) => void;
}

const SousTypeSelect: React.FC<SousTypeSelectProps> = ({ typeTravauxId, value, onChange }) => {
  if (!typeTravauxId) return null;

  const options = sousTravaux[typeTravauxId as keyof typeof sousTravaux] || [];

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Prestations</label>
      <Select 
        value={value || ""} 
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionnez une prestation" />
        </SelectTrigger>
        <SelectContent>
          {options.map(sousType => (
            <SelectItem key={sousType.id} value={sousType.id}>
              {sousType.label} ({formaterPrix(sousType.prixUnitaire)}/{sousType.unite})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SousTypeSelect;
