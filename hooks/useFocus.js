import React, {useState, useEffect} from 'react';

export const useFocus = navigation => {
  const [hasFocus, setFocus] = useState(true);
  const onFocus = () => {
    setFocus(true);
  };
  const onBlur = () => {
    setFocus(false);
  };
  useEffect(() => {
    const focusListener = navigation.addListener('didFocus', onFocus);
    const blurListener = navigation.addListener('didBlur', onBlur);
    return () => {
      focusListener.remove();
      blurListener.remove();
    };
  }, [navigation]);
  return hasFocus;
};
