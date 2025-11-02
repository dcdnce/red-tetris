export const tagTheme = {
    baseStyle: {
        container: {
            borderRadius: "5px",
        },
    },
    variants: {
        logo: {
            container: {
                minW: "400px",
                minH: "150px",
                bg: "red.500",
                color: "red.600",
                fontSize: "2rem",
                padding: "1rem",
                borderRadius: "5px",
                boxShadow: "1px 2px 4px rgba(0, 0, 0, 0.1)",
                alignItems: "flex-start",
                justifyContent: "flex-start",
            },
        },
        blueW100: {
            container: {
                minW: "100%",
                bg: "brand.500",
                justifyContent: "center",
                color: "white",
                padding: "1rem",
                borderRadius: "5px",
                boxShadow: "1px 2px 4px rgba(0, 0, 0, 0.1)",
            },
        },
    },
};
