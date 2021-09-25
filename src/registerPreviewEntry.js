import { addDecorator, addParameters, addArgsEnhancer, addArgTypesEnhancer } from '@storybook/client-api';

export function registerPreviewEntry(entry) {
  const { decorators, parameters, argsEnhancers, argTypesEnhancers, globals, globalTypes } = entry;
  if (decorators) {
    decorators.forEach(decorator => addDecorator(decorator, false));
  }
  if (parameters || globals || globalTypes) {
    addParameters({ ...parameters, globals, globalTypes }, false);
  }
  if (argsEnhancers) {
    argsEnhancers.forEach(enhancer => addArgsEnhancer(enhancer));
  }
  if (argTypesEnhancers) {
    argTypesEnhancers.forEach(enhancer => addArgTypesEnhancer(enhancer));
  }
}
