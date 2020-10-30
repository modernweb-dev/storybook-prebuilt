import { addDecorator, addParameters, addArgTypesEnhancer } from '@storybook/client-api';

export function registerPreviewEntry(entry) {
  const { decorators, parameters, argTypesEnhancers, globals, globalTypes } = entry;
  if (decorators) {
    decorators.forEach(decorator => addDecorator(decorator, false));
  }
  if (parameters || globals || globalTypes) {
    addParameters({ ...parameters, globals, globalTypes }, false);
  }
  if (argTypesEnhancers) {
    argTypesEnhancers.forEach(enhancer => addArgTypesEnhancer(enhancer));
  }
}
