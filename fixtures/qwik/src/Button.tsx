import { component$, type QwikIntrinsicElements, Slot } from "@builder.io/qwik";

type ButtonHTMLProps = QwikIntrinsicElements["button"];

export interface ButtonProps extends ButtonHTMLProps {
    variant?: "primary" | "secondary";
}

export const Button = component$<ButtonProps>(({ variant = "primary", ...props }) => {
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
        >
            <Slot />
        </button>
    );
});
