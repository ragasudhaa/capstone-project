import React from 'react';
import App from '../App';
import { expect } from 'chai';
import ChatScreen from '../components/ChatScreen';

import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const { createStore } = require('redux');
const ChatApp = require('.');
const should = require('chai').should();


Enzyme.configure({ adapter: new Adapter() });

const store = {
    getState: () => "",
    subscribe: (a) => a,
    dispatch: (a) => a,
}
const props = {
    currentUsername: 'Sudha'
  };

describe('ChatApp unit testing', function() {

	it('should render', () => {
		const app = shallow(<App store={store} {...props}/>);
		expect(app.length).to.equal(1);
	});
	it('should render ChatScreen component', () => { 
		localStorage.setItem('username', props.currentUsername);	
        const wrapper = mount(<App store={store} />);		
        expect(wrapper.find(ChatScreen).length).to.equal(1);
    });
    it('should GET_USERNAME', function() {
    const currState = {
        username: ''
    };

    const store = createStore(ChatApp, currState);

    const action = {
      type: 'GET_USERNAME',
      username : 'Sudha'
    };

    store.dispatch(action);

    store.getState().should.have.property('username');
    store.getState().should.have.property('username').and.equal('Sudha');
  });

  it('should SET_USERNAME', function() {

    const currState = {
        username: ''
    };

    const store = createStore(ChatApp, currState);

    const action = {
      type: 'SET_USERNAME',
      username : 'Sudha'
    };

    store.dispatch(action);

    store.getState().should.have.property('username');
    store.getState().should.have.property('screen');
    store.getState().should.have.property('username').and.equal('Sudha');
    store.getState().should.have.property('screen').and.equal('ChattingSection');
  });

});
