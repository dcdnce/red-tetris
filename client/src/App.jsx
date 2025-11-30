import Home from "./components/home/Home";
import "./styles/global.css";
import { Routes, Route } from "react-router-dom";
import { HStack, VStack, Box, Container } from "@chakra-ui/react";
import Play from "./components/play/Play";

function App() {
    return (
        <Box>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:roomName/:username" element={<Play />} />
            </Routes>
        </Box>
    );
}

export default App;
