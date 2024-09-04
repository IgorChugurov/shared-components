/**
 * main.ts
 *
 * The main entry point for the React application. It sets up the routing using
 * configuration from appdata.json. Routes are dynamically generated for each entity
 * listed under EntitiesForListAndServicesPackageAndEditPage, creating structured paths
 * that include listing and editing functionalities for each entity.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
