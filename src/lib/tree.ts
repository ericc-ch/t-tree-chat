import type { MessageNode } from "../app"

/**
 * Finds the path from the root to a node with a specific ID in a message tree.
 * @param rootNode - The starting node of the tree or subtree to search in.
 * @param targetId - The 'id' of the message node to find.
 * @returns An array of MessageNode objects representing the path from the root
 * to the target node. Returns null if the node is not found.
 */
export function findPathToNode(
  rootNode: MessageNode,
  targetId: string,
): Array<MessageNode> | null {
  function search(
    currentNode: MessageNode,
    currentPath: Array<MessageNode>,
  ): Array<MessageNode> | null {
    const newPath = [...currentPath, currentNode]

    // Base Case: Check if the current node is the target.
    if (currentNode.id === targetId) {
      return newPath
    }

    // Recursive Step: Search through the branches.
    for (const branch of currentNode.branches) {
      const result = search(branch, newPath)
      // If the target was found in this branch, return the path.
      if (result) {
        return result
      }
    }

    // Target not found in this branch.
    return null
  }

  // Begin the recursive search from the root.
  return search(rootNode, [])
}
