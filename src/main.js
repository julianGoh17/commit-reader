const core = require('@actions/core')
const github = require('@actions/github')

function run() {
    const githubToken = core.getInput("github-token")
    
    const githubClient = new github.GitHub(githubToken);

    console.log("PAYLOAD:" + JSON.stringify(github.context.payload, undefined, 2));
    console.log("CONTEXT: " + github.context);
};

module.exports = run;