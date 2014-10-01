
/**
 * Module dependencies.
 */

var debug = require('debug')('range-insert-node');

/**
 * Module exports.
 */

module.exports = insertNode;

/**
 * Returns `true` if `node` is a TextNode with an empty string inside,
 * or `false` otherwise.
 *
 * @param {Node} node - DOM node to check
 * @return {Boolean}
 * @private
 */

function isEmptyTextNode (node) {
  return node &&
    node.nodeType === 3 /* Node.TEXT_NODE */ &&
    node.nodeValue === '';
}

/**
 * Returns `true` if `node` is an Element with no child nodes, an empty text node,
 * or other empty Elements.
 *
 * @param {Node} node - DOM node to check
 * @return {Boolean}
 * @private
 */

function isEmptyElement (node) {
  return node &&
    node.nodeType === 1 /* Node.ELEMENT_NODE */ &&
    (node.childNodes.length === 0 ||
     (node.childNodes.length === 1 &&
      (isEmptyTextNode(node.firstChild) || isEmptyElement(node.firstChild))
     )
    );
}

/**
 * Cross-browser polyfill for `Range#insertNode()`.
 * Leverages the native `insertNode()` function, but does some additional
 * cleanup logic afterwards to remove residual empty TextNodes.
 *
 * @param {Range} range - DOM Range to "insert" `node` into
 * @param {Node} node - DOM node to insert into the `range` boundaries
 * @public
 */

function insertNode (range, node) {
  var child;
  var isDocumentFragment = node.nodeType === 11; /* Node.DOCUMENT_FRAGMENT_NODE */
  var left = isDocumentFragment ? node.firstChild : node;
  var right = isDocumentFragment ? node.lastChild : node;

  var rtn = range.insertNode(node);

  // check right-hand side child node
  if (right) {
    child = right.nextSibling;
    if (child) {
      if (child.nodeType === 3 /* Node.TEXT_NODE */ && isEmptyTextNode(child)) {
        debug('removing right-hand side `nextSibling` empty TextNode');
        child.parentNode.removeChild(child);
      } else if (child.nodeType === 1 /* Node.ELEMENT_NODE */ && child.nodeName === right.nodeName && isEmptyElement(child)) {
        debug('removing right-hand side `nextSibling` empty Element %o', child);
        child.parentNode.removeChild(child);
      }
    }
  }

  // check left-hand side child node
  if (left) {
    child = left.previousSibling;
    if (child) {
      if (child.nodeType === 3 /* Node.TEXT_NODE */ && isEmptyTextNode(child)) {
        debug('removing left-hand side `previousSibling` empty TextNode');
        child.parentNode.removeChild(child);
      } else if (child.nodeType === 1 /* Node.ELEMENT_NODE */ && child.nodeName === left.nodeName && isEmptyElement(child)) {
        debug('removing left-hand side `previousSibling` empty Element %o', child);
        child.parentNode.removeChild(child);
      }
    }
  }

  return rtn;
}
