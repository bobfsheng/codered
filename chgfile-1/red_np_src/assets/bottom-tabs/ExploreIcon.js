import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

function ExploreIcon({ size = 18, color = '#A6CF87', ...props }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 23 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M17.2 15.412c-2.249 3.15-6.571 3.882-9.647 1.685C4.478 14.9 3.77 10.573 6.018 7.423c2.25-3.149 6.572-3.882 9.647-1.685 3.076 2.197 3.785 6.525 1.535 9.674z"
        stroke={color}
        strokeWidth={2.5}
      />
      <Rect
        width={9.38}
        height={2.303}
        rx={1.151}
        transform="matrix(-.72178 .69212 -.71077 -.70342 8.407 16.62)"
        fill={color}
      />
    </Svg>
  );
}

export default ExploreIcon;
