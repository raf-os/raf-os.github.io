'use client';

import BabylonApp from "@/components/BabylonApp";

export default function Home() {
	return (
		<div className="flex w-full h-dvh bg-red-400">
			<BabylonApp antialias style={{ width: "100%", height: "100%", outline: "none" }} />
		</div>
	)
}