import printLine from "../printLine";

test('Test', () => {
    const result = printLine('hi my name is omar', 3, 2);
    expect(result).toBe(" 3 | hi my name is omar");
});