import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("app-button")
export class AppButton extends LitElement {
    static styles = css`
        button {
            padding: 8px 16px;
            border-radius: 4px;
            border: none;
            color: white;
            cursor: pointer;
        }
        .primary {
            background-color: #007bff;
        }
        .secondary {
            background-color: #6c757d;
        }
    `;

    @property() variant: "primary" | "secondary" = "primary";

    render() {
        return html`
            <button class=${this.variant}>
                <slot></slot>
            </button>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "app-button": AppButton;
    }
}
