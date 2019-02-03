"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const { createMacro, MacroError } = require('babel-plugin-macros');
function replaceNodes(getReplacement) {
    return ({ references, babel }) => {
        references.default
            .map((referencePath) => {
            if (referencePath.parentPath.type === 'CallExpression') {
                return [referencePath, referencePath.parentPath.arguments[0]];
            }
            throw new MacroError(`Can\'t be used with such statement. You tried ${referencePath.parentPath.type}.`);
        })
            .forEach(([referencePath, node]) => {
            referencePath.replaceWith(getReplacement({ babel }, node));
        });
    };
}
const createRouteMacro = () => {
    function objectExpHasKey(node, key) {
        return node.properties
            .some((p) => p.type === 'ObjectProperty' && getPropKey(p) === key);
    }
    function getPropKey(node) {
        switch (node.key.type) {
            case 'Identifier':
                return node.key.name;
            case 'StringLiteral':
                return node.key.value;
            default:
                return null;
        }
    }
    function handleRouteSchema({ babel }, node) {
        assert(node.type === 'ObjectExpression');
        console.log('babel: ', babel);
        if (objectExpHasKey(node, 'path')) {
            // node.properties.push(babel)
        }
        else if (objectExpHasKey(node, 'pathMatcher')) {
        }
        else {
        }
        return node;
    }
    return replaceNodes(handleRouteSchema);
};
exports.default = createMacro(createRouteMacro());
