'use client';

import { useLocalization, Localized, mergeMultiline } from "@/hooks/useLocalization";
import Segment from "@/components/layout/Segment";
import Carousel, { CarouselItemProps } from "@/components/layout/Carousel";
import { useEffect } from "react";
import { useAnimate, useInView, stagger } from "motion/react";
import Separator from "@/components/layout/Separator";

const CarouselItems: CarouselItemProps[] = [{
    src: "vitejs_logo.svg",
    label: "Vite"
}, {
    src: "react_logo.svg",
    label: "React"
}, {
    src: "nextjs_logo.svg",
    label: "Next.js"
}, {
    src: "babylon_logo.svg",
    label: "Babylon.js"
}, {
    src: "mongodb_logo.svg",
    label: "Mongodb"
}, {
    src: "flask_logo.svg",
    label: "Flask"
}, {
    src: "unity_logo.svg",
    label: "Unity"
}, {
    src: "blender_logo.svg",
    label: "Blender"
}, {
    src: "gimp_logo.svg",
    label: "GIMP"
}];

export default function Exposition() {
    const [ introTitle, briefIntro, experienceIntro, sectionFooter ] = useLocalization([
        {
            "en-us": "Hello there! I'm Rafael.",
            "pt-br": "Olá! Sou Rafael."
        }, {
            "en-us": "I'm a programmer, and I have a degree in mechanical engineering, with emphasis in mechatronics. I've been programming ever since I was a child.",
            "pt-br": "Sou um programador, e me formei em engenharia mecânica, com ênfase em mecatrônica. Tenho programado desde que era criança."
        }, {
            "en-us": "When it comes to programming languages, I have experience with javascript, typescript, python, C, C#, C++, PHP. " +
            "Plus HTML and CSS, which were used to style this very website.\n" +
            "As for tools and frameworks I've worked with, these include, but are not limited to: Vite, React, Next.JS, Babylon.js, MySQL, Mongodb, Flask, Unity (game engine), Blender, Solidworks, Photoshop, GIMP.",
            "pt-br": "Falando em linguagens de programação, tenho experiência com javascript, typescript, python, C, C+, C++, PHP. " +
            "Bem como HTML e CSS, que foram usados para estilizar essa própria página\n " +
            "Em relação a ferramentas e frameworks que já utilizei, esses incluem, mas não se limitam a: Vite, React, Next.JS, Babylon.js, MySQL, Mongodb, Flask, Unity (criação de jogos/apps), Blender, Solidworks, Photoshop, GIMP."
        }, {
            "en-us": "On top of that, I am fluent in both english and portuguese, and have some familiarity with both italian and spanish.",
            "pt-br": "Além disso, sou fluente em inglês e português, e tenho familiaridade com italiano e espanhol."
        }
    ]);
    const [scope, animate] = useAnimate();
    const isInView = useInView(scope, { once: true });

    const handleAnimation = async() => {
        await animate(scope.current, { opacity: 1 });
        await animate("h1", { opacity: 1, y: 0 }, { delay: stagger(0.5), duration: 1 });
        await animate("[data-slot=content]", { height: "auto" }, { delay: 1.5, duration: 1, ease: "circOut" });
        await animate("p, [data-slot=animatable]", { opacity: 1, y: 0 }, { delay: stagger(0.25), duration: 0.5 });
    }

    useEffect(() => {
        if (isInView) {
            handleAnimation();
        } else {
            // initial state
            const anim = animate("h1, p, [data-slot=animatable]", { opacity: 0, y: 24 });
            anim.complete();
        }
    }, [isInView]);

    return (
        <Segment.Root className="justify-center min-h-lvh">
            <Segment.Main className="justify-center grow-1 shrink-1">
                <div
                    className="flex flex-col justify-center px-2 py-5 md:py-5 md:px-7 text-center bg-gray-800 rounded-lg shadow-lg"
                    data-slot="segment-body"
                    ref={scope}
                    style={{opacity: 0}}
                >
                    <Localized asChild><h1 className="self-center text-4xl md:text-6xl font-medium leading-none">{ introTitle }</h1></Localized>
                    
                    <div data-slot="content" className="p-1 flex flex-col justify-center gap-4 text-lg md:text-xl overflow-hidden" style={{height: 0}}>
                        <Separator data-slot="animatable" className="mt-6 mb-2" />

                        <Localized>{ mergeMultiline(briefIntro, experienceIntro) }</Localized>

                        <div data-slot="animatable" className="p-4 bg-emerald-800 rounded-xl my-4 outline-2 outline-emerald-800 outline-offset-2">
                            <Carousel.Track items={CarouselItems} />
                        </div>

                        <Localized>{ sectionFooter }</Localized>
                    </div>
                </div>
            </Segment.Main>
        </Segment.Root>
    )
}