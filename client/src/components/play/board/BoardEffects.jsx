import { Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectLastHardDrop } from "../../../store/uiSlice";
const MotionText = motion.create(Text);

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

export function useShake(playerUsername) {
    const [isShaking, setIsShaking] = useState(false);
    const lastHardDrop = useSelector(selectLastHardDrop);

    useEffect(() => {
        if (lastHardDrop && lastHardDrop.username === playerUsername) {
            setIsShaking(true);
        }
    }, [lastHardDrop, playerUsername]);

    const onAnimationComplete = useCallback(() => {
        if (isShaking) {
            setIsShaking(false);
        }
    }, [isShaking]);

    return { isShaking, onAnimationComplete };
}

export const shakeAnimation = {
    shake: {
        y: [0, -5, 1, -5, 1, -3, 0],
        transition: { duration: 0.3, ease: "easeInOut" },
    },
    idle: {
        y: 0,
    },
};
