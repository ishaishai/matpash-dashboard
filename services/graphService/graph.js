const { lineBuilder } = require('./graphBuilders/lineBuilder');
const { pieBuilder } = require('./graphBuilders/pieBuilder');
const { columnBuilder } = require('./graphBuilders/columnBuilder');
const { areaBuilder } = require('./graphBuilders/areaBuilder');
const { barBuilder } = require('./graphBuilders/barBuilder');
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
    case 'ajax': {
      return ajaxLineBuilder(graph, dashId);
    }
    default: {
      return null;
    }
  }
};
