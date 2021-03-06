import React from 'react';
import {Circle, G, Path, Rect, Svg, Mask} from 'react-native-svg';

export const WorkSessionsIcon = () => (
  <Svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="false">
    <G>
      <Path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
    </G>
  </Svg>
);

export const ContractsIcon = () => (
  <Svg height="30" width="30" viewBox="0 0 24 24" aria-hidden="false">
    <G>
      <Path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></Path>
    </G>
  </Svg>
);
export const UsersIcon = () => (
  <Svg height="30" width="30" viewBox="0 0 24 24" aria-hidden="false">
    <G>
      <Path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></Path>
    </G>
  </Svg>
);

export const UserCircle = props => {
  const {color} = props;
  return (
    <Svg height="20" width="20">
      <Circle cx="10" cy="10" r="5" stroke={color} fill={color} />
    </Svg>
  );
}

export const LeftArrowIcon = props => {
  const {color} = props;
  return (
    <Svg
      width="35"
      height="35"
      viewBox="0 0 105 188"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M103 4C99.3333 7.66667 3 94 3 94L103 184V144L43 94L103 44V4Z"
        fill={color}
        stroke={color}
        stroke-width="3"
      />
    </Svg>
  );
};

export const RightArrowIcon = props => {
  const {color} = props;
  return (
    <Svg
      width="35"
      height="35"
      viewBox="0 0 105 188"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M2 4C5.66667 7.66667 102 94 102 94L2 184V144L62 94L2 44V4Z"
        fill={color}
        stroke={color}
        stroke-width="3"
      />
    </Svg>
  );
};

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

export const SmallRightArrowIcon = () => (
  <Svg
    width="15"
    height="15"
    viewBox="0 0 105 188"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M2 4C5.66667 7.66667 102 94 102 94L2 184V144L62 94L2 44V4Z"
      fill="#E3DCE8"
      stroke="#E3DCE8"
      stroke-width="3"
    />
  </Svg>
);

export const SmallDownArrowIcon = () => (
  <Svg
    width="15"
    height="9"
    viewBox="0 0 15 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M14.6809 0.470745C14.3883 0.763299 7.5 8.44947 7.5 8.44947L0.319149 0.470745L3.51064 0.470745L7.5 5.25798L11.4894 0.470745L14.6809 0.470745Z"
      fill="#E3DCE8"
      stroke="#E3DCE8"
      stroke-width="0.239362"
    />
  </Svg>
);

export const BackArrowIcon = () => (
  <Svg
    width="35"
    height="35"
    viewBox="0 0 225 188"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M103 184C99.3333 180.333 3 94 3 94L103 4L103 44L43 94L103 144V184Z"
      fill="#EEEEEE"
      stroke="#EEEEEE"
      stroke-width="3"
    />
    <Rect x="45" y="74" width="180" height="40" fill="#EEEEEE" />
  </Svg>
);

export const AddButtonIcon = () => (
  <Svg
    width="50"
    height="50"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Circle cx="15" cy="15" r="14.5" fill="#651FFF" stroke="#651FFF" />
    <Rect x="14" y="6" width="2" height="18" fill="#EEEEEE" />
    <Rect
      x="6"
      y="16"
      width="2"
      height="18"
      transform="rotate(-90 6 16)"
      fill="#EEEEEE"
    />
  </Svg>
);

export const SaveIcon = () => (
  <Svg
    width="40"
    height="40"
    focusable="false"
    viewBox="0 0 24 24"
    aria-hidden="true">
    <G>
      <Path
        fill="#EEEEEE"
        d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
      />
    </G>
  </Svg>
);

export const RefreshIcon = () => (
  <Svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">
    <G>
      <Path
        fill="#651FFF"
        stroke="#651FFF"
        d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
      />
    </G>
  </Svg>
);

export const CopyIcon = () => (
  <Svg
    width="45"
    height="45"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Circle cx="15" cy="15" r="14.5" fill="#651FFF" stroke="#651FFF" />
    <Rect
      x="12.75"
      y="11.75"
      width="10.5"
      height="13.5"
      rx="2.25"
      stroke="#EEEEEE"
      stroke-width="1.5"
    />
    <Mask id="poly">
      <Path
        d="M5 4L16.5 3L20.5 5L18.5 10.5H14.5L11.5 12.5V20H11H5.65499L5 4Z"
        fill="#EEEEEE"
      />
    </Mask>
    <G mask="url(#poly)">
      <Rect
        x="6.75"
        y="4.75"
        width="10.5"
        height="13.5"
        rx="2.25"
        stroke="#EEEEEE"
        stroke-width="1.5"
      />
    </G>
  </Svg>
);

export const CancelIcon = () => (
  <Svg
    width="45"
    height="45"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Circle cx="15" cy="15" r="14.5" fill="#F33B3B" stroke="#F33B3B" />
    <Rect
      x="7"
      y="8.41421"
      width="2"
      height="20"
      transform="rotate(-45 7 8.41421)"
      fill="#EEEEEE"
    />
    <Rect
      x="8.41421"
      y="22.5563"
      width="2"
      height="20"
      transform="rotate(-135 8.41421 22.5563)"
      fill="#EEEEEE"
    />
  </Svg>
);

export const DeleteIcon = () => (
  <Svg
    width="45"
    height="45"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Circle cx="15" cy="15" r="14.5" fill="#F33B3B" stroke="#F33B3B" />
    <Path
      d="M9 22C9 23.1 9.9 24 11 24H19C20.1 24 21 23.1 21 22V10H9V22ZM22 7H18.5L17.5 6H12.5L11.5 7H8V9H22V7Z"
      fill="#EEEEEE"
    />
  </Svg>
);
