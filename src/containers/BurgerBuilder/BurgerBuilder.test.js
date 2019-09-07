import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import { BurgerBuilder } from './BurgerBuilder';

configure({ adapter: new Adapter() });

describe('<BurgerBuilder/>', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<BurgerBuilder onInitIngredients={() => {}} />);
  });

  it('should render <BuildControls/> when receiving ingredients', () => {
    wrapper.setProps({ ings: { salad: 0 } });
    expect(wrapper.find(BuildControls)).toHaveLength(1);
  });

  //   it('should render three <NavigationItem/> elements if authenticated', () => {
  //     wrapper.setProps({ isAuthenticated: true });
  //     expect(wrapper.find(NavigationItem)).toHaveLength(3);
  //   });

  //   it('should contain Logout <NavigationItem/> if authenticated', () => {
  //     wrapper.setProps({ isAuthenticated: true });
  //     expect(
  //       wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)
  //     ).toEqual(true);
  //   });
});
