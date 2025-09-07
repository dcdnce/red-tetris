import React, { useState, useRef, useEffect } from "react";
import AllRoom from "./AllRoom.jsx";
import JoinButton from "./JoinButton.jsx";

function Home() {
    return (
        <>
            <JoinButton />
            <AllRoom />
        </>
    );
}

export default Home;
