import { build, emptyDir } from "@deno/dnt";
import denoJson from "../deno.json" with { type: "json" };

await emptyDir("./npm");

await build({
  entryPoints: ["./src/index.ts"],
  outDir: "./npm",
  compilerOptions: {
    lib: ["esnext", "dom"],
  },
  scriptModule: false,
  shims: {
    deno: true,
  },
  package: {
    // package.json properties
    name: denoJson.name,
    version: denoJson.version,
    description: denoJson.description,
    license: denoJson.license,
    repository: {
      type: "git",
      url: "git+https://github.com/awesome-myst/myst-zod.git",
    },
    bugs: {
      url: "https://github.com/awesome-myst/myst-zod/issues",
    },
    dependencies: {
      "credit-roles": "^2.1.0",
      "doi-utils": "^2.0.5",
      "orcid": "^1.0.0",
      "simple-validators": "^1.1.0",
      "spdx-correct": "^3.2.0",
      "zod": "^3.24.2",
    },
    devDependencies: {
      "@types/js-yaml": "^4.0.9",
      "@types/spdx-correct": "^3.1.3",
      "glob": "^11.0.2",
      "js-yaml": "^4.1.0",
    }
  },
  postBuild() {
    Deno.copyFileSync("LICENSE.txt", "npm/LICENSE.txt");
    Deno.copyFileSync("README.md", "npm/README.md");
    Deno.mkdirSync("npm/esm/test", { recursive: true });
    Deno.copyFileSync("test/myst.tests.json", "npm/esm/test/myst.tests.json");
    Deno.copyFileSync("test/typography.json", "npm/esm/test/typography.json");
  },
});
