import { CSSProperties } from 'react';

import { deconstructKey } from '../../factories/keys';
import { Reference } from '../../factories/reference';
import { info200 } from '../cssTokens/colors';
import { useRouter } from '../router/useRouter';

type ReferenceLinkProps = { reference: Reference };

export function ReferenceLink({ reference }: ReferenceLinkProps) {
  const { navigate } = useRouter();
  const key = reference.referenceKey;
  const [mainKey, typeKey, restKey] = deconstructKey(key);

  const restType = typeKey === 'list' ? 'args' : 'id';
  return (
    <a style={referenceLinkStyle} onClick={() => navigate(key)}>
      {mainKey} {typeKey} {restType}: {restKey}
    </a>
  );
}

const referenceLinkStyle: CSSProperties = {
  color: info200,
  textDecoration: 'underline',
  cursor: 'pointer',
};
