# ImPaaS deploy action

This action will deploy a publicly available published image to the ImPaaS Tsuru instance.

## Inputs

### `app-name`

**Required** The name of the app to be deployed to **on the tsuru instance**. Should be associated to the relevant team. Can be provided via a GitHub Variable or Secret.

### `deployment-token`

**Required** The deployment token for the team who owns the app.
- This can be created via:
    `$ tsuru token create --id {TOKEN_NAME} --team {TEAM_NAME} --description "CI token"`
We recommend providing this via a GitHub Secret

### `method`

**Required** This should be one of:
  - `DOCKER_IMAGE`: This will publish the image tagged `latest` pushed to the associated GHCR registry for this pipeline. **Must be publicly available** 
  - `PLATFORM`: Deploy the repo using `Tsuru platforms`. See [here](https://github.com/tsuru/platforms) for more information
  - `DOCKER_BUILD`: This will use the `Dockerfile` in root directory to build a docker image and publish. Note that the default port used by Tsuru is `8888`, when deploying an app publicly, use `0.0.0.0:8888`

## Example usage

`DOCKER IMAGE`
```yaml
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    # REQUIRED TO BUILD DOCKER IMAGE THAT IS ULTIMATELY DEPLOYED
    # START
    - name: Set up QEMU
      uses: docker/setup-qemu-action@v3

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Login to GitHub Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ghcr.io/${{ github.repository_owner }}/${{ github.repository }}:latest 
    # END

    - name: ImPaaS-Deploy
      id: impaas-deploy
      uses: /impaas/impaas-deploy@v3
      with:
        app-name: APP_NAME_GOES_HERE
        deployment-token: TOKEN_GOES_HERE
        method: DOCKER_IMAGE
```

`PLATFORM`
```yaml
    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: ImPaaS-Deploy
      id: impaas-deploy
      uses: /impaas/impaas-deploy@v3
      with:
        app-name: APP_NAME_GOES_HERE
        deployment-token: TOKEN_GOES_HERE
        method: PLATFORM
```

`DOCKER_BUILD`
```yaml
   steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: ImPaaS-Deploy
      id: impaas-deploy
      uses: /impaas/impaas-deploy@v3
      with:
        app-name: ${{ secrets.APP_NAME }}
        deployment-token: ${{ secrets.TEAM_DEPLOYMENT_TOKEN }}
        method: DOCKER_BUILD
```

## Development

All code is in `index.cjs`. After modifying, compile using `vercel ncc`:
`ncc build index.cjs --license licenses.txt`
