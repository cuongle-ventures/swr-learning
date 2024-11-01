import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { SWRConfig } from "swr";

createRoot(document.getElementById("root")!).render(
  <SWRConfig
    value={{
      dedupingInterval: 30000,
      revalidateOnFocus: false,
    }}
  >
    <App />
  </SWRConfig>
);
