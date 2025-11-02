import { useEffect, useState } from "react";
import { socket } from "../../socket.js";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Input,
    Button,
    SimpleGrid,
    VStack,
    HStack,
    Text,
    Divider,
} from "@chakra-ui/react";

export default function AllRoom() {
    const [allRoom, setAllRoom] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    useEffect(() => {
        socket.emit("get_all_room", (response) => {
            if (response.success) {
                setAllRoom(response.rooms);
            }
        });
        setRefresh(false);
    }, [refresh]);

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            socket.emit("get_room_by_search", { searchValue }, (response) => {
                if (response.success) {
                    setAllRoom(response.rooms);
                } else {
                    console.error("Search error:", response.error);
                }
            });
        }, 300);

        return () => clearTimeout(delayedSearch);
    }, [searchValue]);

    const join = (room) => {
        navigate(`/${room.roomName}/${username}`);
    };

    return (
        <VStack spacing={4} width="100%">
            <HStack spacing={2} width="100%">
                <Input
                    placeholder="Search a room"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    bg="white"
                    color="black"
                />
                <Button
                    onClick={() => setRefresh(true)}
                    bg="brand.500"
                    color="white"
                    _hover={{ bg: "brand.600" }}
                >
                    ↻
                </Button>
            </HStack>

            {allRoom.length ? (
                <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 3 }}
                    spacing={4}
                    width="100%"
                >
                    {allRoom.map((room, index) => (
                        <Box
                            key={index}
                            bg="brand.500"
                            color="white"
                            padding="1rem"
                            borderRadius="5px"
                            boxShadow="1px 2px 4px rgba(0, 0, 0, 0.1)"
                        >
                            <VStack spacing={3} align="stretch">
                                <Text fontSize="1.2rem" fontWeight="bold">
                                    {room.roomName}
                                </Text>
                                <Divider borderColor="rgba(255,255,255,0.3)" />
                                <HStack justify="space-between">
                                    <Text>{`${room.playerCount} Players`}</Text>
                                    <Button
                                        bg="blue.500"
                                        color="white"
                                        size="sm"
                                        _hover={{ bg: "blue.600" }}
                                        onClick={() => join(room)}
                                    >
                                        JOIN
                                    </Button>
                                </HStack>
                            </VStack>
                        </Box>
                    ))}
                </SimpleGrid>
            ) : (
                <Text textAlign="center" fontSize="1.1rem">
                    No room available
                </Text>
            )}
        </VStack>
    );
}
