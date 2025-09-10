'use client';

import TitleScreen from "@/app/sections/TitleScreen";
import { DialogWrapper } from "@/components/layout/DialogPortal";

export default function AnimTestPage() {
    return (
        <div className="w-full h-dvh">
            <DialogWrapper dismissFn={() => {}} title="test">
                <p>TEST</p>
                <a>LINK YEA</a>
            </DialogWrapper>
        </div>
    )
}