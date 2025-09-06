'use client';

import { useState } from "react";
import type App from "@/components/App";
import TitleScreen from "./sections/TitleScreen";
import { GlobalAppContext, DefaultAppContext, type IGlobalAppContext } from "./GlobalContext";

import BabylonApp from "@/components/BabylonApp";

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