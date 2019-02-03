import {
  CallExpression,
  Node,
  ObjectExpression,
  ObjectProperty,
  ImportDeclaration,
  Identifier,
  StringLiteral,
} from 'babel-types'
import * as assert from 'assert'

const { createMacro, MacroError } = require('babel-plugin-macros')

type referencePathType = { parentPath: Node; replaceWith: (node: Node) => void }
type referencesType = { default: referencePathType[] }

function replaceNodes(getReplacement: (opts: object, node: Node) => Node) {
  return ({ references, babel }: { references: referencesType; babel: object }) => {
    references.default
      .map(referencePath => {
        if (referencePath.parentPath.type === 'CallExpression') {
          return [referencePath, (referencePath.parentPath as CallExpression).arguments[0] as ObjectExpression]
        }
        throw new MacroError(`Can\'t be used with such statement. You tried ${referencePath.parentPath.type}.`)
      })
      .forEach(([referencePath, node]: [referencePathType, ObjectExpression]) => {
        referencePath.replaceWith(getReplacement({ babel }, node))
      })
  }
}

const createRouteMacro = () => {
  function handleRouteSchema({ babel }: { babel: object }, node: ObjectExpression): Node {
    assert(node.type === 'ObjectExpression')

    return node
  }

  return replaceNodes(handleRouteSchema)
}

export default createMacro(createRouteMacro())
