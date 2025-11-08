import path from "node:path";

export function isBare(id: string): boolean {
    return (
        !id.startsWith(".") &&
        !path.isAbsolute(id) &&
        !/^[a-zA-Z]+:/.test(id) && // e.g. node:, deno:, bun:, data:, http:
        !id.startsWith("\0") &&
        !id.startsWith("virtual:")
    );
}

export function matches(id: string, pats?: (RegExp | string)[]): boolean {
    if (!pats?.length) return false;
    return pats.some(p => (typeof p === "string" ? id === p : p.test(id)));
}
