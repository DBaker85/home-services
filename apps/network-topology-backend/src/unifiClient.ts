import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { Agent } from "https";

const unifiBaseUrl = `https://${process.env.UNIFI_IP as string}:${
  process.env.UNIFI_PORT as string
}`;
const unifiLoginUrl = `${unifiBaseUrl}/api/login`;
const unifiTopologyUrl = `${unifiBaseUrl}/v2/api/site/default/topology`;

const unifiClient = axios.create({
  httpsAgent: new Agent({
    rejectUnauthorized: false,
    keepAlive: true,
  }),
  withCredentials: true,
});

let unifiCookie = "";

unifiClient.interceptors.request.use((request) => {
  request.headers.Cookie = unifiCookie;
  return request;
});

// Axios middleware for reauthentication
unifiClient.interceptors.response.use(
  (response) => response, // Do nothing for successful responses
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Check if the error is due to 400 or 403 status code
    if (error.response != null && error.response.status >= 400) {
      // Perform a refresh request
      const authResponse = await unifiClient.post(unifiLoginUrl, {
        username: process.env.UNIFI_USER,
        password: process.env.UNIFI_PASSWORD,
        remember: true,
        strict: true,
      });

      const pattern = /(unifises|csrf_token)=([a-zA-Z0-9]+)/;

      const cookieString = authResponse.headers["set-cookie"]
        ?.map((cookie) => {
          const match = cookie.match(pattern);
          return match != null ? match[0] : "";
        })
        .join("; ");

      if (cookieString !== undefined) {
        unifiCookie = cookieString;
      }

      // Retry the original request with the updated headers
      return await unifiClient(originalRequest as AxiosRequestConfig);
    }

    // For other error types, simply throw the error
    throw error;
  }
);

export { unifiClient, unifiTopologyUrl };
