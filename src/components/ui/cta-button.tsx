import React, { useState } from 'react'
import "./style.css"
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export const CtaButton = () => {
    const [isHover, setIshover] = useState(false)

    return (
        <div>
            <div className="buttonContainer bg-primary border border-primary/10 text-primary-foreground"
                onMouseEnter={e => setIshover(true)}
                onMouseLeave={e => setIshover(false)}
            >
                <motion.div className='circle'
                    animate={{
                        scale: isHover ? 60 : 1,
                        backgroundColor: isHover ? "hsl(38, 45%, 88%)" : "hsl(30, 10%, 15%)"
                    }}
                // transition={{
                //     ease: "easeIn",
                //     duration: 0.2
                // }}
                ></motion.div>
                <motion.div
                    className='title'
                    animate={{
                        x: isHover ? -8 : 3,
                        color: isHover ? "hsl(30, 10%, 15%)" : "#FFFFFF"
                    }}
                >
                    <p>Start Your Project</p>
                </motion.div>
                <motion.div className="iconContainer"
                    animate={{
                        x: isHover ? 0 : 24,
                    }}
                >
                    <ArrowRight className="icon text-primary" />
                </motion.div>
            </div>
        </div>
    )
}
