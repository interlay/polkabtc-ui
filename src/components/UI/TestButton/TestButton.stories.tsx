import {
  Story,
  Meta
} from '@storybook/react';

import TestButton, { Props } from './index';

const Template: Story<Props> = args => <TestButton {...args} />;
const PrimaryLg = Template.bind({});
PrimaryLg.args = {
  variant: 'primary',
  size: 'large',
  color: 'polkadotPink',
  children: 'Test buttons'
};

const PrimaryMd = Template.bind({});
PrimaryMd.args = {
  color: 'polkadotPink',
  variant: 'primary',
  size: 'medium',
  children: 'Test Button'
};

export {
  PrimaryLg,
  PrimaryMd
};
export default {
  title: 'UI/TestButton',
  component: TestButton
}as Meta;
