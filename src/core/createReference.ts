export type Reference = {
  referenceKey: string;
};

export function createReference(key: string): Reference {
  return { referenceKey: key };
}
