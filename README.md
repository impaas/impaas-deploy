# ImPaaS deploy action

This action will deploy a publicly available published image to the ImPaaS Tsuru instance.

## Inputs

### `app-name`

**Required** The name of the app to be deployed to **on the tsuru instance**. Should be associated to the relevant team.

### `deployment-token`

**Required** The deployment token for the team who owns the app.
- This can be created via:
    `$ tsuru token create --id {TOKEN_NAME} --team {TEAM_NAME} --description "CI token"`

## Example usage

```yaml
uses: actions/hello-world-javascript-action@e76147da8e5c81eaf017dede5645551d4b94427b
with:
  app-name: 'my-app'
  deployment-token: 'my-team-deployment-token"
```
