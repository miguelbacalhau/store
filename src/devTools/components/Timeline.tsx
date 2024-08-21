import { CSSProperties } from 'react';

import { grayscale400Gray } from '../cssTokens/colors';
import { fontWeight500 } from '../cssTokens/fonts';
import { radius50 } from '../cssTokens/radius';
import { space50, space100 } from '../cssTokens/spacings';
import { Button } from '../ui/Button';

type TimelineProps = {
  currentTime: number;
  timelineSize: number;
  timeTravelTo: (time: number) => void;
};

export function Timeline({
  currentTime,
  timelineSize,
  timeTravelTo,
}: TimelineProps) {
  const spaceStyle = {
    padding: `${space100} ${space100} ${space100} ${space100}`,
  };

  const availableTimes = Array(timelineSize)
    .fill(0)
    .map((_, number) => number);

  return (
    <div style={timelineStyle}>
      <div style={timelineTextStyle}>Timeline</div>
      <div style={{ ...timelineBarStyle, ...spaceStyle }}>
        {availableTimes.map((time) => (
          <Button
            variant="grey"
            key={time}
            isDisabled={currentTime === time}
            onClick={() => timeTravelTo(time)}
          >
            {time}
          </Button>
        ))}
      </div>
    </div>
  );
}

const timelineStyle: CSSProperties = {
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  gap: space50,
};

const timelineTextStyle: CSSProperties = {
  fontWeight: fontWeight500,
};

const timelineBarStyle: CSSProperties = {
  flexGrow: 1,
  border: `1px solid ${grayscale400Gray}`,
  borderRadius: radius50,
};
