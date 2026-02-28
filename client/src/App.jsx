import Home from "./components/home/Home";
import "./styles/global.css";
import { Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Play from "./components/play/Play";
import { Error } from "./components/ui/Error";

function App() {
    return (
        <Box>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:roomName/:username" element={<Play />} />
                 <Route path="*" element={
                        <Error
                            errorTitle="404"
                            errorMessage="Not found."
                        />
                    }
                />
            </Routes>
        </Box>
    );
}

export default App;
