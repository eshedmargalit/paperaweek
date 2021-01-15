import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MarkdownTextArea from './MarkdownTextArea';
import { renderWithFormik } from '../../testUtils/formikRender';
import { suppressWarnings } from '../../testUtils/suppressWarnings';

function renderMDTextArea<T>(fieldName: string, fieldValue: T, shouldRenderMarkdown = true) {
  renderWithFormik(
    <div>
      <MarkdownTextArea formFieldName={fieldName} shouldRenderMarkdown={shouldRenderMarkdown} />
      <p>Some Other Element</p>
    </div>,
    fieldName,
    fieldValue
  );
}

const clickAway = () => userEvent.click(screen.getByText(/Some Other Element/));

describe('MarkdownTextArea', () => {
  it('renders without crashing', () => {
    renderMDTextArea('testItem', 'testValue');
  });

  describe('when markdown should be rendered', () => {
    suppressWarnings();

    it('renders markdown', async () => {
      renderMDTextArea('testItem', 'testValue');
      const input = screen.getByRole('textbox');

      userEvent.click(input);
      userEvent.type(input, '$\\sum_0^\\infty$');
      clickAway();

      await waitFor(() => expect(screen.getAllByText(/∑/)).toBeDefined());
      expect(screen.getAllByText(/∞/)).toBeDefined();
    });
  });

  describe('when markdown should not be rendered', () => {
    suppressWarnings();

    it('renders markdown', async () => {
      renderMDTextArea('testItem', 'testValue', false);
      const input = screen.getByRole('textbox');

      userEvent.click(input);
      userEvent.type(input, '$\\sum_0^\\infty$');
      clickAway();

      await waitFor(() => expect(screen.queryByText(/∑/)).not.toBeInTheDocument());
    });
  });
});
