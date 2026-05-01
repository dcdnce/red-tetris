// Le point d'entrée JS qui monte l'application React et connecte Redux.
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store";
import App from "./App";
import theme from "./styles/chakra/theme";

const rootElement = document.getElementById("root");

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        // <React.StrictMode>
            <ChakraProvider theme={theme}>
                <BrowserRouter>
                    <Provider store={store}>
                        <App />
                    </Provider>
                </BrowserRouter>
            </ChakraProvider>
        // </React.StrictMode>
    );
} else {
    console.error("Failed to find root element");
}
