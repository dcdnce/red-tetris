// Chakra theme extension
import { extendTheme } from "@chakra-ui/react";
import colors from "./themes/colors";
import { components } from "./themes";
import { layerStyles } from "./layerStyles";

export const backgroundImage = new URL(
    "https://www.transparenttextures.com/patterns/60-lines.png"
);

const theme = extendTheme({
    colors,
    components,
    layerStyles,
    styles: {
        global: {
            "html, body": {
                fontFamily:
                    '"Bebas Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                lineHeight: "1.6",
                backgroundColor: "#78C0E0",
                backgroundImage: `url(${backgroundImage})`,
            },
        },
    },
});

export default theme;
