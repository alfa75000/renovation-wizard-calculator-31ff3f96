
export type MarginTuple = [number, number, number, number];

export const convertPageMargins = (margins: number[] | undefined): number[] => { 
  const defaultMargins: MarginTuple = [40, 40, 40, 40]; 

  if (!margins || !Array.isArray(margins) || margins.length === 0) {
    console.warn('Invalid or empty margins format, using defaults [40, 40, 40, 40]');
    return defaultMargins;
  }

  // Create an array with exactly 4 validated numeric values
  const validatedMargins = [
    Number(margins[0]) || defaultMargins[0],
    Number(margins[1]) || defaultMargins[1],
    Number(margins[2]) || defaultMargins[2],
    Number(margins[3]) || defaultMargins[3]
  ];

  return validatedMargins;
};

