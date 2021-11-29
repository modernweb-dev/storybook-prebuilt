import {
  setCustomElementsManifest,
} from '../../web-components.js';
// @TODO: update WDS config for importing this data and leveraging it in `setCustomElements()`.
import customElements from './custom-elements.json';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

setCustomElementsManifest(customElements);
