import React from "react";
import "./App.css";
import A11yOverlay from "./components/A11yOverlay";
import Main from "./components/Main";
import { SpringMouseProvider } from "./components/SpringMouseProvider";
import ViewportHeightReporter from "./components/ViewportHeightReporter";
import { profile, projects } from "./data/projects";

function App() {
  return (
    <SpringMouseProvider>
      <ViewportHeightReporter />
      <A11yOverlay profile={profile} projects={projects} />
      <Main profile={profile} projects={projects} />
    </SpringMouseProvider>
  );
}

export default App;
