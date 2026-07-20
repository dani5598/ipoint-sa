import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ children, className = '' }) {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Set visible state whenever in viewport, remove it when scrolled away
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.1, // trigger when at least 10% is visible
                rootMargin: '0px 0px -50px 0px' // offset bottom triggers slightly for better feel
            }
        );

        const currentRef = domRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div
            ref={domRef}
            className={`transition-all duration-1000 ease-out transform ${
                isVisible 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-16 scale-[0.98] pointer-events-none'
            } ${className}`}
        >
            {children}
        </div>
    );
}
