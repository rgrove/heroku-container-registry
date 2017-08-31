const cli = require('heroku-cli-util')

let usage = `
    ${cli.color.bold.underline.magenta('Usage:')}
    ${ cli.color.cmd('heroku container:rm web')}        # Destroys the web container
    ${ cli.color.cmd('heroku container:rm web worker')} # Destroys the web and worker containers`

module.exports = function (topic) {
  return {
    topic: topic,
    command: 'rm',
    description: 'destroys the named process type containers',
    needsApp: true,
    needsAuth: true,
    variableArgs: true,
    help: usage,
    flags: [],
    run: cli.command(rm)
  }
}

let rm = async function (context, heroku) {
  if (context.args.length === 0) {
    cli.error(`Error: Please specify at least one target process type\n ${usage} `)
    process.exit(1)
  }
  let container = context.args[0]

  for (let container of context.args) {
    let r = heroku.request({
      method: 'PATCH',
      path: `/apps/${context.app}/formation/${container}`,
      headers: {'Accept': `application/vnd.heroku+json; version=3.docker-releases`},
      body: { docker_image: null }
    })
    await cli.action(`Removing container ${container} for ${cli.color.app(context.app)}`, r)
  }
}
