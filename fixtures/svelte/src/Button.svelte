<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        variant?: "primary" | "secondary";
        children: Snippet;
    }

    let { variant = "primary", children }: Props = $props();
</script>

<button
    style:padding="8px 16px"
    style:border-radius="4px"
    style:border="none"
    style:background-color={variant === "primary" ? "#007bff" : "#6c757d"}
    style:color="white"
    style:cursor="pointer"
>
    {@render children?.()}
</button>
