import './style/reset.css';
import Element from './lib/element';
import diff from './lib/diff';
import patch from './lib/patch';

let count = 0;

const renderTree = () => {
    count++;

    let items = [];
    let color = (count & 1) === 0 ? 'blue' : 'red';

    for (let i = 0; i < count; i++) {
        items.push(new Element('li', [`Item #${i}`]));
    }

    return new Element('div', {id: 'container'}, [
        new Element('h1', {style: `color: ${color}`}, ['simple virtal dom']),
        new Element('p', [`the count is :${count}`]),
        new Element('ul', items)
    ]);
};

// 构建一个virtual dom
let tree = renderTree();
console.log(tree);

// 真正的Dom元素节点
let root = tree.render();
document.body.appendChild(root);

setInterval(() => {
    let newTree = renderTree();

    // 比较两棵虚拟DOM树的不同
    let patches = diff(tree, newTree);
    console.log(patches);

    // 在真正的DOM元素上应用变更
    patch(root, patches);

    tree = newTree;
}, 1.5 * 1000);