import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Header({ isHome }) {
    const navigate = useNavigate();

    async function navigateHome() {
        navigate(`/`);
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    const colors = [
        "#FF6B6B", // Rouge
        "#96CEB4", // Vert
        "#FECA57", // Jaune
        "#FF9FF3", // Rose
    ];

    const currentColor = isHome
        ? colors[getRandomInt(colors.length)]
        : "gray.100";

    const currentFontSize = isHome ? "6rem" : "2rem";

    const currentPy = isHome ? "2.5rem" : "1.5rem";

    return (
        <Button
            variant={"no_style"}
            fontSize={currentFontSize}
            fontWeight={"900"}
            backgroundColor={currentColor}
            px="2rem"
            w={isHome ? "100%" : "auto"}
            height="100%"
            py={currentPy}
            onClick={navigateHome}
        >
            .redtetris
        </Button>
    );
}

export default Header;
