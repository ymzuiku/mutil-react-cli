function getIsIphoneX() {
  return (
    /iphone/gi.test(navigator.userAgent) &&
    (window.screen.height === 812 && window.screen.width === 375)
  );
}

const isIPhoneX = getIsIphoneX();
export default isIphoneX;
