// import { defineConfig } from "steiger";
// import fsd from "@feature-sliced/steiger-plugin";

// export default defineConfig([
//   ...fsd.configs.recommended,
//   {
//     rules: {
//       "fsd/insignificant-slice": "off",
//       // "fsd/forbidden-imports": "off",
//       // "fsd/no-cross-imports": "error",
//       // "fsd/no-higher-level-imports": "error",
//     },
//   },
//   {
//     // Allow cross-imports between widgets, for example
//     files: ["src/widgets/**"],
//     rules: {
//       "fsd/no-cross-imports": "off",
//       "fsd/insignificant-slice": "off",
//     },
//   },
// ]);

import { defineConfig } from "steiger";
import fsd from "@feature-sliced/steiger-plugin";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    files: ["./src/**"],
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
  {
    files: ["./src/entities/**"],
    rules: {
      "fsd/forbidden-imports": "off",
    },
  },
]);
