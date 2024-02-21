/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 838:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 766:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 952:
/***/ ((module) => {

module.exports = eval("require")("axios");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const axios = __nccwpck_require__(952);
const core = __nccwpck_require__(838);
const github = __nccwpck_require__(766);

async function deployToImPaaS(appName, deploymentToken) {
  try {
    const apiUrl = `http://impaas.uk/apps/${appName}/deploy`;
    const imageUrl = `ghcr.io/${github.context.repo.owner}/${github.context.repo.repo}:latest`;
    
    const response = await axios.post(apiUrl, { image: imageUrl }, {
      headers: {
        Authorization: `Bearer ${deploymentToken}`
      }
    });
    console.log('Deployment successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Deployment failed:', error.response.data);
    throw error;
  }
}

(async () => {
  try {
    const appName = core.getInput('app-name');
    const deploymentToken = core.getInput('deployment-token');

    await deployToImPaaS(appName, deploymentToken);
  } catch (error) {
    core.setFailed(error.message);
  }
})();

})();

module.exports = __webpack_exports__;
/******/ })()
;