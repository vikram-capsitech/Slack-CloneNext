import axios from "axios";
import { getSession, signIn } from "next-auth/react";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    withCredentials:true,
    timeout:120000
});

apiClient.interceptors.request.use(
    async function (config) {
      let session: any = await getSession();
  
      if (!session?.accessToken) {
        throw new Error("No access token found");
      }
      // Check if the token is expired
      const isTokenExpired =
        session.expires && new Date(session.expires) < new Date();
        
      if (isTokenExpired) {
        // Attempt to refresh the token
        session = await signIn("credentials", {
          redirect: false,
        });
  
        if (!session) {
          throw new Error("Failed to refresh token");
        }
      }
      // Set authorization header with bearer token
      config.headers.Authorization = `Bearer ${session?.accessToken}`;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  
  export default apiClient;