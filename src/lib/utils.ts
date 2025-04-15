
// Add a modification to the formaterQuantite function to handle casing
export const formaterQuantite = (quantite: number): string => {
  // Log the current formatting
  console.log('Formatting quantity:', quantite);
  
  // Modify to ensure proper uppercasing of units
  return new Intl.NumberFormat('fr-FR', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true
  }).format(quantite).replace(/\s/g, '\u00A0') + ' ';
};
