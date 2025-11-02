export const inputTheme = {
    baseStyle: {
        fontSize: "1.5rem",
        borderRadius: "5px",
        height: "100%",
        width: "100%",
    },
    variants: {
        outline: {
            borderColor: "gray.300",
            _focus: {
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            },
        },
    },
    defaultProps: {
        variant: "outline",
    },
};
