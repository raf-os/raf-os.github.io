'use client';

import { useState, useEffect, useRef } from "react";
import type App from "@/components/App";
import Navbar from "@/components/layout/Navbar";
import TitleScreen from "./sections/TitleScreen";
import Exposition from "./sections/Exposition";
import ProjectList from "./sections/ProjectList";
import Footer from "./sections/Footer";
import { GlobalAppContext, DefaultAppContext, type IGlobalAppContext } from "./GlobalContext";
import DialogPortal from "@/components/layout/DialogPortal";
import Separator from "@/components/layout/Separator";

import BabylonApp from "@/components/BabylonApp";

export default function Home() {
	const appObj = useRef<App | null>(null);
	const [ isAppReady, setIsAppReady ] = useState<boolean>(false);

	const updateAppObj = (obj: App | null) => {
		appObj.current = obj;
	}

	const ctx: IGlobalAppContext = {
		...DefaultAppContext,
		appObj: appObj.current,
		updateAppObj: updateAppObj
	};

	const handleAppAssetsLoaded = () => {
		setIsAppReady(true);
	}

	useEffect(() => {
		if (appObj.current) {
			appObj.current.observables.onAssetsLoaded.addOnce(() => handleAppAssetsLoaded());
		}
	}, [appObj]);

	return (
		<GlobalAppContext.Provider value={ctx}>
			{/* yeah just wrap the entire fucking thing in a suspense why don't you zzzz */}
			<div className="relative w-full flex flex-col">
				<BabylonApp antialias />
				<Navbar />

				<TitleScreen forceMount={isAppReady} />

				<Separator className="mt-12" />

				<Exposition />

				<Separator className="mb-24" />

				<ProjectList />

				<Footer />

				<DialogPortal />
			</div>
		</GlobalAppContext.Provider>
	)
}