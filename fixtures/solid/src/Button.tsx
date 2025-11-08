import type { JSX } from "solid-js";

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
}

export function Button(props: ButtonProps) {
    const variant = () => props.variant ?? "primary";

    return (
        <button
            {...props}
            style={{
                padding: "8px 16px",
                "border-radius": "4px",
                border: "none",
                "background-color": variant() === "primary" ? "#007bff" : "#6c757d",
                color: "white",
                cursor: "pointer",
                ...props.style,
            }}
        />
    );
}
