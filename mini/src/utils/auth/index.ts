const TokenKey = 'token';
const TokenPrefix = 'Bearer ';
function isLogin() {
  return !!uni.getStorageSync(TokenKey);
}
function getToken() {
  return uni.getStorageSync(TokenKey);
}
function setToken(token: string) {
  uni.setStorageSync(TokenKey, token);
}
function clearToken() {
  uni.removeStorageSync(TokenKey);
}
function mustLogin() {
  if (!isLogin()) {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
    });
    uni.navigateTo({
      url: '/pages/common/login/index',
    });
    return false;
  }
  return true;
}
export { clearToken, getToken, isLogin, mustLogin, setToken, TokenPrefix };
