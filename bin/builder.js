
const { browserify, minify, buildTestHtmlPage } = require("frontend-build-tools");
const path = require("path");

(async () => {

    const module_dir_path = path.join(__dirname, "..");
    const dst_file_path = path.join(module_dir_path, "docs", "benchmark-bundled.js");

    await browserify(path.join(module_dir_path, "test", "benchmark.js"), dst_file_path);

    await buildTestHtmlPage(dst_file_path);

})();
