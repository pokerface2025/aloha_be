import * as Bun from 'bun';
(
    async () => {
        const versionFile = await Bun.file("./src/version.ts").text();
        const versionMatch = versionFile.match(/const AppVersion = "(.*)"/);
        if (versionMatch) {

            const version = parseFloat(versionMatch[1]);
            const versionIncremented = version + 0.001;
            await Bun.write("./src/version.ts", `export const AppVersion = "${versionIncremented.toFixed(3)}"`);
            console.log("Building version:", versionIncremented.toFixed(3));
        } else {
            console.error("Version not found in version.ts");
            return;
        }

        const vercelProd = process.argv.includes("-prod");
        console.log("Production build:", vercelProd);

        if (vercelProd) {
            //run vercel command to deploy
            const result = Bun.spawnSync(["vercel", "--prod"], {
                stdio: ["inherit", "inherit", "inherit"],
            });

            if (result.exitCode !== 0) {
                console.error("Error during deployment");
            } else {
                console.log("Deployment completed successfully");
            }
        }

        const buildFile = process.argv.includes("-build")

        if (buildFile) {
            const result = await Bun.build({
                entrypoints: ["./src/index.ts"],
                outdir: "./dist",
                minify: true,
                external: ["bcrypt"],
                target: "node",
            })

            console.log("Build completed:", result);
        }
    }
)();