'use client';

import { useState } from "react";
import type App from "@/components/App";
import Navbar from "@/components/layout/Navbar";
import TitleScreen from "./sections/TitleScreen";
import Exposition from "./sections/Exposition";
import { GlobalAppContext, DefaultAppContext, type IGlobalAppContext } from "./GlobalContext";
import DialogPortal from "@/components/layout/DialogPortal";
import Separator from "@/components/layout/Separator";
import { Suspense } from "react";

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
			{/* yeah just wrap the entire fucking thing in a suspense why don't you */}
			<Suspense>
			<div className="relative w-full flex flex-col">
				<BabylonApp antialias />
				<Navbar />

				<TitleScreen forceMount={false} />

				<Separator className="my-12" />

				<Exposition />

				<DialogPortal />
			</div>
			</Suspense>
		</GlobalAppContext.Provider>
	)
}