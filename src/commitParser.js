const emptyCommit = {
    subject: "",
    body: [],
    issue: "",
    signOff: ""
}

function parseCommit(string) {
    var messageParts = string.split("\n");
    if (messageParts[messageParts.length -1].length === 0) messageParts.pop();
    emptyLineIndexes = getEmptyLineIndexes(messageParts);
    // console.log("Message Parts: " + messageParts);
    // console.log("Empty Line: " + emptyLineIndexes);
    if (messageParts.filter(entry => entry.length > 0).length === 0) return emptyCommit;
    return {
        subject: getSubject(messageParts, emptyLineIndexes),
        body: getBody(messageParts, emptyLineIndexes),
        issue: getIssue(messageParts, emptyLineIndexes),
        signOff: getSignOff(messageParts, emptyLineIndexes)
    };
}

function getEmptyLineIndexes(messageParts) {
    var emptyLineIndexes = [];
    for (var i = 0; i < messageParts.length; i++) {
        if (messageParts[i].length === 0) emptyLineIndexes.push(i);
    }

    return emptyLineIndexes
}

function getSubject(messageParts, emptyLineIndexes) {
    return messageParts.slice(0, emptyLineIndexes[0]).join(" ");
}

function getBody(messageParts, emptyLineIndexes) {
    if (emptyLineIndexes.length < 1) return []; 
    if (emptyLineIndexes.length === 1) return messageParts.slice(emptyLineIndexes[0] + 1, messageParts.length);
    if (emptyLineIndexes.length === 2) return messageParts.slice(emptyLineIndexes[0] + 1, emptyLineIndexes[emptyLineIndexes.length - 1]);
    return messageParts.slice(emptyLineIndexes[0] + 1, emptyLineIndexes[emptyLineIndexes.length - 2]);
}

function getIssue(messageParts, emptyLineIndexes) {
    if (emptyLineIndexes.length < 2) return "";
    if (emptyLineIndexes.length == 2) return messageParts.slice(emptyLineIndexes[emptyLineIndexes.length - 1] + 1, messageParts.length).join(" ");
    return messageParts.slice(emptyLineIndexes[emptyLineIndexes.length - 2] + 1, emptyLineIndexes[emptyLineIndexes.length - 1]).join(" ");
}

function getSignOff(messageParts, emptyLineIndexes) {
    if (emptyLineIndexes.length < 3) return "";
    if (emptyLineIndexes[emptyLineIndexes.length - 1] + 1 == messageParts.length - 1) return messageParts[messageParts.length - 1]; 
    return messageParts.slice(emptyLineIndexes[emptyLineIndexes.length - 1] + 1, messageParts.length - 1).join(" ");
}

function parseCommits(payload) {
    var commits = [];
    payload.commits.forEach(commit => {
        commits.push(parseCommit(commit.message))
    });

    return commits;
}

module.exports = { parseCommits }