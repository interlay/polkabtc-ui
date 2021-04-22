import {
  Story,
  Meta
} from '@storybook/react';

import TestButton, { Props } from './index';

const Template: Story<Props> = args => <TestButton {...args} />;

const PrimaryLg = Template.bind({});
PrimaryLg.args = {
  text: 'TestButtosn',
  color: 'primary',
  size: 'lg'
};

export {
  PrimaryLg
};
export default {
  title: 'UI/TestButton',
  component: TestButton
}as Meta;
