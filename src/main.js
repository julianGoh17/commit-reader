const core = require('@actions/core');
const github = require('@actions/github');
const commitParser = require("../src/commitParser");

function run() {    
    commits = commitParser.parseCommits(github.context.payload);
    commits.forEach(commit => {
        console.log(commit);
    });
};

module.exports = { run };