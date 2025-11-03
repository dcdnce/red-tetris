export const inputTheme = {
    baseStyle: {
        field: {
            fontSize: "1rem",
            borderRadius: "5px",
        },
    },
    variants: {
        outline: {
            field: {
                bg: "white",
                color: "black",
                borderColor: "gray.300",
                _focus: {
                    borderColor: "brand.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                },
            },
        },
    },
    defaultProps: {
        variant: "outline",
    },
};
