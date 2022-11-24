// WARNING: DO NOT MODIFY THIS FILE

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CreateOrderView from "./pages/CreateOrder/CreateOrder.view";
import CreateOrder from "./pages/CreateOrder";
import { getMenuItems } from "./services/menu";

jest.mock("./services/menu");

const menu = {
  items: [
    // first group of radio-buttons
    [
      { id: "101", value: "Vegetarian" },
      { id: "102", value: "Nut allergy" },
      { id: "103", value: "Halal" },
    ],
    // second group of radio-buttons
    [
      { id: "201", value: "Cashew chicken" },
      { id: "202", value: "Sweet and sour pork" },
      { id: "203", value: "Stir fried Tofu" },
      { id: "204", value: "Vegetable fried rice" },
      { id: "205", value: "Pad Thai" },
      { id: "206", value: "Massaman beef" },
    ],
    // third group of radio-buttons
    [
      { id: "301", value: "Peanut sauce" },
      { id: "302", value: "Oyster sauce" },
      { id: "303", value: "Vegetable spring rolls" },
      { id: "304", value: "Steamed rice" },
    ],
  ],
  rules: {
    // 'Vegetarian' is NOT compatible with 'Cashew chicken', 'Sweet and sour pork', 'Massaman beef', 'Oyster sauce'
    101: [201, 202, 206, 302],
    // 'Nut allergy' is NOT compatible with 'Cashew chicken', 'Peanut sauce',
    102: [201, 301],
    // 'Halal' is NOT compatible with 'Sweet and sour pork',
    103: [202],
    // 'Vegetable fried rice' is NOT compatible with 'Steamed rice' (you don't need more rice... carb overload),
    204: [304],
    // 'Pad thai' is NOT compatible with 'Steamed rice' (Pad thai comes with noodles),
    205: [304],
  },
};

test("Renders all radio buttons", () => {
  render(<CreateOrderView items={menu.items} rules={menu.rules} />);
  const items = screen.getAllByTestId("radio-input-container");
  expect(items.length).toEqual(13);
});

test("Data is fetched properly", async () => {
  (getMenuItems as jest.Mock).mockReturnValue({ items: [], rules: {} });
  render(<CreateOrder />);
  await waitFor(() => {
    expect(getMenuItems as jest.Mock).toHaveBeenCalledTimes(1);
  });
});

test("Renders menu items properly", () => {
  render(<CreateOrderView items={menu.items} rules={menu.rules} />);
  const item1 = screen.getByText("Nut allergy");
  expect(item1).toBeDefined();
  const item2 = screen.getByText("Vegetable fried rice");
  expect(item2).toBeDefined();
  const item3 = screen.getByText("Oyster sauce");
  expect(item3).toBeDefined();
});

test("Renders loading page", () => {
  render(<CreateOrderView items={[]} rules={{}} />);
  const item = screen.getByText("Loading...");
  expect(item).toBeDefined();
});

test("Rules are working [1]", () => {
  render(<CreateOrderView items={menu.items} rules={menu.rules} />);
  const target1 = screen.getByText("Nut allergy");
  fireEvent.click(target1);
  const disabled10 = screen.getByLabelText("Cashew chicken");
  expect(disabled10).toBeDisabled();
  const disabled11 = screen.getByLabelText("Peanut sauce");
  expect(disabled11).toBeDisabled();
  const target2 = screen.getByText("Vegetable fried rice");
  fireEvent.click(target2);
  const disabled20 = screen.getByLabelText("Steamed rice");
  expect(disabled20).toBeDisabled();
});

test("Rules are working [2]", () => {
  render(<CreateOrderView items={menu.items} rules={menu.rules} />);
  const target1 = screen.getByText("Vegetarian");
  fireEvent.click(target1);
  const disabled10 = screen.getByLabelText("Cashew chicken");
  expect(disabled10).toBeDisabled();
  const disabled11 = screen.getByLabelText("Sweet and sour pork");
  expect(disabled11).toBeDisabled();
  const disabled12 = screen.getByLabelText("Oyster sauce");
  expect(disabled12).toBeDisabled();

  const target2 = screen.getByText("Vegetable fried rice");
  fireEvent.click(target2);
  const disabled20 = screen.getByLabelText("Steamed rice");
  expect(disabled20).toBeDisabled();
});
