const https = require("https");

const KINDE_DOMAIN =
  process.env.KINDE_ISSUER_URL?.replace("https://", "") ||
  "kalinkamenov.kinde.com";
const KINDE_M2M_CLIENT_ID = process.env.KINDE_M2M_CLIENT_ID;
const KINDE_M2M_CLIENT_SECRET = process.env.KINDE_M2M_CLIENT_SECRET;
const VERCEL_URL = process.env.VERCEL_URL;

if (!KINDE_M2M_CLIENT_ID || !KINDE_M2M_CLIENT_SECRET) {
  console.log(
    "⚠️  KINDE_M2M_CLIENT_ID and KINDE_M2M_CLIENT_SECRET not set - skipping URL update"
  );
  process.exit(0);
}

if (!VERCEL_URL) {
  console.log("⚠️  VERCEL_URL not set - skipping URL update");
  process.exit(0);
}

const VERCEL_HTTPS_URL = `https://${VERCEL_URL}`;

async function getAccessToken() {
  const data = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: KINDE_M2M_CLIENT_ID,
    client_secret: KINDE_M2M_CLIENT_SECRET,
    audience: `https://${KINDE_DOMAIN}/api`,
  });

  const response = await fetch(`https://${KINDE_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: data,
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const result = await response.json();
  return result.access_token;
}

async function updateApplication(accessToken) {
  // Get current application details
  const getResponse = await fetch(
    `https://${KINDE_DOMAIN}/api/v1/applications`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  if (!getResponse.ok) {
    throw new Error(`Failed to get applications: ${getResponse.statusText}`);
  }

  const applications = await getResponse.json();
  const app = applications.applications?.find(
    (app) => app.client_id === process.env.KINDE_CLIENT_ID
  );

  if (!app) {
    throw new Error("Application not found");
  }

  // Update callback URLs
  const existingCallbackUrls = app.callback_urls || [];
  const newCallbackUrl = `${VERCEL_HTTPS_URL}/api/auth/kinde_callback`;

  if (!existingCallbackUrls.includes(newCallbackUrl)) {
    const updatedCallbackUrls = [...existingCallbackUrls, newCallbackUrl];

    const updateResponse = await fetch(
      `https://${KINDE_DOMAIN}/api/v1/applications/${app.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          callback_urls: updatedCallbackUrls,
          logout_urls: [...(app.logout_urls || []), VERCEL_HTTPS_URL],
          allowed_origins: [...(app.allowed_origins || []), VERCEL_HTTPS_URL],
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error(
        `Failed to update application: ${updateResponse.statusText}`
      );
    }

    console.log(`✅ Added ${VERCEL_HTTPS_URL} to Kinde application URLs`);
  } else {
    console.log(
      `✅ ${VERCEL_HTTPS_URL} already exists in Kinde application URLs`
    );
  }
}

async function main() {
  try {
    console.log("🔄 Getting Kinde access token...");
    const accessToken = await getAccessToken();

    console.log("🔄 Updating Kinde application URLs...");
    await updateApplication(accessToken);

    console.log("✅ Kinde URLs updated successfully!");
  } catch (error) {
    console.error("❌ Error updating Kinde URLs:", error.message);
    process.exit(1);
  }
}

main();
