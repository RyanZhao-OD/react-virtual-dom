import _ from './util';
import patch from './patch';
import listDiff from 'list-diff2';

// diff 函数，对比两棵树
function diff(oldTree, newTree) {
    const index = 0;    // 当前节点的标志
    let patches = {};   // 用来记录每个节点差异的对象
    dfsWalk(oldTree, newTree, index, patches);
    return patches;
}

// 对两棵树进行深度优先遍历
function dfsWalk(oldNode, newNode, index, patches) {
    let currentPatch = [];

    // Node is removed.
    if (newNode === null) {
        // Real DOM node will be removed when perform reordering, so has no needs to do anything in here
        // TextNode content replacing
    } else if (_.isString(oldNode) && _.isString(newNode)) {
        if (newNode !== oldNode) {
            currentPatch.push({type: patch.TEXT, content: newNode});
        }
        // Nodes are the same, diff old node's props and children
    } else if (
        oldNode.tagName === newNode.tagName &&
        oldNode.key === newNode.key
    ) {
        // Diff props
        let propsPatches = diffProps(oldNode, newNode);
        if (propsPatches) {
            currentPatch.push({type: patch.PROPS, props: propsPatches});
        }
        // Diff children. If the node has a `ignore` property, do not diff children
        if (!isIgnoreChildren(newNode)) {
            diffChildren(
                oldNode.children,
                newNode.children,
                index,
                patches,
                currentPatch
            );
        }
        // Nodes are not the same, replace the old node with new node
    } else {
        currentPatch.push({type: patch.REPLACE, node: newNode});
    }

    if (currentPatch.length) {
        // 对比oldNode和newNode的不同，记录下来
        patches[index] = currentPatch;
    }
}

function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
    let diffs = listDiff(oldChildren, newChildren, 'key');
    newChildren = diffs.children;

    if (diffs.moves.length) {
        let reorderPatch = {type: patch.REORDER, moves: diffs.moves};
        currentPatch.push(reorderPatch);
    }

    let leftNode = null;
    let currentNodeIndex = index;
    _.each(oldChildren, (child, i) => {
        let newChild = newChildren[i];

        // 计算节点的标识
        currentNodeIndex = (leftNode && leftNode.count)
            ? currentNodeIndex + leftNode.count + 1
            : currentNodeIndex + 1;

        // 深度遍历子节点
        dfsWalk(child, newChild, currentNodeIndex, patches);
        leftNode = child;
    });
}

function diffProps(oldNode, newNode) {
    let count = 0;
    let oldProps = oldNode.props;
    let newProps = newNode.props;

    let key, value;
    let propsPatches = {};

    // Find out different properties
    for (key in oldProps) {
        value = oldProps[key];
        if (newProps[key] !== value) {
            count++;
            propsPatches[key] = newProps[key];
        }
    }

    // Find out new property
    for (key in newProps) {
        value = newProps[key];
        if (!oldProps.hasOwnProperty(key)) {
            count++;
            propsPatches[key] = newProps[key];
        }
    }

    // If properties all are identical
    if (count === 0) {
        return null;
    }

    return propsPatches;
}

function isIgnoreChildren(node) {
    return (node.props && node.props.hasOwnProperty('ignore'));
}

export default diff;
