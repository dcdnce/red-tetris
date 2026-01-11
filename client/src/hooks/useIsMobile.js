import { useBreakpointValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export function useIsMobile() {
    const isSmallWidth = useBreakpointValue({ base: true, md: false });
    const [isSmallHeight, setIsSmallHeight] = useState(false);

    useEffect(() => {
        const checkHeight = () => {
            setIsSmallHeight(window.innerHeight < 700);
        };

        checkHeight();
        window.addEventListener("resize", checkHeight);
        return () => window.removeEventListener("resize", checkHeight);
    }, []);

    return isSmallWidth || isSmallHeight;
}
