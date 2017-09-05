import './style/reset.css';
import Element from './lib/element';
import diff from './lib/diff';
import patch from './lib/patch';

let count = 0;

const renderTree  = () => {
    count++;

    let items = [];
    let color = (count % 2 === 0)
        ? 'blue'
        : 'red';

    for (var i = 0; i < count; i++) {
        items.push(new Element('li', ['Item #' + i]));
    }

    return new Element('div', {'id': 'container'}, [
        new Element('h1', {style: 'color: ' + color}, ['simple virtal dom']),
        new Element('p', ['the count is :' + count]),
        new Element('ul', items)
    ]);
};

let tree = renderTree();
let root = tree.render();
document.body.appendChild(root);

setInterval(function () {
    let newTree = renderTree();
    let patches = diff(tree, newTree);
    console.log(patches);
    patch(root, patches);

    tree = newTree;
}, 10 * 1000);