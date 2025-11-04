import { useEffect, useState } from "react";
import { socket } from "../../socket.js";
import { useNavigate } from "react-router-dom";
import {
    Tag,
    Input,
    Button,
    SimpleGrid,
    VStack,
    HStack,
    Text,
    Divider,
    Flex,
    Card,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { Peoples } from "../../styles/Icons/icons";

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
        <VStack spacing={4} width="100%" align="flex-start">
            <HStack spacing={2} width="28%">
                <Input
                    placeholder="Search a room"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button onClick={() => setRefresh(true)} variant="solid">
                    <RepeatIcon />
                </Button>
            </HStack>

            {allRoom.length ? (
                <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 3 }}
                    spacing={4}
                    width="60%"
                >
                    {allRoom.map((room, index) => (
                        <Card key={index} variant={"outline"}>
                            <Flex
                                justifyContent="space-between"
                                padding={"1rem"}
                            >
                                <Text fontSize="1.5rem" fontWeight="bold">
                                    {room.roomName}
                                </Text>
                                <Tag gap="2">
                                    {room.playerCount}
                                    <Peoples />
                                </Tag>
                            </Flex>
                            <Button onClick={() => join(room)} margin={"1rem"}>
                                JOIN
                            </Button>
                        </Card>
                    ))}
                </SimpleGrid>
            ) : (
                <Flex alignItems="center" justifyContent="center" height="100%">
                    <Text textAlign="center" fontSize="1.1rem">
                        No room available
                    </Text>
                </Flex>
            )}
        </VStack>
    );
}
