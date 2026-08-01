export interface FileNode {
  path: string;
  /** True when a change to "add a coupon field to checkout" would touch this file. */
  touched: boolean;
}

/**
 * The same twelve files, organised two ways.
 *
 * Folder-by-type groups things by what they *are*; folder-by-feature groups them by what
 * they are *for*. Both hold the same code — the difference only shows up when you change
 * something, which is what the `touched` flags trace.
 */
export const BY_TYPE: FileNode[] = [
  { path: "components/CartLine.tsx", touched: false },
  { path: "components/CheckoutForm.tsx", touched: true },
  { path: "components/ProfileCard.tsx", touched: false },
  { path: "components/SearchBar.tsx", touched: false },
  { path: "hooks/useCart.ts", touched: false },
  { path: "hooks/useCheckout.ts", touched: true },
  { path: "hooks/useProfile.ts", touched: false },
  { path: "types/cart.ts", touched: false },
  { path: "types/checkout.ts", touched: true },
  { path: "types/profile.ts", touched: false },
  { path: "api/checkout.ts", touched: true },
  { path: "api/profile.ts", touched: false },
];

export const BY_FEATURE: FileNode[] = [
  { path: "features/cart/CartLine.tsx", touched: false },
  { path: "features/cart/useCart.ts", touched: false },
  { path: "features/cart/types.ts", touched: false },
  { path: "features/checkout/CheckoutForm.tsx", touched: true },
  { path: "features/checkout/useCheckout.ts", touched: true },
  { path: "features/checkout/types.ts", touched: true },
  { path: "features/checkout/api.ts", touched: true },
  { path: "features/profile/ProfileCard.tsx", touched: false },
  { path: "features/profile/useProfile.ts", touched: false },
  { path: "features/profile/types.ts", touched: false },
  { path: "features/profile/api.ts", touched: false },
  { path: "ui/SearchBar.tsx", touched: false },
];
