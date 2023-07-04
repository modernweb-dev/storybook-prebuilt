/**
 * Storybook addons are React components. The `createAddon` function returns a React component that
 * wraps a custom element and passes on properties and events. This allows for creating addons with
 * web components (and therefore LitElement).
 *
 * The wrapper can forward specific events to your addon (web component) as they occur. Your addon
 * can listen for these events. Some useful Storybook events are forwarded by default (such as when
 * the user changes stories). An `options` parameter can be passed to `createAddon` that contains
 * additional events that you may need for your use case.
 *
 * Storybook expects only 1 addon to be in the DOM, which is the addon that is selected (active).
 * This means addons can be continuously connected/disconnected when switching between addons and
 * stories. This is important to understand to work effectively with LitElement lifecycle methods
 * and events. Addons that rely on events that might occur when it is not active, should have their
 * event listeners set up in the `constructor`. Event listeners set up in the `connectedCallback`
 * should always also be disconnected.
 */

import { React } from './manager.js';
import {
  STORY_SPECIFIED,
  STORY_CHANGED,
  STORY_RENDERED,
} from './core-events.js';

// A default set of Storybook events that are forwarded to the addon as they occur. If an addon
// needs additional events (either Storybook or custom events), they can be passed via the options.
const storybookEvents = [STORY_SPECIFIED, STORY_CHANGED, STORY_RENDERED];
const { Component, createRef, createElement } = React;
/**
 * @param {String} customElementName
 * @param {Object} [options]
 */
export function createAddon(customElementName, options = {}) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.ref = createRef();
    }

    componentDidMount() {
      const customEvents = options.events ?? [];
      const uniqueEvents = Array.from(
        new Set([...storybookEvents, ...customEvents])
      );
      uniqueEvents.forEach(event => {
        this.props.api.getChannel().on(event, detail => {
          if (!this.addonElement) {
            this.updateAddon(event);
          }
          this.addonElement.dispatchEvent(new CustomEvent(event, { detail }));
        });
      });
    }

    componentDidUpdate() {
      this.updateAddon();
    }

    updateAddon() {
      if (!this.addonElement) {
        this.addonElement = document.createElement(customElementName);
      }

      const { api, active } = this.props;
      Object.assign(this.addonElement, { api, active });

      // Here, the element could get added for the first time, or re-added after a switch between addons.
      if (this.shouldAddonBeInDom() && !this.ref.current.firstChild) {
        this.ref.current.appendChild(this.addonElement);
      }
    }

    shouldAddonBeInDom() {
      return this.ref.current && this.props.active;
    }

    render() {
      if (!this.props.active) {
        return null;
      }
      return createElement('div', { ref: this.ref });
    }
  };
}
