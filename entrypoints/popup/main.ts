import "./style.css";
import { renderApp } from "@/components/App";
import { setupEventListeners } from "@/components/eventListeners";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = renderApp();
setupEventListeners();
