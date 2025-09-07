// client/src/App.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../src/store/store"; // Assurez-vous que le chemin est correct
import App from "../src/App";

test("renders main heading", () => {
    // Render le composant App enveloppé dans le Provider Redux
    render(
        <Provider store={store}>
            <App />
        </Provider>
    );

    // Recherche un élément de titre (h1, h2, etc.) contenant le texte "Red Tetris"
    const headingElement = screen.getByRole("heading", {
        name: /Red Tetris/i,
    });

    // Vérifie que l'élément a été trouvé dans le document
    expect(headingElement).toBeInTheDocument();
});
