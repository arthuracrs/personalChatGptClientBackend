export interface TreeNode<T> {
  value: T;
  children: TreeNode<T>[];
}

export class Tree<T> {
  root: TreeNode<T>;

  constructor(value: T) {
    this.root = {
      value,
      children: [],
    };
  }

  addChild(value: T, parent: TreeNode<T> = this.root) {
    const newChild: TreeNode<T> = { value, children: [] };
    parent.children.push(newChild);
  }

  traverseBFS(callback: (node: TreeNode<T>) => void) {
    const queue: TreeNode<T>[] = [this.root];
    while (queue.length > 0) {
      const currentNode = queue.shift();
      callback(currentNode);
      currentNode.children.forEach((child) => queue.push(child));
    }
  }

  traverseDFS(
    callback: (node: TreeNode<T>) => void,
    node: TreeNode<T> = this.root,
  ) {
    callback(node);
    node.children.forEach((child) => this.traverseDFS(callback, child));
  }
}
