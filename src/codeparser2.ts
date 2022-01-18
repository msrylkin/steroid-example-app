import { Project, SyntaxKind } from 'ts-morph';
import * as path from 'path';

const project = new Project({
    tsConfigFilePath: path.join(__dirname, "../tsconfig.json"),
});

const file = project.getSourceFileOrThrow('/Users/maxmax/steroid/src/express.ts')

// const node = file.getFirstChildOrThrow()

// const childs = file.getChildren();
// const descendants = file.getDescendants();

// console.log(childs.length);
// console.log(descendants.length);
let count = 0;

file.forEachDescendant((node, traversal) => {
    const { line, column } = file.getLineAndColumnAtPos(node.getStart())
    // console.log(node.getKindName(), line, column);

    if (line === 72 && column === 5) {
        count++;

        if (node.getKind() === SyntaxKind.ExpressionStatement) {
            const myNode = node.asKindOrThrow(SyntaxKind.ExpressionStatement);
            const { line, column } = file.getLineAndColumnAtPos(node.getEnd())
            console.log(line, column);
            // myNode.
            // myNode.
        }
        // const myNode = node.asKindOrThrow(SyntaxKind.ExpressionStatement);
        // console.log(myNode);

        // myNode.
    }

    // console.log(node.getType());
});

console.log(count)

// console.log(node.getStartLineNumber(), node.getEndLineNumber())
// console.log(node)