// Chakra color tokens extracted from client/src/styles/global.css
// Mapped to Chakra color names for easy usage

const rawColors = {
    cyan: "#a0d2db",
    orange: "#ffdac1",
    red: "#ffb6c1",
    blue: "#b4c5e4",
    green: "#c1e1c1",
    purple: "#c8a2c8",
    yellow: "#fffacd",
    charcoal: "#404e5c",
    redDark: "#850014",
    cyanDark: "#29616a",
    blueDark: "#2f4d83",
    white: "#ffffff",
    black: "#000000",
};

export const colors = {
    brand: {
        50: rawColors.cyan,
        500: rawColors.cyan,
        600: rawColors.cyanDark,
    },
    cyan: {
        50: rawColors.cyan,
        500: rawColors.cyan,
    },
    orange: {
        50: rawColors.orange,
        500: rawColors.orange,
    },
    red: {
        50: rawColors.red,
        500: rawColors.red,
        600: rawColors.redDark,
    },
    blue: {
        50: rawColors.blue,
        500: rawColors.blue,
        600: rawColors.blueDark,
    },
    green: {
        50: rawColors.green,
        500: rawColors.green,
    },
    purple: {
        50: rawColors.purple,
        500: rawColors.purple,
    },
    yellow: {
        50: rawColors.yellow,
        500: rawColors.yellow,
    },
    gray: {
        50: rawColors.white,
        500: rawColors.charcoal,
        900: rawColors.black,
    },
};

export default colors;
