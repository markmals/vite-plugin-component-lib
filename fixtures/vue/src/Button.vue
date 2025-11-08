<script setup lang="ts">
export interface ButtonProps {
    variant?: "primary" | "secondary";
}

withDefaults(defineProps<ButtonProps>(), {
    variant: "primary",
});
</script>

<template>
    <button
        :style="{
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: variant === 'primary' ? '#007bff' : '#6c757d',
            color: 'white',
            cursor: 'pointer',
        }"
    >
        <slot />
    </button>
</template>
