// Ambient declarations so the TypeScript language server accepts canvas files
// without requiring installed React packages. The canvas server bundles React
// and provides the JSX runtime internally.

declare module 'react/jsx-runtime' {
  export const jsx:      (...args: any[]) => any;
  export const jsxs:     (...args: any[]) => any;
  export const Fragment: any;
}

declare module 'react' {
  const React: any;
  export = React;
  export as namespace React;
}
