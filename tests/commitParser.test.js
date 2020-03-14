const commitParser = require("../src/commitParser");

const correctSubject = "feat: test";
const correctMultiLineBody = "test body\n" +
                            "with multiple lines\n";
const correctIssue = "Issue: #343";
const correctSignedOff = "Signed Off By: test@test.com";

describe('Test creation of commit message object', () => {
    test("it should successfully create commit object", () => {
        const commitString = correctSubject +
                            "\n" +
                            correctMultiLineBody +
                            "\n" +
                            correctIssue + 
                            "\n" +
                            correctSignedOff;

        const payload = { 
            commits: [{
                message: commitString
            }]
        };
        
        const commit = commitParser.parseCommits(payload);
        
        expect(commit.length).toEqual(1);
        expect(commit[0].subject).toEqual(correctSubject.replace("\n", ""));
        expect(commit[0].body).toEqual(correctMultiLineBody.split("\n").slice(0,2));
        expect(commit[0].issue).toEqual(correctIssue.replace("\n",""));
        expect(commit[0].signOff).toEqual(correctSignedOff.replace("\n", ""));
    });
})