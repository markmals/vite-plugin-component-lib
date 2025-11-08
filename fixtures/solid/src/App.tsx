import { Button } from "./Button";

export function App() {
    return (
        <div style={{ padding: "2rem", "font-family": "system-ui, sans-serif" }}>
            <h1>Solid Component Library</h1>
            <div style={{ display: "flex", gap: "1rem", "margin-top": "1rem" }}>
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
            </div>
        </div>
    );
}
