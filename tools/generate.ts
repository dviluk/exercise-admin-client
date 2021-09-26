const { generateTemplateFiles } = require('generate-template-files');

const FunctionalComponent = {
  option: 'Create Component (Functional)',
  defaultCase: '(pascalCase)',
  entry: {
    folderPath: './tools/templates/functional-component.tsx',
  },
  stringReplacers: ['__name__'],
  output: {
    path: './src/components/__name__/index.tsx',
    pathAndFileNameDefaultCase: '(pascalCase)',
  },
};

generateTemplateFiles([
  FunctionalComponent,
  {
    ...FunctionalComponent,
    option: 'Create Field Component (Functional)',
    output: {
      ...FunctionalComponent.output,
      path: './src/components/Fields/__name__/index.tsx',
    },
  },
  {
    ...FunctionalComponent,
    option: 'Create PRO Field Component (Functional)',
    entry: {
      ...FunctionalComponent.entry,
      folderPath: './tools/templates/pro-functional-component.tsx',
    },
    output: {
      ...FunctionalComponent.output,
      path: './src/components/Fields/Pro/Pro__name__/index.tsx',
    },
  },
]);
