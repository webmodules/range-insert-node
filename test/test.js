
var assert = require('assert');
var insertNode = require('../');

describe('range-insert-node', function () {

  it('should insert a <b> element into a Range', function () {
    var div = document.createElement('div');
    div.innerHTML = '<i>hello</i>';

    // set up the Range
    var range = document.createRange();
    range.setStart(div.firstChild.firstChild, 1);
    range.setEnd(div.firstChild.firstChild, 2);

    var b = document.createElement('b');
    b.appendChild(document.createTextNode('test'));

    insertNode(range, b);

    assert.equal('<i>h<b>test</b>ello</i>', div.innerHTML);
  });

  it('should insert a <b> element into a Range (left-boundary)', function () {
    var div = document.createElement('div');
    div.innerHTML = '<i>hello</i>';

    // set up the Range
    var range = document.createRange();
    range.setStart(div.firstChild.firstChild, 0);
    range.setEnd(div.firstChild.firstChild, 1);

    var b = document.createElement('b');
    b.appendChild(document.createTextNode('test'));

    insertNode(range, b);

    assert.equal('<i><b>test</b>hello</i>', div.innerHTML);
    assert.equal(2, div.firstChild.childNodes.length);
    assert.equal('B', div.firstChild.childNodes[0].nodeName);
    assert.equal('test', div.firstChild.childNodes[0].firstChild.nodeValue);
    assert.equal('hello', div.firstChild.childNodes[1].nodeValue);
  });

  it('should insert a <b> element into a Range (right-boundary)', function () {
    var div = document.createElement('div');
    div.innerHTML = '<i>hello</i>';

    // set up the Range
    var range = document.createRange();
    range.setStart(div.firstChild.firstChild, 5);
    range.setEnd(div.firstChild.firstChild, 5);

    var b = document.createElement('b');
    b.appendChild(document.createTextNode('test'));

    insertNode(range, b);

    assert.equal('<i>hello<b>test</b></i>', div.innerHTML);
    assert.equal(2, div.firstChild.childNodes.length);
    assert.equal('hello', div.firstChild.childNodes[0].nodeValue);
    assert.equal('B', div.firstChild.childNodes[1].nodeName);
    assert.equal('test', div.firstChild.childNodes[1].firstChild.nodeValue);
  });

  it('should insert a DocumentFragment into a Range', function () {
    var div = document.createElement('div');
    div.innerHTML = '<i>test</i>';

    // set up the Range
    var range = document.createRange();
    range.setStart(div.firstChild.firstChild, 0);
    range.setEnd(div.firstChild.firstChild, 0);

    var fragment = document.createDocumentFragment();

    var d = document.createElement('b');
    d.appendChild(document.createTextNode('foo'));
    fragment.appendChild(d);

    d = document.createElement('u');
    d.appendChild(document.createTextNode('bar'));
    fragment.appendChild(d);

    insertNode(range, fragment);

    assert.equal('<i><b>foo</b><u>bar</u>test</i>', div.innerHTML);
    assert.equal(3, div.firstChild.childNodes.length);
    assert.equal('B', div.firstChild.childNodes[0].nodeName);
    assert.equal('U', div.firstChild.childNodes[1].nodeName);
    assert.equal('test', div.firstChild.childNodes[2].nodeValue);
  });

});
