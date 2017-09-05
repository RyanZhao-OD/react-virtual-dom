import _ from './util';

/**
 * Virtual-dom Element.
 * @param {String} tagName
 * @param {Object} props - Element's properties,
 *                       - using object to store key-value pair
 * @param {Array<Element|String>} - This element's children elements.
 *                                - Can be Element instance or just a piece plain text.
 */

export default class Element {
    constructor(tagName, props, children) {
        if (!_.isArray(children) && children != null) {
            children = _.slice(arguments, 2).filter(_.truthy)
        }

        if (_.isArray(props)) {
            children = props;
            props = {};
        }

        this.tagName = tagName;
        this.props = props || {};
        this.children = children || [];
        this.key = props
            ? props.key
            : void 666;

        let count = 0;

        _.each(this.children, (child, i) => {
            if (child instanceof Element) {
                count += child.count;
            } else {
                children[i] = '' + child;
            }
            count++;
        });

        this.count = count;
    }

    /**
     * Render the hold element tree.
     */
    render() {
        let el = document.createElement(this.tagName);
        let props = this.props;

        for (var propName in props) {
            var propValue = props[propName];
            _.setAttr(el, propName, propValue);
        }

        _.each(this.children, function (child) {
            let childEl = (child instanceof Element)
                ? child.render()
                : document.createTextNode(child);
            el.appendChild(childEl);
        });

        return el;
    }
}
