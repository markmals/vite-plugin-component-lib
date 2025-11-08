import { Button } from "./Button";

export function App() {
    return (
        <div style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
            <h1>Preact Component Library</h1>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
            </div>
        </div>
    );
}
