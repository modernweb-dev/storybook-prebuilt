import { Button } from '../src/Button.js';

export default {
  title: 'Example/Button',
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: { action: 'onClick' },
  },
  parameters: {
    actions: {
      handles: [ 'click' ]
    }
  }
};

const Template = args => Button(args);

export const Primary = (args) => Template(args);
Primary.args = {
  primary: true,
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
