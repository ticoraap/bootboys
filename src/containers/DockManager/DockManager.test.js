import React from 'react'

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

import { DockManager } from './DockManager';
import DockCard from '../../components/DockCard/DockCard';

const dock1 = {
    addressid: 4,
    description: "This dock is the best dock",
    dockid: 55,
    latitude: 52.14969887684543,
    length: 11,
    longitude: 4.52310498508528,
    name: "Nieuwe dock",
    place: "Ding",
    price: 25,
    rented: false,
    userid: 1,
    width: 9,
    facilities: {
        description: "eerste facility",
         id: -1422854002,
         new: true,
         price: 12}
}
const dock2 = {
    addressid: 1,
    description: "Nice dock in a pond with fish to catch",
    dockid: 56,
    latitude: 52.15569907686882,
    length: 23,
    longitude: 4.47994887828827,
    name: "Best dock ever",
    place: "23",
    price: 23,
    rented: false,
    userid: 1,
    width: 23,
    facilities: []
}


configure({adapter: new Adapter()})

describe('<DockManager />', () => {
    it('should render two <DockCards /> elements if two dock objects are passed as props', () => {
        const wrapper = shallow(<DockManager userDocks={[dock1, dock2]} onGetUserDocks={() => {}}/>)

        expect(wrapper.find(DockCard)).toHaveLength(2);
    })
})