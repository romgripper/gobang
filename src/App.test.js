import { render, screen } from "@testing-library/react";
import App from "./App";

test("shows next player", () => {
    render(<App />);
    const text = screen.getByText(/Player/i);
    expect(text).toBeInTheDocument();
});
