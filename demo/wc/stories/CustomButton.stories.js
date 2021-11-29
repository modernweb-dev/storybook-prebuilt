import '../src/custom-button.js';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export default {
  title: 'Example/Custom Button',
  component: 'custom-button',
};

const Template = (args) => html`
  <custom-button
    backgroundColor=${ifDefined(args.backgroundColor)}
    size=${ifDefined(args.size)}
    variant=${ifDefined(args.variant)}
    @click=${args.onClick}
  >${args.label}</custom-button>
`;

export const Primary = (args) => Template(args);
Primary.args = {
  variant: 'primary',
  label: 'Button',
};

export const Secondary = (args) => Template(args);
Secondary.args = {
  label: 'Button',
};

export const Large = (args) => Template(args);
Large.args = {
  size: 'large',
  label: 'Button',
};

export const Small = (args) => Template(args);
Small.args = {
  size: 'small',
  label: 'Button',
};
