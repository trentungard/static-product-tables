import type { RenderExtensionTarget } from "@shopify/ui-extensions/admin";

// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)

export const config = {
    target: 'admin.product-details.action.render' as RenderExtensionTarget
}