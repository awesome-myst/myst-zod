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
      "zod": "^3.24.2",
    }
  },
  postBuild() {
    Deno.copyFileSync("LICENSE.txt", "npm/LICENSE.txt");
    Deno.copyFileSync("README.md", "npm/README.md");
    Deno.mkdirSync("npm/esm/test", { recursive: true });
    Deno.copyFileSync("test/myst.tests.json", "npm/esm/test/myst.tests.json");
  },
});
