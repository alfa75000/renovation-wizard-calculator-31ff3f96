
import React from "react";

const NoTravauxMessage: React.FC = () => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">Aucun travail n'a été ajouté.</p>
      <p className="text-sm mt-1 text-gray-500">Veuillez retourner à la page des travaux pour en ajouter.</p>
    </div>
  );
};

export default NoTravauxMessage;
