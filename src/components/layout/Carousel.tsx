'use client';

import { motion } from "motion/react";
import { cn } from "@/app/lib/utils";

export type CarouselItemProps = {
    src: string,
    label: string,
}

export function CarouselTrack({items, className}: { items: CarouselItemProps[], className?: string }) {
    const carouselItems = (keyPrefix: string) => {
        return items.map((item, idx) => (
            <CarouselItem key={`${keyPrefix}-${idx}`}><img src={`/marquee/${item.src}`} alt={item.label} /></CarouselItem>
        ));
    }

    return (
        <div className={cn("carousel-wrapper", className)}>
            <motion.div
                className="carousel-track"
                initial={{
                    transform: "translateX(0%)",
                    filter: "grayscale(0.9)"
                }}
                animate={{
                    transform: "translateX(calc(-50% - var(--item-gap) / 2))"
                }}
                whileHover={{filter: "grayscale(0)"}}
                transition={{
                    ease: "linear",
                    duration: 10,
                    repeat: Infinity,
                    filter: {
                        duration: 0.5
                    }
                }}
            >
                { carouselItems('original') }
                { carouselItems('clone') }
            </motion.div>
        </div>
    )
}

export function CarouselItem({children, ref}: React.ComponentPropsWithRef<'div'>) {
    return (
        <div className="carousel-item" ref={ref}>
            { children }
        </div>
    )
}

const Carousel = {
    Track: CarouselTrack,
    Item: CarouselItem
}

export default Carousel;