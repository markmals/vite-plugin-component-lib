import type { JSX } from "preact";

export interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", ...props }: ButtonProps) {
    return (
        <button
            {...props}
            style={{
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: variant === "primary" ? "#007bff" : "#6c757d",
                color: "white",
                cursor: "pointer",
                ...props.style,
            }}
        />
    );
}
