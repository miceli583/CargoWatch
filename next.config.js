/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * i18n configuration is not compatible with App Router.
   * For internationalization in App Router, see:
   * @see https://nextjs.org/docs/app/building-your-application/routing/internationalization
   */
};

export default config;
