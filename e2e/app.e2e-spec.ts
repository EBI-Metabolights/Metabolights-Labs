import { MetabolightsLabsPage } from './app.po';

describe('metabolights-labs App', () => {
  let page: MetabolightsLabsPage;

  beforeEach(() => {
    page = new MetabolightsLabsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
