import liff from "@line/liff";

export async function getLiffUserProfile(liffId: string) {
  if (!liffId) {
    return;
  }

  await liff.init({
    liffId: liffId,
  });

  if (!liff.isLoggedIn()) {
    liff.login({
      redirectUri: window.location.href,
    });
  }

  return await liff.getProfile();
}
