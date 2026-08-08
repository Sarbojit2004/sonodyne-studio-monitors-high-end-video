import React from 'react';
import {cancelRender, continueRender, delayRender} from 'remotion';

import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/jetbrains-mono/wght.css';

/**
 * Blocks rendering until the variable fonts are actually parsed and ready.
 * Without this, early frames can rasterise in a fallback face and the display
 * type shifts mid-render - and the measured auto-fit in Type.tsx would be
 * sizing against metrics the browser is not yet using.
 */
export const useFontsReady = () => {
  const [handle] = React.useState(() =>
    delayRender('loading Archivo + JetBrains Mono'),
  );
  React.useEffect(() => {
    let live = true;
    document.fonts
      .load('800 128px "Archivo Variable"')
      .then(() => document.fonts.load('600 54px "JetBrains Mono Variable"'))
      .then(() => document.fonts.ready)
      .then(() => {
        if (live) continueRender(handle);
      })
      .catch((e) => cancelRender(e));
    return () => {
      live = false;
    };
  }, [handle]);
};
