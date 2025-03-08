// src/__mocks__/react-router-dom.js
const reactRouterDom = jest.createMockFromModule('react-router-dom');

reactRouterDom.BrowserRouter = function BrowserRouter({ children }) {
  return children;
};

reactRouterDom.Routes = function Routes({ children }) {
  return children;
};

reactRouterDom.Route = function Route() {
  return null;
};

module.exports = reactRouterDom;
