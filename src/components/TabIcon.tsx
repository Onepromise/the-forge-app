import React from 'react';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';

export type IconName =
  | 'areas'
  | 'quests'
  | 'log'
  | 'character'
  | 'check'
  | 'flame'
  | 'ryo'
  | 'add'
  | 'back';

/** Icon paths straight from the design doc: 24px grid, 1.5px stroke. */
const ICONS: Record<IconName, React.ReactNode> = {
  areas: (
    <>
      <Polygon points="12,2.5 20.5,7.25 20.5,16.75 12,21.5 3.5,16.75 3.5,7.25" />
      <Polygon points="12,8 15.5,10 15.5,14 12,16 8.5,14 8.5,10" />
    </>
  ),
  quests: (
    <Path d="M9 6h11M9 12h11M9 18h11M4 4.5 5.5 6 4 7.5 2.5 6zM4 10.5 5.5 12 4 13.5 2.5 12zM4 16.5 5.5 18 4 19.5 2.5 18z" />
  ),
  log: (
    <Path d="M12 6.5v13M3.5 5H9a3 3 0 0 1 3 3 3 3 0 0 1 3-3h5.5v13H15a3 3 0 0 0-3 2 3 3 0 0 0-3-2H3.5z" />
  ),
  character: (
    <>
      <Circle cx="12" cy="8" r="3.5" />
      <Path d="M5 20c1-4 3.8-6 7-6s6 2 7 6" />
    </>
  ),
  check: <Path d="M4.5 12.5 9.5 17.5 19.5 6.5" />,
  flame: (
    <Path d="M12 3c1 3 4.5 4.5 4.5 9.5a4.5 4.5 0 0 1-9 0c0-2.2 1-3.5 2.2-4.5 0 2 .8 3 1.8 3 0-3-1-5 .5-8z" />
  ),
  ryo: (
    <>
      <Circle cx="12" cy="12" r="8.5" />
      <Rect x="10" y="10" width="4" height="4" />
    </>
  ),
  add: <Path d="M12 5v14M5 12h14" />,
  back: <Path d="M15 5l-7 7 7 7" />,
};

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function TabIcon({ name, size = 24, color = '#EDE4D3', strokeWidth = 1.5 }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
    >
      {ICONS[name]}
    </Svg>
  );
}
