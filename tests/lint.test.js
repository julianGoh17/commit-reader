const linter = require("../src/linter");
const uuid = require("uuid");

const commit = {
    subject: "feat: You shall not pass",
    body: ["Not long"],
    issue: "Contributes to: Issue#2",
    signOff: "Signed-off-by: John Cena <canNotSee@me.com>"
}

const minimalCommit = {
    subject: "You shall not pa55",
    body: ["Not long"],
    issue: "Any 1ssue",
    signOff: "Any 5ubj3ct"
}

const strictOptions = {
    subjectMaxChars: "50",
    subjectRegex: "(feat|docs|test):([a-z]|[A-Z]| |[0-9])*",
    bodyLineMaxChars: "50",
    issueRegex: "(Resolves|Closes|Contributes to|): ([a-z]|[A-Z]| |[0-9])*#([a-z]|[A-Z]| |[0-9])*",
    signOffRegex: "(Signed-off-by): ([a-z]|[A-Z]| |[0-9])* <([a-z]|[A-Z]| |[0-9])*@([a-z]|[A-Z]| |[0-9]|.)*>"
};

const nonStrictOptions = {
    subjectMaxChars: "50",
    subjectRegex: "[\s\S]*",
    bodyLineMaxChars: "75",
    issueRegex: "[\s\S]*",
    signOffRegex: "[\s\S]*"
};

describe("Test linting of perfectly valid commits depending on configurations", () => {
    test("it should return object with empty arrays to signify no problems for strict check", () => {
        const violations = linter.lint(commit, strictOptions);
        expect(violations.subject).toHaveLength(0);
        expect(violations.body).toHaveLength(0);
        expect(violations.issue).toHaveLength(0);
        expect(violations.signOff).toHaveLength(0);
    });

    test("it should return object with empty arrays to signify no problems for check without subject line regex", () => {
        const anyRegexCommit = createDeepClone(commit);
        anyRegexCommit.subject = "You SHALL Pa55";
        
        const anySubjectOptions = createDeepClone(strictOptions);
        anySubjectOptions.subjectRegex = "[\s\S]*";

        const violations = linter.lint(anyRegexCommit, anySubjectOptions);
        expect(violations.subject).toHaveLength(0);
        expect(violations.body).toHaveLength(0);
        expect(violations.issue).toHaveLength(0);
        expect(violations.signOff).toHaveLength(0);
    });


    test("it should return object with empty arrays to signify no problems for check with any issue line regex", () => {
        const anyRegexCommit = createDeepClone(commit);
        anyRegexCommit.issue = "You SHALL Pa55";
        
        const anyIssueOptions = createDeepClone(strictOptions);
        anyIssueOptions.issueRegex = "[\s\S]*";

        const violations = linter.lint(anyRegexCommit, anyIssueOptions);
        expect(violations.subject).toHaveLength(0);
        expect(violations.body).toHaveLength(0);
        expect(violations.issue).toHaveLength(0);
        expect(violations.signOff).toHaveLength(0);
    });

    test("it should return object with empty arrays to signify no problems for check with any subject line regex", () => {
        const anyRegexCommit = createDeepClone(commit);
        anyRegexCommit.subject = "You SHALL Pa55";
        
        const anyIssueOptions = createDeepClone(strictOptions);
        anyIssueOptions.subject = "[\s\S]*";

        const violations = linter.lint(commit, anyIssueOptions);
        expect(violations.subject).toHaveLength(0);
        expect(violations.body).toHaveLength(0);
        expect(violations.issue).toHaveLength(0);
        expect(violations.signOff).toHaveLength(0);
    });

    test("it should return object with empty arrays to signify no problems for least strict check", () => {
        const violations = linter.lint(minimalCommit, nonStrictOptions);
        expect(violations.subject).toHaveLength(0);
        expect(violations.body).toHaveLength(0);
        expect(violations.issue).toHaveLength(0);
        expect(violations.signOff).toHaveLength(0);
    });
});

describe("Test linting of invalid subject line commits", () => {
    test("it should return object with subject violations for not matching the required regex", () => {
        const violations = linter.lint(minimalCommit, strictOptions);
        expect(violations.subject).toHaveLength(1);
        expect(violations.subject[0]).toEqual("Commit subject line '" + minimalCommit.subject + "' does not match regex: " + strictOptions.subjectRegex);
    });

    test("it should return object with subject violations for subject line being greater than max chars", () => {
        const superLongSubject = createDeepClone(commit);
        superLongSubject.subject = "feat: " + uuid.v4() + uuid.v4();
        
        const violations = linter.lint(superLongSubject, strictOptions);
        expect(violations.subject).toHaveLength(1);
        expect(violations.subject[0]).toEqual("Commit subject line exceeds max char length of: " + parseInt(50));
    });

    test("it should return object with multiple subject violations", () => {
        const superLongSubject = createDeepClone(commit);
        superLongSubject.subject = uuid.v4() + uuid.v4();

        const violations = linter.lint(superLongSubject, strictOptions);
        expect(violations.subject).toHaveLength(2);
        expect(violations.subject[0]).toEqual("Commit subject line '" + superLongSubject.subject + "' does not match regex: " + strictOptions.subjectRegex);
        expect(violations.subject[1]).toEqual("Commit subject line exceeds max char length of: " + parseInt(50));
    });
});

describe("Test linting of invalid body commits", () => {
    test("it should return object with body violations for body line being greater than max chars", () => {
        const superLongBody = createDeepClone(commit);
        superLongBody.body = [uuid.v4() + uuid.v4()];
        
        const violations = linter.lint(superLongBody, strictOptions);
        expect(violations.body).toHaveLength(1);
        expect(violations.body[0]).toEqual("Commit body contains line that exceeds max char length of: " + parseInt(strictOptions.bodyLineMaxChars));
    });
});

describe("Test linting of invalid issue commits", () => {
    test("it should return object with issue violations for not having issue reference", () => {
        const invalidIssueRegex = createDeepClone(commit);
        invalidIssueRegex.issue = uuid.v4() + uuid.v4();

        const violations = linter.lint(invalidIssueRegex, strictOptions);
        expect(violations.issue).toHaveLength(1);
        expect(violations.issue[0]).toEqual("Commit issue line does not match regex: " + strictOptions.issueRegex);    
    });
});

describe("Test linting of invalid signOff commits", () => {
    test("it should return object with sign off violations for not having sign off reference", () => {
        const invalidSignOffRegex = createDeepClone(commit);
        invalidSignOffRegex.signOff = uuid.v4() + uuid.v4();

        const violations = linter.lint(invalidSignOffRegex, strictOptions);
        expect(violations.signOff).toHaveLength(1);
        expect(violations.signOff[0]).toEqual("Commit sign off line does not match regex: " + strictOptions.signOffRegex);    
    });
});

describe("Test multiple types of violations for a single commit", () => {
    test("it should return object with sign off violation and issue line violation", () => {
        const regexViolationCommit = createDeepClone(commit);
        regexViolationCommit.issue = uuid.v4() + uuid.v4();
        regexViolationCommit.signOff = uuid.v4() + uuid.v4();

        const violations = linter.lint(regexViolationCommit, strictOptions);
        expect(violations.issue).toHaveLength(1);
        expect(violations.issue[0]).toEqual("Commit issue line does not match regex: " + strictOptions.issueRegex);    
        expect(violations.signOff).toHaveLength(1);
        expect(violations.signOff[0]).toEqual("Commit sign off line does not match regex: " + strictOptions.signOffRegex);
    });
});

function createDeepClone(src) {
    return Object.assign({}, src);
}