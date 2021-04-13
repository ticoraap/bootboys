import React from 'react'

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

import Facility from './Facility';


const testfacility1 = {
    description: "Dit is een facility",
    id: "xwn86mb1qc5q9cjo50gee",
    price: 22.2,
}

const testfacility2 = {
    description: "Verse broodjes in de ochtend",
    id: "xwn86mb1qc5q9cjo50gee",
    price: 500,
}

configure({adapter: new Adapter()})

describe('<Facility />', () => {
    it('should render the presented text of the Facility, double as price', () => {
        const wrapper = shallow(
            <Facility 
                price={testfacility1.price} 
                description={testfacility1.description} 
            />
        )
        expect(wrapper.text()).toMatch("€22,20Dit is een facility")
    })
    it('should render the presented text of the Facility, int as price', () => {
        const wrapper = shallow(
            <Facility 
                price={testfacility2.price} 
                description={testfacility2.description} 
            />
        )
        expect(wrapper.text()).toMatch("€500,00Verse broodjes in de ochtend")
    })
})