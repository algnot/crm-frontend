import liff from "@line/liff";

export async function getLiffUserProfile(liffId: string) {
  return {
    userId: "U4e4b31ba7d4aba32da947d56890d0069",
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
