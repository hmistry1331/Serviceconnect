import { cn } from '../../lib/utils';
import { motion as Motion } from 'motion/react';
import React, { useMemo } from 'react';

export const Meteors = ({ number, className }) => {
    const meteorCount = number || 20;
    const meteors = useMemo(() => {
        return Array.from({ length: meteorCount }, (_, idx) => ({
            key: `meteor-${idx}`,
            position: idx * (800 / meteorCount) - 400,
            animationDelay: `${(idx % 6) * 0.7}s`,
            animationDuration: `${5 + (idx % 6)}s`,
        }));
    }, [meteorCount]);

    return (
        <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {meteors.map((meteor) => {
                return (
                    <span
                        key={meteor.key}
                        className={cn(
                            'animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]',
                            "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
                            className
                        )}
                        style={{
                            top: '-40px', // Start above the container
                            left: `${meteor.position}px`,
                            animationDelay: meteor.animationDelay,
                            animationDuration: meteor.animationDuration,
                        }}
                    ></span>
                );
            })}
        </Motion.div>
    );
};
