import esbuild from "npm:esbuild";
import aLog from "https://deno.land/x/alog@0.1.2/mod.ts"

const log = new aLog("BUILD");

try {
	log.info("Building mod.js...");
  await esbuild.build({
    entryPoints: ["./src/mod.ts"],
    bundle: true,
    minify: true,
    outfile: "./mod.js",
  });
	log.success("Build complete!");
} catch (e) {
  log.error(e);
}
