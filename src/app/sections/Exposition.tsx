'use client';

import { useLocalization, Localized, mergeMultiline } from "@/hooks/useLocalization";
import { cn } from "@lib/utils";
import Carousel, { CarouselItemProps } from "@/components/layout/Carousel";

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
    const [ introTitle, briefIntro, experienceIntro ] = useLocalization([
        {
            "en-us": "Hello there! I'm Rafael.",
            "pt-br": "Olá! Sou Rafael."
        }, {
            "en-us": "I'm a programmer, and I have a degree in mechanical engineering, with emphasis in mechatronics.",
            "pt-br": "Sou um programador, e me formei em engenharia mecânica, com ênfase em mecatrônica."
        }, {
            "en-us": "When it comes to programming languages, I have experience with javascript, typescript, python, C, C#, C++, PHP. " +
            "Plus HTML and CSS, which were used to style this very website.\n" +
            "As for tools and frameworks I've worked with, these include, but are not limited to: Vite, React, Next.JS, Babylon.js, MySQL, Mongodb, Flask, Unity (game engine), Blender, Solidworks, Photoshop, GIMP.",
            "pt-br": "Falando em linguagens de programação, tenho experiência com javascript, typescript, python, C, C+, C++, PHP. " +
            "Bem como HTML e CSS, que foram usados para estilizar essa própria página\n " +
            "Em relação a ferramentas e frameworks que já utilizei, esses incluem, mas não se limitam a: Vite, React, Next.JS, Babylon.js, MySQL, Mongodb, Flask, Unity (criação de jogos/apps), Blender, Solidworks, Photoshop, GIMP."
        }
    ]);
    return (
        <Segment.Root className="py-12 justify-center min-h-dvh">
            <Segment.Main className="justify-center">
                <div className="flex flex-col justify-center gap-4 text-lg md:text-xl px-3 py-6 md:py-6 md:px-8 text-center bg-gray-800 rounded-lg shadow-lg" data-slot="segment-body">
                    <Localized asChild><h1 className="self-center text-4xl md:text-6xl font-medium mb-2">{ introTitle }</h1></Localized>
                    <Localized>{ mergeMultiline(briefIntro, experienceIntro) }</Localized>

                    <div className="p-4 bg-emerald-800 rounded-xl my-4 outline-2 outline-emerald-800 outline-offset-2">
                        <Carousel.Track items={CarouselItems} />
                    </div>
                </div>
            </Segment.Main>
        </Segment.Root>
    )
}

const Segment = {
    Root({ children, className, ...rest}: React.ComponentPropsWithRef<'div'>) {
        return (
            <div
                className={cn("flex flex-col items-center w-full px-2 md:px-0", className)}
                {...rest}
            >
                { children }
            </div>
        )
    },

    Main({ children, className, ...rest}: React.ComponentPropsWithRef<'div'>) {
        return (
            <div
                className={cn(
                    "flex flex-col gap-2 w-full md:w-[920px]",
                    className
                )}
                { ...rest}
            >
                { children }
            </div>
        )
    }
}