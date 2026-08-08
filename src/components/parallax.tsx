"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

const images = [
    "/parallax/logos/1.png",
    "/parallax/logos/2.png",
    "/parallax/logos/3.png",
    "/parallax/logos/4.png",
    "/parallax/logos/5.png",
    "/parallax/logos/6.png",
    "/parallax/logos/7.png",
    "/parallax/logos/8.png",
    "/parallax/logos/9.png",
    "/parallax/logos/10.png",

];

const Skiper30 = () => {
    const gallery = useRef<HTMLDivElement>(null);
    const [dimension, setDimension] = useState({ width: 0, height: 0 });

    const { scrollYProgress } = useScroll({
        target: gallery,
        offset: ["start end", "end start"],
    });

    const { height } = dimension;
    const y = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
    const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

    useEffect(() => {
        const lenis = new Lenis();

        let rafId: number | null = null;
        const raf = (time: number) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };

        const resize = () => {
            setDimension({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener("resize", resize);
        rafId = requestAnimationFrame(raf);
        resize();

        return () => {
            window.removeEventListener("resize", resize);
            if (rafId != null) cancelAnimationFrame(rafId);
            // Best-effort cleanup (lenis version exposes some combination of these).
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (lenis as any)?.destroy?.();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (lenis as any)?.stop?.();
        };
    }, []);

    return (
        <main className="w-full max-w-[100vw] min-w-0 bg-[#eee] text-black overflow-x-clip">
            {/* <div className="font-geist flex items-center justify-center gap-2">
                <div className="absolute left-1/2 top-[10%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
                    <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-white after:to-black after:content-['']">
                        scroll down to see
                    </span>
                </div>
            </div> */}

            <div
                ref={gallery}
                className="relative box-border grid grid-cols-2 lg:grid-cols-4 h-[125vh] sm:h-[150vh] lg:h-[175vh] gap-2 p-2 sm:gap-[2vw] sm:p-[2vw] overflow-hidden bg-white"
            >
                <Column images={[images[0], images[1], images[6]]} y={y} />
                <Column images={[images[7], images[4], images[5]]} y={y2} />
                <Column images={[images[6], images[7], images[0]]} y={y3} />
                <Column images={[images[2], images[7], images[8]]} y={y4} />
            </div>
            {/* <div className="font-geist relative flex items-center justify-center gap-2">
                <div className="absolute left-1/2 top-[10%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
                    <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-white after:to-black after:content-['']">
                        scroll Up to see
                    </span>
                </div>
            </div> */}
        </main>
    );
};

type ColumnProps = {
    images: string[];
    y: MotionValue<number>;
};

const Column = ({ images, y }: ColumnProps) => {
    return (
        <motion.div
            className="relative -top-[45%] flex h-full w-full min-w-0 flex-col gap-2 sm:gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
            style={{ y }}
        >
            {images.map((src, i) => (
                <div key={i} className="relative min-h-[100px] flex-1 w-full overflow-hidden rounded-lg sm:rounded-none">
                    <img
                        src={`${src}`}
                        alt="tfm"
                        className="pointer-events-none h-full w-full min-h-[100px] object-cover"
                    />
                </div>
            ))}
        </motion.div>
    );
};

export { Skiper30 };

/**
 * Skiper 30 Parallax_002 — React + framer motion + lenis
 * Inspired by and adapted from https://www.siena.film/films/my-project-x
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the siena.film . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.in
 * Twitter: https://x.com/Gur__vi
 */
