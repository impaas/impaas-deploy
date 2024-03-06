const axios = require('axios');
const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('child_process');

async function deployFromPublishedDockerImage(appName, deploymentToken) {
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
    throw error;µ
  }
}

async function deployFromPlatform(appName, deploymentToken) {
  const terminalCommands = `
    curl -fsSL "https://tsuru.io/get" | bash;
    tsuru target add impaas https://impaas.uk -s;
    TSURU_TOKEN=${deploymentToken} tsuru app deploy -a ${appName} .;
  `;

  exec(terminalCommands, (error, stdout, stderr) => {
    if (error) {
      core.setFailed(`Deployment failed with error: ${error.message}`);
      return;
    }
    console.info(`Deployment successful: ${stdout}`);
  });
}

async function buildAndPushDockerImage(appName, deploymentToken) {
  const terminalCommands = `
    curl -fsSL "https://tsuru.io/get" | bash;
    tsuru target add impaas https://impaas.uk -s;
    TSURU_TOKEN=${deploymentToken} tsuru app deploy -a ${appName} --dockerfile .;
  `;

  exec(terminalCommands, (error, stdout, stderr) => {
    if (error) {
      core.setFailed(`Docker image build and push failed with error: ${error.message}`);
      return;
    }
    core.info(`Docker image build and push successful: ${stdout}`);
  });
}
(async () => {
  try {
    const appName = core.getInput('app-name');
    const deploymentToken = core.getInput('deployment-token');
    const method = core.getInput('method');

    if (method === 'DOCKER_IMAGE') {
      await deployFromPublishedDockerImage(appName, deploymentToken);
    } else if (method === 'PLATFORM') {
      await deployFromPlatform(appName, deploymentToken);
    } else if (method === 'DOCKER_BUILD') {
      await buildAndPushDockerImage(appName, deploymentToken);
    }
    else {
      throw new Error(`Unknown method: ${method}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
