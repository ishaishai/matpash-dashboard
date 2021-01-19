const { lineBuilder } = require('./graphBuilders/lineBuilder');
const { pieBuilder } = require('./graphBuilders/pieBuilder');
const { columnBuilder } = require('./graphBuilders/columnBuilder');
const { areaBuilder } = require('./graphBuilders/areaBuilder');
const { barBuilder } = require('./graphBuilders/barBuilder');
const { halfPieBuilder } = require('./graphBuilders/halfPieBuilder');

exports.graphChooser = async (graph, dashId) => {
  switch (graph.type) {
    case 'line': {
      return lineBuilder(graph, dashId);
    }
    case 'pie': {
      return pieBuilder(graph, dashId);
    }
    case 'column': {
      return columnBuilder(graph, dashId);
    }
    case 'area': {
      return areaBuilder(graph, dashId);
    }
    case 'bar': {
      return barBuilder(graph, dashId);
    }
    case 'halfpie': {
      return halfPieBuilder(graph, dashId);
    }
    case 'ajax': {
      // not complete
      return ajaxLineBuilder(graph, dashId);
    }
    default: {
      return null;
    }
  }
};
