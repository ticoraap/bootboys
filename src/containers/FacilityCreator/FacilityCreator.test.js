import React from 'react'

import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

import FacilityCreator from './FacilityCreator';
import Facility from './Facility/Facility';


const testfacility1 = {
    description: "Dit is een facility",
    id: "xwn86mb1qc5q9cjo50gee",
    price: 22.2,
}

const testfacility2 = {
    description: "Verse broodjes in de ochtend",
    id: "asdflkajsdflkjfsdf",
    price: 500,
}

configure({adapter: new Adapter()})

describe('<FacilityCreator />', () => {
    it('should render two facilities if two facility objects are passed', () => {
        const wrapper = shallow(
            <FacilityCreator facilities={[testfacility1,testfacility2]}  />
        )
        expect(wrapper.find(Facility)).toHaveLength(2)
    })

    it('should render one facility if one of two is removed by clicking the remove button', () => {
        let updatedFacilityList = []

        function setTheFacilityList(facilityList) {
            updatedFacilityList = facilityList
        }

        const wrapper = mount(
            <FacilityCreator updateFacilities={setTheFacilityList} facilities={[testfacility1,testfacility2]}  />
        )

        wrapper.find(Facility).first().find('button').first().simulate('click')
        expect(updatedFacilityList.length).toBe(1)
    })
})