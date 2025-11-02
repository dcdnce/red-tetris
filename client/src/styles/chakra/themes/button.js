export const buttonTheme = {
    baseStyle: {
        fontWeight: "bold",
        borderRadius: "5px",
        fontSize: "1.5rem",
        _focus: {
            boxShadow: "none",
        },
    },
    variants: {
        solid: {
            bg: "brand.500",
            color: "white",
            _hover: {
                bg: "brand.600",
                transform: "scale(0.95)",
                boxShadow: "2px 1px #333",
            },
        },
    },
    defaultProps: {
        variant: "solid",
    },
};
