import { useContext, useEffect, useState } from 'react';

import { TimelineContext } from './TimelineProvider';

export function useTimeTravel() {
  const { storeTimeline, timeTravel } = useContext(TimelineContext);
  const [currentTime, setCurrentTime] = useState(storeTimeline.size);

  const timelineSize = storeTimeline.size;

  useEffect(() => {
    setCurrentTime(timelineSize - 1);
  }, [timelineSize]);

  function timeTravelTo(time: number) {
    setCurrentTime(time);

    timeTravel(time);
  }

  return { timeTravelTo, currentTime, timelineSize };
}
