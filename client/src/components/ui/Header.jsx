import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Header({ dynamicColor }) {
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

    const currentColor = dynamicColor
        ? colors[getRandomInt(colors.length)]
        : "gray.100";

    return (
        <Button
            variant={"no_style"}
            fontSize={"4rem"}
            fontWeight={"900"}
            backgroundColor={currentColor}
            px="2rem"
            py="3rem"
            onClick={navigateHome}
        >
            red tetris
        </Button>
    );
}

export default Header;
