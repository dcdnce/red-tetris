import { Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
const MotionText = motion(Text);

export function useValueDelta(value) {
    const prev = useRef(value);

    const delta = value - prev.current;

    useEffect(() => {
        prev.current = value;
    }, [value]);

    return delta;
}

export function AnimatedNumber({ value, color = "black", duration = 0.15 }) {
    return (
        <MotionText
            key={value}
            fontSize="20"
            fontWeight="bold"
            fontFamily="mono"
            initial={{ scale: 0.85, opacity: 0, color: "black" }}
            animate={{ scale: 1, opacity: 1, color: color }}
            transition={{ duration: duration, ease: "easeOut" }}
        >
            {value}
        </MotionText>
    );
}
