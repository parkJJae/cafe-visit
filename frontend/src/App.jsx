// src/App.jsx
import { useState } from "react";
import "./index.css";
import Home from "./pages/Home";
import MapView from "./pages/MapView";
import NewCafe from "./pages/NewCafe";

export default function App() {
    const [view, setView] = useState("home"); // home | map | new

    const renderView = () => {
        switch (view) {
            case "map":
                return <MapView onBack={() => setView("home")} />;
            case "new":
                return <NewCafe onBack={() => setView("home")} />;
            default:
                return (
                    <Home
                        onGotoMap={() => setView("map")}
                        onGotoNew={() => setView("new")}
                    />
                );
        }
    };

    return <div className="app-shell">{renderView()}</div>;
}
