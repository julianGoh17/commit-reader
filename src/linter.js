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
    if (!commitObject.subject.match(options.subjectRegex)) {
        violations.subject.push("Commit subject line '" + commitObject.subject + "' does not match regex: " + options.subjectRegex);
    } 
    if (commitObject.subject.length > parseInt(options.subjectMaxChars)) {
        violations.subject.push("Commit subject line exceeds max char length of: " + parseInt(options.subjectMaxChars));
    } 
}

function lintBody(commitObject, options, violations) {
    commitObject.body.forEach(bodyLine => {
        if (bodyLine.length > parseInt(options.bodyLineMaxChars)) {
            violations.body.push("Commit body contains line that exceeds max char length of: " + parseInt(options.bodyLineMaxChars));
            return;
        } 
    });
}

function lintIssue(commitObject, options, violations) {
    if (!commitObject.issue.match(options.issueRegex)) {
        violations.issue.push("Commit issue line does not match regex: " + options.issueRegex);
    } 
}

function lintSignOff(commitObject, options, violations) {
    if (!commitObject.signOff.match(options.signOffRegex)) {
        violations.signOff.push("Commit sign off line does not match regex: " + options.signOffRegex);
    }
}

module.exports = { lint };