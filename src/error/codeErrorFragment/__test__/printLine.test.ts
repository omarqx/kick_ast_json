import printLine from "../printLine";

describe('CodeErrorFragments', () => {
    describe('printline()', () => {
        test('', () => {
            const result = printLine('hi my name is omar', 3, 2);
            expect(result).toBe(" 3 | hi my name is omar");
        })
    });
})


