
export type MarginTuple = [number, number, number, number];

export const convertPageMargins = (margins: number[] | undefined): MarginTuple => { 
  const defaultMargins: MarginTuple = [40, 40, 40, 40]; 

  if (!margins || !Array.isArray(margins) || margins.length === 0) {
    console.warn('Invalid or empty margins format, using defaults [40, 40, 40, 40]');
    return defaultMargins;
  }

  // Create a properly typed margin tuple with validation
  const validatedMargins: MarginTuple = [
    Number(margins[0]) || defaultMargins[0],
    Number(margins[1]) || defaultMargins[1],
    Number(margins[2]) || defaultMargins[2],
    Number(margins[3]) || defaultMargins[3]
  ];

  // Additional validation to ensure no NaN values
  const finalMargins: MarginTuple = [
    isNaN(validatedMargins[0]) ? defaultMargins[0] : validatedMargins[0],
    isNaN(validatedMargins[1]) ? defaultMargins[1] : validatedMargins[1],
    isNaN(validatedMargins[2]) ? defaultMargins[2] : validatedMargins[2],
    isNaN(validatedMargins[3]) ? defaultMargins[3] : validatedMargins[3]
  ];

  return finalMargins;
};
