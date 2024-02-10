import nookies from "nookies";

export const setToken = (token) => {
  const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60); // valid for 1 hour
  nookies.set(
    null,
    "userData",
    JSON.stringify({ token, expiration: tokenExpirationDate }),
    {
      maxAge: 60 * 60, // valid for 1 hour
      path: "/",
    }
  );
};

export const getToken = (ctx = null) => {
  const cookies = nookies.get(ctx);

  if (!cookies?.userData) return null;

  const userData = JSON.parse(cookies.userData);
  if (new Date(userData.expiration) < new Date()) {
    nookies.destroy(null, "userData");
    return null;
  }
  return userData.token;
};

export const removeToken = () => {
  nookies.destroy(null, "userData");
};
