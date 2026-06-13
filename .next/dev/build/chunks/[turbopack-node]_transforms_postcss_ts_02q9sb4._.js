module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/final-project1/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "chunks/0.x9__pnpm_0f4_lhx._.js",
  "chunks/[root-of-the-server]__0.0c41x._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/final-project1/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];