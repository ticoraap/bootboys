import React from 'react'

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

import DockCard from './DockCard';


const dock1 = {

    name: "Nieuwe dock",
    description: "This dock is the best dock",
    length: 11,
    width: 9,
    price: 25,
    facilities: [
        {
            description: "eerste facility",
            id: -1422854002,
            new: true,
            price: 12
        },
        {
            description: "tweede facility",
            id: -1422202,
            new: true,
            price: 12
        }
    ]
}

configure({adapter: new Adapter()})

describe('<DockCard />', () => {
    it('should render text of the DockCard ', () => {
        const wrapper = shallow(
            <DockCard 
                name={dock1.name} 
                description={dock1.description} 
                length={dock1.length} 
                width={dock1.width} 
                price={dock1.price} 
                numFacilities={dock1.facilities.length}
            />
        )

        expect(wrapper.text()).toMatch("Nieuwe dock")
        expect(wrapper.text()).toMatch("This dock is the best dock")
        expect(wrapper.text()).toMatch("length 11")
        expect(wrapper.text()).toMatch("width 9")
        expect(wrapper.text()).toMatch("price €25")
        expect(wrapper.text()).toMatch("facilities 2")
    })
})