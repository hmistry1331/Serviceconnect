import { cn } from '../../lib/utils';
import { motion as Motion, stagger, useAnimate, useInView } from 'motion/react';
import { useEffect } from 'react';

export const TypewriterEffect = ({
    words,
    className,
    cursorClassName,
    staggerDelay = 0.03,
    charDuration = 0.2,
}) => {
    // split text inside of words into array of characters
    const wordsArray = words.map(word => {
        return {
            ...word,
            text: word.text.split(''),
        };
    });

    const [scope, animate] = useAnimate();
    const isInView = useInView(scope);
    useEffect(() => {
        if (isInView) {
            animate(
                'span',
                {
                    display: 'inline-block',
                    opacity: 1,
                    width: 'fit-content',
                },
                {
                    duration: charDuration,
                    delay: stagger(staggerDelay),
                    ease: 'easeInOut',
                }
            );
        }
    }, [animate, charDuration, isInView, staggerDelay]);

    const renderWords = () => {
        return (
            <Motion.div ref={scope} className="inline">
                {wordsArray.map((word, idx) => {
                    const isLast = idx === wordsArray.length - 1;
                    return (
                        <div key={`word-${idx}`} className="inline-block">
                            {word.text.map((char, index) => (
                                <Motion.span
                                    initial={{}}
                                    key={`char-${index}`}
                                    className={cn(
                                        `text-white opacity-0 hidden`,
                                        word.className
                                    )}
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </Motion.span>
                            ))}
                            {!isLast && (
                                <Motion.span aria-hidden="true" className="inline-block">
                                    {'\u00A0'}
                                </Motion.span>
                            )}
                        </div>
                    );
                })}
            </Motion.div>
        );
    };
    return (
        <div
            className={cn(
                'text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center',
                className
            )}
        >
            {renderWords()}
            <Motion.span
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: 'reverse',
                }}
                className={cn(
                    'inline-block rounded-sm w-1 h-4 md:h-6 lg:h-10 bg-blue-500',
                    cursorClassName
                )}
            ></Motion.span>
        </div>
    );
};

export const TypewriterEffectSmooth = ({ words, className, cursorClassName }) => {
    // split text inside of words into array of characters
    const wordsArray = words.map(word => {
        return {
            ...word,
            text: word.text.split(''),
        };
    });
    const renderWords = () => {
        return (
            <div>
                {wordsArray.map((word, idx) => {
                    return (
                        <div key={`word-${idx}`} className="inline-block">
                            {word.text.map((char, index) => (
                                <span
                                    key={`char-${index}`}
                                    className={cn(`text-white`, word.className)}
                                >
                                    {char}
                                </span>
                            ))}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className={cn('flex space-x-1 my-6', className)}>
            <Motion.div
                className="overflow-hidden pb-2"
                initial={{
                    width: '0%',
                }}
                whileInView={{
                    width: 'fit-content',
                }}
                transition={{
                    duration: 5,
                    ease: 'linear',
                    delay: 1,
                }}
            >
                <div
                    className="text-xs sm:text-base md:text-xl lg:text:3xl xl:text-5xl font-bold"
                    style={{
                        whiteSpace: 'nowrap',
                    }}
                >
                    {renderWords()}{' '}
                </div>{' '}
            </Motion.div>
            <Motion.span
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                transition={{
                    duration: 0.8,

                    repeat: Infinity,
                    repeatType: 'reverse',
                }}
                className={cn(
                    'block rounded-sm w-1  h-4 sm:h-6 xl:h-12 bg-blue-500',
                    cursorClassName
                )}
            ></Motion.span>
        </div>
    );
};
