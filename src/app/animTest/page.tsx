'use client';

import LanguageSelector from "@/components/LanguageSelector";
import { Suspense } from "react";

export default function AnimTestPage() {
    return (
        <Suspense><div className="w-full h-dvh">
            <LanguageSelector />
        </div></Suspense>
    )
}