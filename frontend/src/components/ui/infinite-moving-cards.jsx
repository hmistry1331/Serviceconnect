import { cn } from '../../lib/utils';
import React, { useCallback, useEffect } from 'react';

export const InfiniteMovingCards = ({
    items,
    direction = 'left',
    speed = 'fast',
    pauseOnHover = true,
    className,
}) => {
    const containerRef = React.useRef(null);
    const scrollerRef = React.useRef(null);

    const getDirection = useCallback(() => {
        if (containerRef.current) {
            if (direction === 'left') {
                containerRef.current.style.setProperty('--animation-direction', 'normal');
            } else {
                containerRef.current.style.setProperty('--animation-direction', 'reverse');
            }
        }
    }, [direction]);

    const getSpeed = useCallback(() => {
        if (containerRef.current) {
            if (speed === 'fast') {
                containerRef.current.style.setProperty('--animation-duration', '10s');
            } else if (speed === 'normal') {
                containerRef.current.style.setProperty('--animation-duration', '40s');
            } else {
                containerRef.current.style.setProperty('--animation-duration', '80s');
            }
        }
    }, [speed]);

    const addAnimation = useCallback(() => {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            scrollerContent.forEach(item => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });

            getDirection();
            getSpeed();
        }
    }, [getDirection, getSpeed]);

    useEffect(() => {
        addAnimation();
    }, [addAnimation]);
    return (
        <div
            ref={containerRef}
            className={cn(
                'scroller relative z-20 max-w-7xl overflow-hidden mask-[linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] ',
                className
            )}
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    'flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4',
                    'animate-scroll',
                    pauseOnHover && 'hover:paused'
                )}
            >
                {items.map((item, idx) => (
                    <li
                        className="relative w-[320px] max-w-full shrink-0 rounded-2xl border px-6 py-5 md:w-90 border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,#0d1f1f,#0a1818)]"
                        key={`${item.title}-${idx}`}
                    >
                        <blockquote>
                            <div
                                aria-hidden="true"
                                className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%+4px)] w-[calc(100%+4px)]"
                            ></div>
                            <span className="relative z-20 text-sm leading-[1.6] font-normal text-gray-100">
                                <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-[rgba(232,197,71,0.1)] transition-colors">
                                    <item.icon className="h-5 w-5 text-[#e8c547]" />
                                </div>
                            </span>
                            <div className="relative z-20 mt-6 flex flex-row items-center">
                                <span className="flex flex-col gap-1">
                                    <span className="text-sm leading-[1.6] font-normal text-[#7ea3a3]">
                                        <h3 className="text-base md:text-lg font-semibold mb-1 text-white">
                                            {item.title}
                                        </h3>
                                    </span>
                                    <span className="text-sm leading-[1.6] font-normal text-[#5a8080]">
                                        <p className="leading-relaxed text-xs md:text-sm">
                                            {item.description}
                                        </p>
                                    </span>
                                </span>
                            </div>
                        </blockquote>
                    </li>
                ))}
            </ul>
        </div>
    );
};
