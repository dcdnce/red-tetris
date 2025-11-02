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
                bg: "brand.B500",
                opacity: "0.95",
            },
        },
        molle: {
            w: "100%",
            bg: "blue.600",
            color: "white",
            _hover: {
                opacity: "0.95",
            },
        },
    },
    defaultProps: {
        variant: "solid",
    },
};
