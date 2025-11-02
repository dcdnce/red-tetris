// Chakra theme extension with custom component styles
import { extendTheme } from "@chakra-ui/react";
import colors from "./themes/colors";

const theme = extendTheme({
    colors,

    components: {
        Button: {
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
        },

        Input: {
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
        },

        Box: {
            baseStyle: {
                borderRadius: "5px",
            },
        },

        Card: {
            baseStyle: {
                padding: "1rem",
                borderRadius: "5px",
                boxShadow: "1px 2px 4px rgba(0, 0, 0, 0.1)",
                border: "none",
            },
        },

        Heading: {
            baseStyle: {
                fontWeight: "bold",
            },
        },

        Divider: {
            baseStyle: {
                borderColor: "#333",
                margin: "10px",
                borderWidth: "2px",
            },
        },
    },

    styles: {
        global: {
            "html, body": {
                fontFamily:
                    '"Bebas Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                lineHeight: "1.6",
            },
        },
    },
});

export default theme;
