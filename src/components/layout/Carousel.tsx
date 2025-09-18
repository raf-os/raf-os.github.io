'use client';

import { useEffect, useState, useRef } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { motion, useAnimate, hover, AnimatePresence } from "motion/react";
import { cn } from "@/app/lib/utils";

export type CarouselItemProps = {
    src: string,
    label: string,
}

export function CarouselTrack({items, className}: { items: CarouselItemProps[], className?: string }) {
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const [scope, animate] = useAnimate();
    const scrollAnim = useRef<ReturnType<typeof animate>>(null);
    const tooltipPortal = useRef<HTMLDivElement>(null);

    const carouselItems = (keyPrefix: string) => {
        return items.map((item, idx) => (
            <CarouselItem data={item} key={`${keyPrefix}-${idx}`} />
        ));
    }

    const handleHover = () => {
        setIsHovering(true);
        scrollAnim.current?.pause();

        return () => {
            setIsHovering(false);
            scrollAnim.current?.play();
        }
    };

    useEffect(() => {
        if (scope.current === null) return;
        return hover(scope.current, () => handleHover());
    }, []);

    useEffect(() => {
        animate(scope.current, { opacity: isHovering ? 1:0.4 }, { duration: 0.25, ease: "linear" });
    }, [isHovering]);

    useEffect(() => {
        scrollAnim.current = animate(
            scope.current,
            {
                transform: "translateX(calc(-50% - var(--item-gap) / 2))"
            }, {
                duration: 15,
                repeat: Infinity,
                ease: "linear"
        });
    }, []);

    return (
        <div className="relative">
            <div className={cn("carousel-wrapper", className)}>
                <div
                    ref={scope}
                    className="carousel-track"
                    style={{
                        transform: "translateX(0%)",
                        opacity: "0"
                    }}
                >
                    { carouselItems('original') }
                    { carouselItems('clone') }
                </div>
            </div>

            <div ref={tooltipPortal} className="absolute top-full" >
            </div>
        </div>
        
    )
}

export function CarouselItem({data}: { data: CarouselItemProps }) {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <Tooltip.Root delayDuration={0}>
            <Tooltip.Trigger asChild>
                <div className="carousel-item" ref={ref}>
                    <img src={`/marquee/${data.src}`} alt={data.label} />
                </div>
            </Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Content side="bottom" sideOffset={12} hideWhenDetached={true} arrowPadding={10}>
                    <motion.div initial={{y:12, opacity:0}} animate={{y:0, opacity:1, transition: {y: {ease: "circOut"}}}}>
                        <Tooltip.Arrow className="fill-emerald-500" width={16} height={8} />
                        <div className="bg-gray-800 text-white/80 border-2 border-emerald-500 rounded-lg px-2 py-1 shadow-md">
                            { data.label }
                        </div>
                    </motion.div>
                </Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip.Root>
    )
       
}

const Carousel = {
    Track: CarouselTrack,
    Item: CarouselItem
}

export default Carousel;