'use client';

import { createContext, useState } from "react";
import type App from "@/components/App";
import TitleScreen from "./sections/TitleScreen";

import BabylonApp from "@/components/BabylonApp";

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

export default function Home() {
	const [ appObj, setAppObj ] = useState<App | undefined>(undefined);

	const updateAppObj = (obj: App | undefined) => {
		setAppObj(obj);
	}

	const ctx: IGlobalAppContext = {
		...DefaultAppContext,
		appObj: appObj,
		updateAppObj: updateAppObj
	};

	return (
		<GlobalAppContext.Provider value={ctx}>
			<div className="relative flex flex-col">
				<BabylonApp antialias adaptToDeviceRatio/>

				<TitleScreen forceMount={false} />
			</div>
		</GlobalAppContext.Provider>
	)
}