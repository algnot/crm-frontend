import liff from "@line/liff";

export async function getLiffUserProfile(liffId: string) {
  return {
    userId: "Uc6dbdef7cdf7c97e811519ea04fff58d",
    displayName: "Khaimook",
    statusMessage: "(แมว)(แมว)(แมว)",
    pictureUrl:
      "https://profile.line-scdn.net/0htNsASJGqK2FeODRHSCxVXy5oKAt9SXJzdF40Bzg-d1VnX2tgcA0zUzswdQUwDjszcFtiUjttdVN8VyozJDs9dyl6MjAFbDxgAh0zeT9iHlINTBhxFiAbTyNTLAQDXA1PNwkhbmNtEDQDbjQzcC4wbgpYGxU1VAluMm9HN1sKReIxOlw0c15lB2owclHh",
  };

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
