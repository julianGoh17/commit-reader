const core = require('@actions/core');
const github = require('@actions/github');
const commitParser = require("../src/commitParser");

export function run() {    
    commits = commitParser.parseCommits(github.context.payload);
    commits.array.forEach(commit => {
        console.log(commit);
    });
};
