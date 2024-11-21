//import SomeComponent from "./components/someComponents/SomeComponent";
import { GlobalStateProvider } from "./context/GlobalStateProvider";
import { Navigate, RouterProvider } from "react-router-dom";
import ErrorBoundary from "./components/error-boundary";

import "./css/index.css";
import "./css/fonts.css";
import "./css/typography.css";
import "./css/colors.css";
import "./css/inputs.css";
import "./css/select.css";
import "./css/switch.css";
import "./css/radio.css";
import "./shared-components/css/menu.css";
import "./css/buttons.css";
import "./css/iconButtons.css";
import "./css/modal.css";
import "./css/customDataGrid.css";
import "./index.css";

import { createBrowserRouter } from "react-router-dom";
import NavbarApp from "./components/navbar/NavbarApp.tsx";
import Home from "./pages/home/Home.tsx";
import {
  Entities,
  Entity,
  Facilities,
  NewOrEditDatasetItem,
  Settings,
  Users,
} from "./routeComponents.tsx";
import { Icon_logo } from "./Logo.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="mainContainer">
        <NavbarApp darkTheme={true} LogoIcon={Icon_logo} />
        <Home />
      </div>
    ),
    children: [
      {
        path: "/facilities",
        element: <Facilities />,
        children: [
          {
            path: "/facilities/:facilityId/entities",
            element: <Entities />,
            children: [
              {
                path: "/facilities/:facilityId/entities/:entityId",
                element: <Entity />,
                children: [
                  {
                    path: "/facilities/:facilityId/entities/:entityId/newitem",
                    element: <NewOrEditDatasetItem />,
                  },
                  {
                    path: "/facilities/:facilityId/entities/:entityId/:datasetItemId",
                    element: <NewOrEditDatasetItem />,
                  },
                ],
              },
            ],
          },
          {
            path: "/facilities/:facilityId/users",
            element: <Users />,
          },
          {
            path: "/facilities/:facilityId/settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
  {
    path: "/*",
    element: <Navigate to="/" replace={true} />, // Redirect to home page
  },
]);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <GlobalStateProvider>
        <RouterProvider router={router} />
      </GlobalStateProvider>
    </ErrorBoundary>
  );
};

export default App;
