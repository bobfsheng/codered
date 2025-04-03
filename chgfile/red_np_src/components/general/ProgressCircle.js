import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { actuatedNormalize, widthPercentageToDP, textStyles } from '@utils';

const ProgressCircle = ({ radius, progress, color }) => {
  // Calculate the circumference of the circle
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = widthPercentageToDP(0.7); // Progress circle thickness
  const adjustedRadius = radius - strokeWidth / 2;
  const svgSize = 2 * (radius + strokeWidth);

  // Calculate the dash offset to represent progress
  let dashOffset = circumference * (1 - progress);
  dashOffset = isFinite(dashOffset) ? dashOffset : 0;

  // Calculate the displayed progress percentage
  let displayProgress = Math.round(progress * 100);
  displayProgress = isFinite(displayProgress) ? displayProgress : 1;

  return (
    <View>
      <Svg width={svgSize} height={svgSize}>
        <Circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={adjustedRadius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
        {/* Add text element to display percentage in the center */}
        <SvgText
          x={radius + strokeWidth / 2}
          y={radius + strokeWidth / 2}
          textAnchor="middle"
          fontSize={actuatedNormalize(12)}
          fontFamily={textStyles.bigMedium.fontFamily}
          fill="white"
          dy="0.3em" // Adjust this value for vertical centering
        >
          {`${displayProgress}%`}
        </SvgText>
      </Svg>
    </View>
  );
};

export { ProgressCircle };
