export type Reference = {
  referenceKey: string;
};

export function createReference(key: string): Reference {
  return { referenceKey: key };
}

export function isReference(value: unknown): value is Reference {
  return Boolean((value as Reference).referenceKey);
}
