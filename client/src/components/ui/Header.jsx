import React from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Heading } from "@chakra-ui/react";

function Header() {
    return (
        <Box
            as="header"
            bg="red.500"
            color="red.500"
            padding="1rem"
            borderRadius="5px"
            boxShadow="1px 2px 4px rgba(0, 0, 0, 0.1)"
        >
            <Link to="/">
                <Flex alignItems="center" gap={2}>
                    <Box width="40px" height="40px" bg="red.500" borderRadius="5px" />
                    <Heading as="h1" size="lg" margin={0}>
                        Tetris
                    </Heading>
                </Flex>
            </Link>
        </Box>
    );
}

export default Header;
