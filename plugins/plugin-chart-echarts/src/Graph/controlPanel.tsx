/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import { t } from '@superset-ui/core';
import {
  formatSelectOptions,
  sections,
  sharedControls,
  ColumnOption,
  ColumnMeta,
} from '@superset-ui/chart-controls';
import { DEFAULT_FORM_DATA } from './types';
import {
  legendMarginControl,
  legendOrientationControl,
  legendTypeControl,
  showLegendControl,
} from '../controls';

const noopControl = { name: 'noop', config: { type: '', renderTrigger: true } };
const controlConfig = {
  ...sharedControls.entity,
  type: 'SelectControl',
  multi: false,
  freeForm: true,
  default: null,
  includeTime: false,
  optionRenderer: (c: ColumnMeta) => <ColumnOption column={c} showType />,
  valueRenderer: (c: ColumnMeta) => <ColumnOption column={c} />,
  valueKey: 'column_name',
  allowAll: true,
  filterOption: ({ data: opt }: any, text: string) =>
    (opt.column_name && opt.column_name.toLowerCase().indexOf(text.toLowerCase()) >= 0) ||
    (opt.verbose_name && opt.verbose_name.toLowerCase().indexOf(text.toLowerCase()) >= 0),
  promptTextCreator: (label: any) => label,
  commaChoosesOption: false,
};

const sourceControl = {
  name: 'source',
  config: {
    ...controlConfig,
    clearable: false,
    label: t('Source'),
    description: t('Source for nodes of graph'),
  },
};

const targetControl = {
  name: 'target',
  config: {
    ...controlConfig,
    clearable: false,
    label: t('Target'),
    description: t('Target for nodes of graph'),
  },
};

const categoryControl = {
  name: 'category',
  config: {
    ...controlConfig,
    clearable: true,
    label: t('Category'),
    description: t('Optional category for nodes of graph'),
    validators: [],
  },
};

export default {
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [sourceControl],
        [targetControl],
        [categoryControl],
        ['metric'],
        ['adhoc_filters'],
        ['row_limit'],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['color_scheme', noopControl],
        [<h1 className="section-header">{t('Legend')}</h1>],
        [showLegendControl],
        [legendTypeControl, legendOrientationControl],
        [legendMarginControl, noopControl],
        [<h1 className="section-header">{t('Layout')}</h1>],
        [
          {
            name: 'layout',
            config: {
              type: 'SelectControl',
              renderTrigger: true,
              label: t('Graph Layout'),
              default: DEFAULT_FORM_DATA.layout,
              choices: formatSelectOptions([
                ['force', t('Force')],
                ['circular', t('Circular')],
              ]),
              description: t('Layout type of graph'),
            },
          },
        ],
        [
          {
            name: 'draggable',
            config: {
              type: 'CheckboxControl',
              label: t('Enable node draging'),
              renderTrigger: true,
              default: DEFAULT_FORM_DATA.draggable,
              description: t('Whether to enable node dragging in force layout mode.'),
            },
          },
          {
            name: 'roam',
            config: {
              type: 'CheckboxControl',
              label: t('Enable graph roaming'),
              renderTrigger: true,
              default: DEFAULT_FORM_DATA.roam,
              description: t('Whether to enable chaging graph position.'),
            },
          },
        ],
        [
          {
            name: 'select_mode',
            config: {
              type: 'SelectControl',
              renderTrigger: true,
              label: t('Node Select Mode'),
              default: DEFAULT_FORM_DATA.selectedMode,
              choices: formatSelectOptions([
                ['single', t('Single')],
                ['multiple', t('Multiple')],
              ]),
              description: t('Allow node selections'),
            },
          },
        ],
        [
          {
            name: 'showSymbolThreshold',
            config: {
              type: 'TextControl',
              label: t('Label Threshold'),
              renderTrigger: true,
              isInt: true,
              default: DEFAULT_FORM_DATA.showSymbolThreshold,
              description: t('Minimum value for label to be displayed on graph.'),
            },
          },
        ],
        [
          {
            name: 'edgeLength',
            config: {
              type: 'SliderControl',
              label: t('Edge Length'),
              renderTrigger: true,
              min: 100,
              max: 1000,
              step: 50,
              default: DEFAULT_FORM_DATA.edgeLength,
              description: t('Edge length between nodes'),
            },
          },
        ],
        [
          {
            name: 'gravity',
            config: {
              type: 'SliderControl',
              label: t('Gravity'),
              renderTrigger: true,
              min: 0.1,
              max: 1,
              step: 0.1,
              default: DEFAULT_FORM_DATA.gravity,
              description: t('Strength to pull the graph toward center'),
            },
          },
        ],
        [
          {
            name: 'repulsion',
            config: {
              type: 'SliderControl',
              label: t('Repulsion'),
              renderTrigger: true,
              min: 100,
              max: 3000,
              step: 50,
              default: DEFAULT_FORM_DATA.repulsion,
              description: t('Repulsion strength between nodes'),
            },
          },
        ],
        [
          {
            name: 'friction',
            config: {
              type: 'SliderControl',
              label: t('Friction'),
              renderTrigger: true,
              min: 0.1,
              max: 1,
              step: 0.1,
              default: DEFAULT_FORM_DATA.friction,
              description: t('Friction between nodes'),
            },
          },
        ],
      ],
    },
  ],
};