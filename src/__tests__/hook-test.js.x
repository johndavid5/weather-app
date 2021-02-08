import React from "react";
import ReactDOM from "react-dom";
// import App from "../index";
import App from '../components/app';

import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("App loads with initial state of 0", () => {
  const wrapper = shallow(<App />);
  const text = wrapper.find("p").text();
  expect(text).toEqual("0");
});