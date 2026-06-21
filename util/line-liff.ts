import liff from "@line/liff";

export async function getLiffUserProfile(liffId: string) {
  if (process.env.NEXT_PUBLIC_FORCE_USER_ID) {
    return {
      userId: process.env.NEXT_PUBLIC_FORCE_USER_ID,
      displayName: process.env.NEXT_PUBLIC_FORCE_USER_DISPLAY_NAME,
      pictureUrl: process.env.NEXT_PUBLIC_FORCE_USER_PICTURE_URL,
    };
  }

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
