/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      NEXT_PUBLIC_WATSONX_AI_PROJECT_ID: process.env.NEXT_PUBLIC_WATSONX_AI_PROJECT_ID,
    },
  };
  
  export default nextConfig;
  