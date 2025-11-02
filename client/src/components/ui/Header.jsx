import React from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Heading, Badge, Text } from "@chakra-ui/react";

function Header() {
    return (
        <Link to="/" width="100%">
            <Badge as="header" align={"center"} variant="logo">
                <Flex alignItems="center" gap={2}>
                    <Box
                        width="40px"
                        height={"40px"}
                        bg="red.600"
                        borderRadius="5px"
                    />
                    <Heading as="h1" size="lg" margin={0} color="white">
                        <Text>Tetris</Text>
                    </Heading>
                </Flex>
            </Badge>
        </Link>
    );
}

export default Header;
