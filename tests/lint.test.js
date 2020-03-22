const linter = require("../src/linter");

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
    bodyLineMaxChars: "75",
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

    });

    test("it should return object with subject violations for subject line being greater than max chars", () => {

    });
});

describe("Test linting of invalid body commits", () => {
    test("it should return object with body violations for body line being greater than max chars", () => {
    
    });
});

describe("Test linting of invalid issue commits", () => {
    test("it should return object with issue violations for not having issue reference", () => {
    
    });
});

describe("Test linting of invalid signOff commits", () => {
    test("it should return object with sign off violations for not having sign off reference", () => {
    
    });
});

function createDeepClone(src) {
    return Object.assign({}, src);
}