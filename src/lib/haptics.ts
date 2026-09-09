export const haptics = {
  tap() {
    try {
      if (navigator.vibrate) navigator.vibrate(10);
    } catch {}
  },
  success() {
    try {
      if (navigator.vibrate) navigator.vibrate([20, 30, 20]);
    } catch {}
  },
  error() {
    try {
      if (navigator.vibrate) navigator.vibrate([30, 40, 30, 40, 30]);
    } catch {}
  },
  light() {
    try {
      if (navigator.vibrate) navigator.vibrate(5);
    } catch {}
  },
  medium() {
    try {
      if (navigator.vibrate) navigator.vibrate(15);
    } catch {}
  },
};
