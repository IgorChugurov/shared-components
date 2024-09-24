import path from "path";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import Dotenv from "dotenv-webpack";
//import CssModulesPlugin from "esbuild-plugin-css-modules";

const envFilePath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, ".env")
    : path.resolve(__dirname, `.env.${process.env.NODE_ENV}`);

// Log the environment file being used
console.log(`Using environment file: ${envFilePath}`);

export default defineConfig({
  html: {
    template: "./index.html",
  },
  source: {
    entry: {
      index: "./src/index.tsx",
    },
    alias: {
      "~": path.join(__dirname, "src"),
    },
  },
  output: {
    cleanDistPath: true,
    distPath: {
      root: "build",
    },
    cssModules: {
      auto: (resource) => {
        return resource.includes(".module.");
      },
    },
  },
  server: {
    port: 5104,
  },
  dev: {
    //assetPrefix: "http://localhost:3002",
    // It is necessary to configure assetPrefix, and in the production environment, you need to configure output.assetPrefix
    //assetPrefix: 'http://localhost:3040',
  },
  tools: {
    rspack: (config, { appendPlugins }) => {
      config.output!.uniqueName = "OPIE_App_Templates";
      appendPlugins([
        // new ModuleFederationPlugin({
        //   name: "OPIE_templates",
        //   exposes: {
        //      "./appInjectorMain": "./src/modulefederation/appInjector",
        //   },

        //   shared: {
        //     react: { singleton: true, requiredVersion: "18.3.1" },
        //     "react-dom": { singleton: true, requiredVersion: "18.3.1" },
        //     "react-router-dom": { singleton: true, requiredVersion: "6.23.1" },
        //     "react-redux": { singleton: true, requiredVersion: "9.1.2" },
        //   },
        // }),
        new Dotenv({
          path: envFilePath, // Use the dynamically determined path
        }),
      ]);
    },
  },
  plugins: [pluginReact()],
});
