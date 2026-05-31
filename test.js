import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { execSync } from "child_process";

test("présence des fichiers et dossiers", () => {
  // Liste des chemins attendus dans le projet.
  const expectedPaths = [
    ".git",
    ".github/workflows/deploy.yml",
    ".gitignore",
    ".prettierrc.json",
    "eslint.config.ts",
    "index.html",
    "package.json",
    "README.md",
    "report.md",
    "src/App.vue",
    "src/main.ts",
    "test.js",
    "tsconfig.json",
    "vite.config.ts",
  ];
  // Vérifie que chaque chemin existe dans le projet.
  expectedPaths.forEach((path) => {
    assert.ok(
      fs.existsSync(path),
      `Le fichier ou dossier ${path} doit exister.`,
    );
  });
});

test("validation des fichiers", () => {
  // Exécute la validation en utilisant https://eslint.org/
  try {
    const output = execSync("npx eslint").toString();
    console.log(output);
  } catch (error) {
    assert.fail(error.output);
  }
});

test("construction du site", () => {
  try {
    const output = execSync("npm run build").toString();
    console.log(output);
  } catch (error) {
    assert.fail(error.output);
  }
});