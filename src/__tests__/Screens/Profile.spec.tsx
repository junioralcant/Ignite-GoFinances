import React from 'react';
import { render } from '@testing-library/react-native';

import { Profile } from '../../Screens/Profile';

test('check if show currectly user input name placeholder', () => {
  const { debug } = render(<Profile />);
  debug();
});
