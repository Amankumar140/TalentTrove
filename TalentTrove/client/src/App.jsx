
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Authenticate from "./pages/Authenticate";
import Freelancer from "./pages/freelancer/Freelancer";
import AllProjects from "./pages/freelancer/AllProjects";
import MyProjects from "./pages/freelancer/MyProject";
import MyApplications from "./pages/freelancer/MyApplications";
import ProjectData from "./pages/freelancer/ProjectData";
import Client from "./pages/client/Client";
import ProjectApplications from "./pages/client/ProjectApplications";
import NewProject from "./pages/client/NewProject";
import ProjectWorking from "./pages/client/ProjectWorking";
import Admin from "./pages/admin/Admin";
import AllApplications from "./pages/admin/AllApplications";
import AllUsers from "./pages/admin/AllUsers";
import AdminProjects from "./pages/admin/AdminProjects";

// Define Routes using createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />, // Navbar wraps the pages
    children: [
      { path: "/", element: <Landing /> },
      { path: "/authenticate", element: <Authenticate /> },

      { path: "/freelancer", element: <Freelancer /> },
      { path: "/all-projects", element: <AllProjects /> },
      { path: "/my-projects", element: <MyProjects /> },
      { path: "/myApplications", element: <MyApplications /> },
      { path: "/project/:id", element: <ProjectData /> },

      { path: "/client", element: <Client /> },
      { path: "/project-applications", element: <ProjectApplications /> },
      { path: "/new-project", element: <NewProject /> },
      { path: "/client-project/:id", element: <ProjectWorking /> },

      { path: "/admin", element: <Admin /> },
      { path: "/admin-projects", element: <AdminProjects /> },
      { path: "/admin-applications", element: <AllApplications /> },
      { path: "/all-users", element: <AllUsers /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;


