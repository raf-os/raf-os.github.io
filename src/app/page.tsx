'use client';

import { useState } from "react";
import type App from "@/components/App";
import Navbar from "@/components/layout/Navbar";
import TitleScreen from "./sections/TitleScreen";
import { GlobalAppContext, DefaultAppContext, type IGlobalAppContext } from "./GlobalContext";
import DialogPortal from "@/components/layout/DialogPortal";

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
			<div className="relative w-full flex flex-col">
				<BabylonApp antialias />
				<Navbar />

				<TitleScreen forceMount={false} />

				<DialogPortal />
			</div>
		</GlobalAppContext.Provider>
	)
}