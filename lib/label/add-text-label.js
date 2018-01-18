var util = require("../util");

module.exports = addTextLabel;

/*
 * Attaches a text label to the specified root. Handles escape sequences.
 */
function addTextLabel(root, node) {
  if (node.width === 0)
    return;
  // let fS = (root.node().getBBox().width/node.label.length) * 1.549;
  fS = node.fontSize
  if (!fS)
    return;
  var domNode = root.append("text").style("font-size", function(v){
        return fS + "px";
      });
  // domNode.text(node.label);

  var lines = processEscapeSequences(node.label).split("\n");
  for (var i = 0; i < lines.length; i++) {
      domNode.append("tspan")
        .attr("xml:space", "preserve")
        .attr("dy", "1em")
        .attr("x", "1")
        .text(lines[i]).attr("transform",
                "translate(" + (0) + "," + (-root.node().getBBox().y - 1)+ ")");
  }

  // var pT = domNode.node().getBBox().width * domNode.node().getBBox().height;
  // var pRoot = node.height * node.width;

  // console.log(pRoot - pT);

  var dif = node.height - (domNode.node().getBBox().height + 10);
  if (!dif)
    return;
  while (dif < 0) {
    fS = fS - 1;
    root.select('text').remove();
    domNode = root.append("text").style("font-size", function(v){
        return fS + "px";
      });
    for (var i = 0; i < lines.length; i++) {
      domNode.append("tspan")
        .attr("xml:space", "preserve")
        .attr("dy", "1em")
        .attr("x", "1")
        .text(lines[i]).attr("transform",
                "translate(" + (0) + "," + (-root.node().getBBox().y - 1)+ ")");
    }
    dif = node.height - (domNode.node().getBBox().height + 10);
  }

  setTimeout(function () {
    const dx = (root.node().getBBox().width - domNode.node().getBBox().width) / 2;
    const dy = (- root.node().getBBox().y) + (root.select('rect').node().getBBox().height - domNode.node().getBBox().height) / 2;
    domNode.attr("transform",
                "translate(" + dx + "," + dy+ ")");
  }, 10);



  // util.applyStyle(domNode, node.labelStyle);

  return domNode;
}

function processEscapeSequences(text) {
  var newText = "",
      escaped = false,
      ch;
  for (var i = 0; i < text.length; ++i) {
    ch = text[i];
    if (escaped) {
      switch(ch) {
        case "n": newText += "\n"; break;
        default: newText += ch;
      }
      escaped = false;
    } else if (ch === "\\") {
      escaped = true;
    } else {
      newText += ch;
    }
  }
  return newText;
}
