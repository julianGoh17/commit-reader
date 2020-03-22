function lint(commitObject, options) {
    const violations = {
        subject: [],
        body: [],
        issue: [],
        signOff: []
    };

    lintSubject(commitObject, options, violations);
    lintBody(commitObject, options, violations);
    lintIssue(commitObject, options, violations);
    lintSignOff(commitObject, options, violations);

    return violations;
}

function lintSubject(commitObject, options, violations) {
    if (commitObject.subject.length > 0) {
        if (!commitObject.subject.match(options.subjectRegex)) {
            violations.subject.push("Commit subject line \'" + commitObject.subject + "\'' does match regex: " + options.subjectRegex);
        } 
        if (commitObject.subject.length > parseInt(options.subjectMaxChars)) {
            violations.subject.push("Commit subject line exceeds max char length of: " + parseInt(options.subjectMaxChars));
        } 
    } else {
        violations.subject.push("Commit subject line is missing");
    }
}

function lintBody(commitObject, options, violations) {
    if (commitObject.body.length > 0) {
        for (bodyLine in commitObject.body) {
            if (bodyLine.length > parseInt(options.bodyLineMaxChars)) {
                violations.body.push("Commit body contains line that exceeds max char length of: " + parseInt(bodyLine.bodyLineMaxChars));
                return;
            } 
        }
    } else {
        violations.body.push("Commit body line is missing");
    }
}

function lintIssue(commitObject, options, violations) {
    if (commitObject.issue.length > 0) {
        if (!commitObject.issue.match(options.issueRegex)) {
            violations.issue.push("Commit issue line is does not match regex: " + options.issueRegex);
        } 
    } else {
        violations.issue.push("Commit issue line is missing");
    }
}

function lintSignOff(commitObject, options, violations) {
    if (commitObject.signOff.length > 0) {
        if (!commitObject.signOff.match(options.signOff)) {
            violations.signOff.push("Commit sign off line is does not match regex: " + options.signOff);
        } 
    } else {
        violations.signOff.push("Commit sign off line is missing");
    }
}

// /**
//  * Gets the configuration of what a commit object should look like based 
//  * on what the user has specified.
//  */
// function getOptions() {
//     return {
//         subjectMaxChars: core.getInput("subject-line-max-chars"),
//         subjectRegex: core.getInput("subject-line-regex"),
//         bodyLineMaxChars: core.getInput("body-line-max-chars"),
//         needsIssueReference: core.getInput("issue-reference"),
//         needsSignOff: core.getInput("sign-off")
//     }
// }

module.exports = { lint };