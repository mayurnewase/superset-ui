import { EchartsGraphFormData, DEFAULT_FORM_DATA as DEFAULT_GRAPH_FORM_DATA } from './types';
import {
  CategoricalColorNamespace,
  ChartProps,
  getMetricLabel,
  DataRecord,
  DataRecordValue,
} from '@superset-ui/core';
import { EchartsProps } from '../types';

function normalizeData(nodes) {
  let max = Number.MIN_VALUE;
  let min = Number.MAX_VALUE;
  nodes.forEach(node => {
    const symbolSize = node.symbolSize;
    if (symbolSize > max) {
      max = symbolSize;
    }
    if (symbolSize < min) {
      min = symbolSize;
    }
  });

  nodes.forEach(node => {
    node.symbolSize = ((node.symbolSize - min) / (max - min)) * 80 + 20;
  });
}

export default function transformProps(chartProps: ChartProps): EchartsProps {
  const { width, height, formData, queriesData } = chartProps;
  const data: DataRecord[] = queriesData[0].data || [];

  const {
    name,
    source,
    target,
    category,
    colorScheme,
    metric = '',
    zoom,
    layout,
    circularConfig,
    forceConfig,
    roam,
    draggable,
    edgeSymbol,
    edgeSymbolSize,
    itemStyle,
    labelConfig,
    emphasis,
    selectedMode,
    autoCurveness,
    left,
    top,
    right,
    bottom,
    animation,
    animationDuration,
    animationEasing,
    showSymbolThreshold,
    tooltipConfiguration,
    lineStyleConfiguration,
  }: EchartsGraphFormData = { ...DEFAULT_GRAPH_FORM_DATA, ...formData };

  const metricLabel = getMetricLabel(metric);
  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  var index: number = 0;
  var nodes: { [name: string]: number } = {}; //{agri: 0, carbon: 1}
  var echart_nodes: {
    id: number;
    name: DataRecordValue;
    symbolSize: any;
    value: DataRecordValue;
    label?: { [name: string]: boolean };
  }[] = []; // [{id,name,symbol,x,y,value} , {}]
  var echart_links: object[] = []; // [{source, target}, {}]
  var echart_categories: [] = [];
  var index = 0;
  var source_index = 0;
  var target_index = 0;

  data.forEach(link => {
    console.log('link ', link);
    const node_source: any = link[source];
    const node_target: any = link[target];
    const node_category: any = category ? link[category]?.toString() : 'default';

    if (!(node_source in nodes)) {
      echart_nodes.push({
        id: index,
        name: node_source,
        value: link[metricLabel],
        symbolSize: link[metricLabel],
        category: node_category,
      });
      source_index = index;
      nodes[node_source] = index;
      index += 1;
    } else {
      source_index = nodes[node_source];
      echart_nodes[source_index].value += link[metricLabel];
      echart_nodes[source_index].symbolSize += link[metricLabel];
    }

    if (!(node_target in nodes)) {
      echart_nodes.push({
        id: index,
        name: node_target,
        value: link[metricLabel],
        symbolSize: link[metricLabel],
        category: node_category,
      });
      target_index = index;
      nodes[node_target] = index;
      index += 1;
    } else {
      target_index = nodes[node_target];
      echart_nodes[target_index].value += link[metricLabel];
      echart_nodes[target_index].symbolSize += link[metricLabel];
    }
    echart_links.push({ source: source_index.toString(), target: target_index.toString() });

    if (!echart_categories.includes(node_category)) {
      echart_categories.push(node_category);
    }
  });
  if (showSymbolThreshold > 0) {
    echart_nodes.forEach(function (node) {
      node.label = {
        show: node.value > showSymbolThreshold,
      };
    });
  }
  console.log('nodes', echart_nodes);
  normalizeData(echart_nodes);
  console.log('normalized nodes', echart_nodes);
  console.log('nodes', echart_nodes);
  console.log('links ', echart_links);
  console.log('categories ', echart_categories);

  const echartOptions = {
    title: {
      text: name,
      subtext: 'Default layout',
      top: 'bottom',
      left: 'right',
    },
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    tooltip: tooltipConfiguration,
    legend: [{ data: echart_categories }],
    series: [
      {
        name: name,
        zoom: zoom,
        type: 'graph',
        categories: echart_categories.map(function (c) {
          return { name: c, itemStyle: { color: colorFn(c) } };
        }),
        layout: layout,
        force: forceConfig,
        circular: circularConfig,
        data: echart_nodes,
        links: echart_links,
        roam: roam,
        draggable: draggable,
        edgeSymbol: edgeSymbol,
        edgeSymbolSize: edgeSymbolSize,
        //itemStyle: itemStyle,
        selectedMode: selectedMode,
        autoCurveness: autoCurveness,
        left: left,
        top: top,
        bottom: bottom,
        right: right,
        animation: animation,
        label: labelConfig,
        lineStyle: lineStyleConfiguration,
        emphasis: emphasis,
      },
    ],
  };

  return {
    width,
    height,
    echartOptions,
  };
}
