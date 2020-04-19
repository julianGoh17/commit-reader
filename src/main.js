const core = require('@actions/core');
const github = require('@actions/github');
const commitParser = require("./commitParser");
const linter = require("./linter");

function run() {    
    commits = commitParser.parseCommits(github.context.payload);
    const options = getOptions();
    commits.forEach(commit => {
        const violations = linter.lint(commit, options);
        const error = getError(violations);
        if (error.length > 0) {
            core.setFailed(error);
        }
    });
};

/**
 * Gets the configuration of what a commit object should look like based 
 * on what the user has specified.
 */
function getOptions() {
    return {
        subjectMaxChars: core.getInput("subject-line-max-chars"),
        subjectRegex: core.getInput("subject-line-regex"),
        bodyLineMaxChars: core.getInput("body-line-max-chars"),
        needsIssueReference: core.getInput("issue-reference"),
        needsSignOff: core.getInput("sign-off")
    }
}

function getError(violations) {
    var error = "";
    Object.keys(violations).forEach(key => {
        if (violations[key].length > 0) {
            error += key + " errors: " + violations[key] + "\n"; 
        } 
    });
    return error;
}

module.exports = { run };