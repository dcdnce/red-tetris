// Chakra theme extension
import { extendTheme } from "@chakra-ui/react";
import colors from "./themes/colors";
import { components } from "./themes";

const theme = extendTheme({
    colors,
    components,
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
