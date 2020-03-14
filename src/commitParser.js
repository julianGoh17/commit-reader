function parseCommit(string) {
    const messageParts = string.split("\n").filter(entry => entry.length > 0);
    return {
        subject: messageParts[0],
        body: messageParts.slice(1, messageParts.length - 2),
        issue: messageParts[messageParts.length - 2],
        signOff: messageParts[messageParts.length - 1]
    };
}

function parseCommits(payload) {
    var commits = [];
    payload.commits.forEach(commit => {
        commits.push(parseCommit(commit.message))
    });

    return commits;
}

module.exports = { parseCommits }