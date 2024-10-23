import { createApp } from "./app";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import CoinMarketcap from "coinmarketcap-js";
import { getEnvOrThrow } from "./util/env";
import { AuthOptions } from "./middleware/jwt";
import { createRemoteJWKSet } from "jose";
import { Issuer } from "openid-client";

dotenv.config();

const port = process.env.PORT;

const apiKeyCmc = getEnvOrThrow("CMC_PRO_API_KEY");

const ccxtApiKey = getEnvOrThrow("CCXT_API_KEY");
const ccxtSecret = getEnvOrThrow("CCXT_SECRET");
const ccxtUID = getEnvOrThrow("CCXT_UID");
const ccxtPass = getEnvOrThrow("CCXT_PASS");

// You must provide either an 'issuerBaseURL', or an 'issuer' and 'jwksUri'
const issuerBaseURL = process.env.ISSUER_BASE_URL;
const issuer = process.env.ISSUER;
const jwksUri = process.env.JWKS_URI;
const audience = process.env.AUDIENCE;

const clients = {
  apiKey: ccxtApiKey,
  secret: ccxtSecret,
  uid: ccxtUID,
  passphrase: ccxtPass,
  cmc: CoinMarketcap(apiKeyCmc).crypto,
};

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");

    const authOptions: AuthOptions = await createAuthOptions();
    const { app, socketIO } = createApp(authOptions, clients);
    const server = app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });

    // set higher keepalive timeout (default: 5s)
    server.keepAliveTimeout = 60_000;

    socketIO.attach(server, {
      cors: {
        origin,
        methods: ["GET", "POST"],
      },
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
    process.exit(1);
  });

async function createAuthOptions() {
  let authOptions: AuthOptions;

  if (issuerBaseURL) {
    const issuerClient = await Issuer.discover(issuerBaseURL);
    authOptions = {
      key: createRemoteJWKSet(new URL(issuerClient.metadata.jwks_uri!)),
      verify: {
        issuer: issuerClient.metadata.issuer,
        audience,
      },
    };
  } else if (jwksUri) {
    authOptions = {
      key: createRemoteJWKSet(new URL(jwksUri)),
      verify: {
        issuer,
        audience,
      },
    };
  } else {
    throw new Error("Failed to resolve issuer");
  }
  return authOptions;
}
