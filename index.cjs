const axios = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');

async function deployToImPaaS(appName, deploymentToken) {
  try {
    const apiUrl = `http://impaas.uk/apps/${appName}/deploy`;
    const imageUrl = `ghcr.io/${github.context.repo.owner}/${github.context.repo.owner}/${github.context.repo.repo}:latest`;
    core.debug(`Deploying ${imageUrl} to ${apiUrl} with token ${deploymentToken}`);
    const response = await axios.post(apiUrl, { image: imageUrl }, {
      headers: {
        Authorization: `Bearer ${deploymentToken}`
      }
    });
    console.log('Deployment successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Deployment failed:', error.response.data, appName, deploymentToken);
    throw error;
  }
}

(async () => {
  try {
    const appName = core.getInput('app-name');
    const deploymentToken = core.getInput('deployment-token');
    // const appName = 'flask-demo-app';
    // const deploymentToken = 'f5a768e7a09100f8d28eec7ba42d15d745ff3acd8a222b731a3dcd2c07f044b2';

    await deployToImPaaS(appName, deploymentToken);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
