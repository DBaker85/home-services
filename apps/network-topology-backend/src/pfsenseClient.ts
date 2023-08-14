import axios from "axios";
import { Agent } from "https";

const pfSenseBaseUrl = `https://${process.env.PFSENSE_IP as string}`;
const pfSenseDHCPleaseUrl = `${pfSenseBaseUrl}:${
  process.env.PFSENSE_PORT as string
}/api/v1/services/dhcpd/lease`;

const pfSenseClient = axios.create({
  httpsAgent: new Agent({
    rejectUnauthorized: false,
  }),
});

pfSenseClient.interceptors.request.use((request) => {
  request.headers.Authorization = `${process.env.PFSENSE_CLIENT_ID as string} ${
    process.env.PFSENSE_API_TOKEN as string
  }`;
  return request;
});

export { pfSenseClient, pfSenseDHCPleaseUrl };
