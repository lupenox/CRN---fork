/// <reference types="jest" />
import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';

// Mock React Native's useColorScheme so it doesn't return null
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: () => 'light',
}));

describe('<App />', () => {
  it('renders successfully', async () => {
    let tree;
    // Wrapping in act because App.tsx likely has state updates on load
    await renderer.act(async () => {
      tree = renderer.create(<App />);
    });
    expect(tree).toBeTruthy();
  });
});