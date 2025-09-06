import type App from "@/components/App";
import { createContext } from "react";

export interface IGlobalAppContext {
    appObj?: App;
    updateAppObj: (obj: App | undefined) => void;
    lang: "pt-br" | "en-us";
}

export const DefaultAppContext: IGlobalAppContext = {
    updateAppObj: () => {},
    lang: "en-us",
}

export const GlobalAppContext = createContext<IGlobalAppContext>(DefaultAppContext);