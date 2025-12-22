import React, { useState, useEffect } from 'react'
import "./style.css"
import { motion } from 'motion/react';

export const MotionButton = () => {

    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(prev => !prev)
        }, 2000) // Animation every 3 seconds

        return () => clearInterval(interval)
    }, [])

    return (
        <motion.button
            className='button'
            initial={false}
        >
            <motion.p
                className='buttonTitle'
                // animate={{ y: isAnimating ? -40 : 0 }}
                animate={{ y: isAnimating ? 0 : 60 }}
                transition={{duration: 0.3}}
            >
                Get Started
            </motion.p>
            <motion.p
                className='buttonTitle2'
                // animate={{ y: isAnimating ? 0 : 40 }}
                animate={{ y: isAnimating ? 60 : 0 }}
                transition={{duration: 0.3}}
            >
                Get Started
            </motion.p>
            <motion.div
                className='buttonBackground flex justify-center items-center'
                animate={{ 
                    y: isAnimating ? "0%" : "100%",
                    scaleX: isAnimating ? 1 : 0.5
                }}
                transition={{duration: 0.3}}
            >
                <p className='text-center'>Lets Connect </p>
            </motion.div>
        </motion.button>
    )
}