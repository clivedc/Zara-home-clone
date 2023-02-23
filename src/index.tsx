// import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const domNode = document.getElementById("app") as HTMLDivElement;
const root = createRoot(domNode);
root.render(<App />);
