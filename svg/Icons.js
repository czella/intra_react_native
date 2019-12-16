import React from 'react';
import {G, Path, Rect, Svg} from 'react-native-svg';

export const WorkSessionsIcon = () => (
  <Svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="false">
    <G>
      <Path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
    </G>
  </Svg>
);

export const LeftArrowIcon = () => (
  <Svg
    width="35"
    height="35"
    viewBox="0 0 105 188"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M103 4C99.3333 7.66667 3 94 3 94L103 184V144L43 94L103 44V4Z"
      fill="#651FFF"
      stroke="#651FFF"
      stroke-width="3"
    />
  </Svg>
);

export const RightArrowIcon = () => (
  <Svg
    width="35"
    height="35"
    viewBox="0 0 105 188"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M2 4C5.66667 7.66667 102 94 102 94L2 184V144L62 94L2 44V4Z"
      fill="#651FFF"
      stroke="#651FFF"
      stroke-width="3"
    />
  </Svg>
);

export const HamburgerMenuIcon = () => (
  <Svg
    width="45"
    height="20"
    viewBox="0 0 45 39"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Rect width="45" height="9" rx="3" fill="#EEEEEE" />
    <Rect y="15" width="45" height="9" rx="3" fill="#EEEEEE" />
    <Rect y="30" width="45" height="9" rx="3" fill="#EEEEEE" />
  </Svg>
);

export const LogoutIcon = () => (
  <Svg height="30" width="30" viewBox="0 0 24 24" aria-hidden="true">
    <G>
      <Path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
    </G>
  </Svg>
);

export const DashboardIcon = () => (
  <Svg height="30" width="30" viewBox="0 0 24 24" aria-hidden="false">
    <G>
      <Path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </G>
  </Svg>
);
