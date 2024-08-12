import {
  grayscale25Gray,
  grayscale100Gray,
  grayscaleWhite,
} from '../cssTokens/colors';
import { Hover } from '../ui/Hover';
import { EntryInlineInfo } from './EntryInlineInfo';

type EntryInfoProps = {
  mainKey: string;
  typeKey: string;
  restKey?: string;
  onClick: () => void;
};
export function EntryInfo({
  mainKey,
  typeKey,
  restKey,
  onClick,
}: EntryInfoProps) {
  return (
    <Hover
      normalColor={grayscaleWhite}
      hoverColor={grayscale25Gray}
      pressedColor={grayscale100Gray}
    >
      <div onClick={onClick}>
        <EntryInlineInfo
          mainKey={mainKey}
          typeKey={typeKey}
          restKey={restKey}
        />
      </div>
    </Hover>
  );
}
