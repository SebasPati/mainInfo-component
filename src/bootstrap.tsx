import React from "react";
import App from "./App";
import "./styles/index.scss";
import "./registry-wc/register-dt-components";
import { createRoot } from "react-dom/client";

//funcion mount para montar la aplicacion tanto en local como en produccion
const mount = (el: Element, properties: any) => {
  const root = createRoot(el);
  root.render(<App properties={properties} />);
};

//para montar local mente
if (process.env.NODE_ENV === "development") {
  const devRoot = document.querySelector("#_mainInfo-dev-root");
  if (devRoot) {
    mount(devRoot, {
      onSuccess() {
        console.log("onSuccess called");
      },
      onError() {
        console.log("onError called");
      },
      onBack() {
        console.log("onBack called");
      },
    });
  }
}

//para produccion
export { mount };
