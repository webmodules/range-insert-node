
var assert = require('assert');
var insertNode = require('../');

describe('range-insert-node', function () {
  var div;

  afterEach(function () {
    if (div) {
      // clean up...
      document.body.removeChild(div);
      div = null;
    }
  });

  it('should insert a <b> element into a Range', function () {
    div = document.createElement('div');
    div.innerHTML = '<i>hello</i>';
    document.body.appendChild(div);

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
    div = document.createElement('div');
    div.innerHTML = '<i>hello</i>';
    document.body.appendChild(div);

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
    div = document.createElement('div');
    div.innerHTML = '<i>hello</i>';
    document.body.appendChild(div);

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
    div = document.createElement('div');
    div.innerHTML = '<i>test</i>';
    document.body.appendChild(div);

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

  it('should insert an empty DocumentFragment into a Range', function () {
    div = document.createElement('div');
    div.innerHTML = '<i>test</i>';
    document.body.appendChild(div);

    // set up the Range
    var range = document.createRange();
    range.setStart(div.firstChild.firstChild, 2);
    range.setEnd(div.firstChild.firstChild, 2);

    // create empty DocumentFragment
    var fragment = document.createDocumentFragment();

    insertNode(range, fragment);

    assert.equal('<i>test</i>', div.innerHTML);
  });

  it('should insert a DocumentFragment into a Range with lingering DOM elements', function () {
    div = document.createElement('div');
    div.innerHTML = '<p><strong><em>fo</em></strong>obar</p>';
    document.body.appendChild(div);

    // set up the Range
    var range = document.createRange();
    range.setStart(div.firstChild.firstChild.firstChild.firstChild, 0);
    range.setEnd(div.firstChild.lastChild, 4);

    var fragment = range.extractContents();

    insertNode(range, fragment);

    assert.equal('<p><strong><em>fo</em></strong>obar</p>', div.innerHTML);
  });

});
