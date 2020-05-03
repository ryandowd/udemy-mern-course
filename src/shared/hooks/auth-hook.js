import { useState, useCallback, useEffect } from "react";

// NOTE: The reason we set this variable outside the App file, is because
// it's sort of unrelated to the rendering of the App comp, and doesn't need
// to re-render etc or have any state stuff.
let logoutTimer;

export const useAuth = () => {
  const [userId, setUserId] = useState(false);
  const [token, setToken] = useState(false);

  const [
    autoLogoutTokenExpirationDate,
    setAutoLogoutTokenExpirationDate,
  ] = useState();

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);

    // Generate the current time plus one hour. But only if
    // expirationDate doesn't already exist.
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    // NOTE 'localStorage' is a modern browser API. We use JSON.stringify
    // because local strorage only accepts a string.
    setAutoLogoutTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setAutoLogoutTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  // AUTO SIGN OUT
  // If the token expiration time has change then we handle that here.
  // This has to do with the auto-logout stuff.
  useEffect(() => {
    if (token && autoLogoutTokenExpirationDate) {
      const remainingTime =
        autoLogoutTokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, autoLogoutTokenExpirationDate]);

  // AUTO SIGN IN IF TOKEN IS AVAILABLE IN BROWSER
  // NOTE: useEffect() will only run after the render cycle. React will
  // render the component, then AFTER it runs useEffect.
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token);
    }
  }, [login]);

  return { token, login, logout, userId };
};
