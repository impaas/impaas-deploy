const axios = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');

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

try {
  const appName = core.getInput('app-name');
  const deploymentToken = core.getInput('deployment-token');

  await deployToImPaaS(appName, deploymentToken);
} catch (error) {
  core.setFailed(error.message);
}
