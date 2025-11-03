import React from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Heading, Text, Tag } from "@chakra-ui/react";

function Header() {
    return (
        <Link to="/" width="100%">
            <Tag as="header" align={"center"} variant="logo">
                <Flex alignItems="center" gap={2}>
                    <Box
                        width="40px"
                        height={"40px"}
                        bg="red.600"
                        borderRadius="5px"
                    />
                    Tetris
                </Flex>
            </Tag>
        </Link>
    );
}

export default Header;
