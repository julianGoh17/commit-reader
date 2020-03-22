const commitParser = require("../src/commitParser");

const subject = "feat: test\n";
const multiLineBody = "test body\n" +
                        "with multiple lines\n";

const singleLineBody = "test body in a single line\n";

const issue = "Issue: #343\n";
const signOff = "Signed Off By: test@test.com\n";
const signOffNoNewLine = "Signed Off By: test@test.com";

const correctSubject = subject.replace("\n", "");
const correctMultiLineBody = multiLineBody.split("\n").slice(0, 2);
const correctSingleLineBody = singleLineBody.split("\n").slice(0, 1);
const correctIssue = issue.replace("\n", "");
const correctSignOff = signOff.replace("\n", "");
 

describe('Test creation of commit message object', () => {
    test("it should create a commit message object with full fields with multi line body", () => {
        const commitString = subject +
                            "\n" +
                            multiLineBody +
                            "\n" +
                            issue + 
                            "\n" +
                            signOff;

        const commits = createCommits(commitString);

        expect(commits).toHaveLength(1);
        expect(commits[0].subject).toEqual(correctSubject);
        expect(commits[0].body).toEqual(correctMultiLineBody);
        expect(commits[0].issue).toEqual(correctIssue);
        expect(commits[0].signOff).toEqual(correctSignOff);
    });

    test("it should create a commit message object with full fields with single line body", () => {
        const commitString = subject +
                            "\n" +
                            singleLineBody +
                            "\n" +
                            issue + 
                            "\n" +
                            signOff;

        const commits = createCommits(commitString);

        expect(commits).toHaveLength(1);
        expect(commits[0].subject).toEqual(correctSubject);
        expect(commits[0].body).toEqual(correctSingleLineBody);
        expect(commits[0].issue).toEqual(correctIssue);
        expect(commits[0].signOff).toEqual(correctSignOff);
    });

    test("it should create a commit message object with full fields without line break at end of commit", () => {
        const commitString = subject +
                            "\n" +
                            singleLineBody +
                            "\n" +
                            issue + 
                            "\n" +
                            signOffNoNewLine;

        const commits = createCommits(commitString);

        expect(commits).toHaveLength(1);
        expect(commits[0].subject).toEqual(correctSubject);
        expect(commits[0].body).toEqual(correctSingleLineBody);
        expect(commits[0].issue).toEqual(correctIssue);
        expect(commits[0].signOff).toEqual(signOffNoNewLine);
    });

    test("it should create commit object with correct fields when given multi paragraph body", () => {
        const commitString = subject +
                            "\n" +
                            multiLineBody + 
                            "\n" + 
                            singleLineBody + 
                            "\n" +
                            issue + 
                            "\n" + 
                            signOff;
        
        const commits = createCommits(commitString);
        
        var multipleParagraphCommit = [];
        multipleParagraphCommit.push(...correctMultiLineBody);
        multipleParagraphCommit.push("");
        multipleParagraphCommit.push(...correctSingleLineBody);

        expect(commits).toHaveLength(1);
        expect(commits[0].subject).toEqual(correctSubject);
        expect(commits[0].body).toEqual(multipleParagraphCommit);
        expect(commits[0].issue).toEqual(correctIssue);
        expect(commits[0].signOff).toEqual(correctSignOff);
    });

    test("Create an array of commit messages with full fields", () => {
        const commitString = subject +
                            "\n" +
                            multiLineBody +
                            "\n" +
                            issue + 
                            "\n" +
                            signOff;

        const commits = createCommits(commitString, commitString);
        expect(commits).toHaveLength(2);

        expect(commits[0].subject).toEqual(correctSubject);
        expect(commits[0].body).toEqual(correctMultiLineBody);
        expect(commits[0].issue).toEqual(correctIssue);
        expect(commits[0].signOff).toEqual(correctSignOff);

        expect(commits[1].subject).toEqual(correctSubject);
        expect(commits[1].body).toEqual(correctMultiLineBody);
        expect(commits[1].issue).toEqual(correctIssue);
        expect(commits[1].signOff).toEqual(correctSignOff);
    });

    test("Create an array of commit messages with full fields with different entries", () => {
        const multiBodyCommitMessage = subject +
                                        "\n" +
                                        multiLineBody +
                                        "\n" +
                                        issue + 
                                        "\n" +
                                        signOff;

        const singleBodyCommitMessage = subject +
                                        "\n" +
                                        singleLineBody +
                                        "\n" +
                                        issue + 
                                        "\n" +
                                        signOff;

        const commits = createCommits(multiBodyCommitMessage, singleBodyCommitMessage);
        expect(commits).toHaveLength(2);

        expect(commits[0].subject).toEqual(correctSubject);
        expect(commits[0].body).toEqual(correctMultiLineBody);
        expect(commits[0].issue).toEqual(correctIssue);
        expect(commits[0].signOff).toEqual(correctSignOff);

        expect(commits[1].subject).toEqual(correctSubject);
        expect(commits[1].body).toEqual(correctSingleLineBody);
        expect(commits[1].issue).toEqual(correctIssue);
        expect(commits[1].signOff).toEqual(correctSignOff);

        expect(commits[0].body).not.toEqual(commits[1].body);
    });


    test("it should create empty commit object when empty commit message passed in", () => {
        const commitString = "";
        
        const commits = createCommits(commitString);
        
        expect(commits).toHaveLength(1)
        expect(commits[0].subject).toEqual("");
        expect(commits[0].body).toEqual([]);
        expect(commits[0].issue).toEqual("");
        expect(commits[0].signOff).toEqual("");
    });

    test("it should create commit object with missing sign off and issues fields", () => {
        const commitString = subject +
                            "\n" +
                            multiLineBody;

        const commits = createCommits(commitString);
        expect(commits).toHaveLength(1);
        expect(commits[0].subject).toEqual(correctSubject);
        expect(commits[0].body).toEqual(correctMultiLineBody);
        expect(commits[0].issue).toEqual("");
        expect(commits[0].signOff).toEqual("");
    });

    test("it should create commit object with missing issue field", () => {
        const commitString = subject +
                            "\n" +
                            multiLineBody + 
                            "\n" + 
                            signOff;

        const commits = createCommits(commitString);
        expect(commits).toHaveLength(1);
        expect(commits[0].subject).toEqual(correctSubject);
        expect(commits[0].body).toEqual(correctMultiLineBody);
        expect(commits[0].issue).toEqual(correctSignOff);
        expect(commits[0].signOff).toEqual("");
    });

    test("it should create commit object with missing body, issue, and signoff field", () => {
        const commitString = subject;
        const commits = createCommits(commitString);
        expect(commits).toHaveLength(1);
        expect(commits[0].subject).toEqual(correctSubject);
        expect(commits[0].body).toEqual([]);
        expect(commits[0].issue).toEqual("");
        expect(commits[0].signOff).toEqual("");
    });
})

function createCommits() {
    var commitStrings = arguments;
    const payload = {
        commits: []
    };

    for (var i = 0; i < commitStrings.length; i++) {
        payload.commits.push({
            message: commitStrings[i]
        });
    }

    return commitParser.parseCommits(payload);
}