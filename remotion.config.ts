import {Config} from '@remotion/cli/config';

// PNG frames + an explicit bt709 colour space. This matters more than usual
// here: the whole design is a light warm-neutral ground, so a full-range /
// mistagged-matrix encode would visibly shift the paper tone on players that
// assume limited-range bt709. Remotion performs the real conversion (not just
// metadata tagging) and recommends PNG frames for accurate colour throughout.
Config.setVideoImageFormat('png');
Config.setColorSpace('bt709');
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('angle');
Config.setConcurrency(4);
Config.setCodec('h264');
Config.setCrf(17);
Config.setPixelFormat('yuv420p');
Config.setAudioCodec('aac');
Config.setAudioBitrate('320k');

// This environment blocks remotion.media, so Remotion cannot fetch its own
// Chrome Headless Shell. Point it at the Chromium that ships with the image.
Config.setBrowserExecutable(
  process.env.REMOTION_BROWSER ??
    '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
);
