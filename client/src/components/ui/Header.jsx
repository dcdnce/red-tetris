import { Tag } from "@chakra-ui/react";

function Header() {
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    const colors = [
        "#FF6B6B", // Rouge
        "#4ECDC4", // Turquoise
        "#45B7D1", // Bleu
        "#96CEB4", // Vert
        "#FECA57", // Jaune
        "#FF9FF3", // Rose
        "#54A0FF", // Bleu clair
        "#5F27CD", // Violet
        "#00D2D3", // Cyan
        "#FF9F43",
    ];

    return (
        <Tag
            fontSize={"4rem"}
            fontWeight={"900"}
            backgroundColor={`${colors[getRandomInt(colors.length)]}`}
        >
            red tetris
        </Tag>
    );
}

export default Header;
