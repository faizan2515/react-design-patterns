/**
 * `?highlight` imports resolve to pre-rendered HTML produced by `vite/highlight.ts`.
 *
 * The glob-based reads in the registry type themselves through `import.meta.glob<string>`,
 * but a direct import needs this declaration.
 */
declare module "*.snippet.ts?highlight&lang=tsx" {
  const html: string;
  export default html;
}

declare module "*?highlight&lang=tsx" {
  const html: string;
  export default html;
}

declare module "*?highlight" {
  const html: string;
  export default html;
}
