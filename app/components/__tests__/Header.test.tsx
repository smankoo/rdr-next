import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Header } from "../Header";

// Mock dynamic imports
jest.mock("next/dynamic", () => () => {
  const DynamicComponent = () => null;
  DynamicComponent.displayName = "LoadableComponent";
  DynamicComponent.preload = jest.fn();
  return DynamicComponent;
});

describe("Header", () => {
  const mockProps = {
    feedName: "Test Feed",
    filterButtons: [],
    lastRefreshed: new Date(),
    handleRefreshFeeds: jest.fn(),
    handleOpenSettings: jest.fn(),
    handleToggleSidebar: jest.fn(),
    toggleDisplayMode: jest.fn(),
    displayMode: "list" as const,
    isSidebarOpen: true,
    handleSearch: jest.fn(),
    handleSetActiveFilter: jest.fn(),
    activeFilter: "All Articles" as const, // Change this line
    setDisplayMode: jest.fn(),
    onOpenSettings: jest.fn(),
  };

  it("renders the app title", () => {
    render(<Header {...mockProps} />);
    expect(screen.getByText("Reader")).toBeInTheDocument();
  });

  it("renders the settings button", () => {
    render(<Header {...mockProps} />);
    expect(screen.getByRole("button", { name: /settings/i })).toBeInTheDocument();
  });
});
