import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MarkdownTextArea, { MarkdownTextAreaProps } from './MarkdownTextArea';
import { suppressWarnings } from '../../testUtils/suppressWarnings';

export const RHFMarkdownTextArea = ({ shouldRenderMarkdown = true }: Partial<MarkdownTextAreaProps>): JSX.Element => {
  const { control } = useForm();
  return (
    <div>
      <Controller
        control={control}
        name="markdown-text-area-test"
        aria-label="markdown-text-area-test"
        defaultValue="initial value"
        render={({ value, onChange }) => (
          <MarkdownTextArea
            value={value}
            shouldRenderMarkdown={shouldRenderMarkdown}
            onChange={onChange}
            onBlurHandler={jest.fn()}
          />
        )}
      />
      <p>Some Other Element</p>
    </div>
  );
};

const clickAway = () => userEvent.click(screen.getByText(/Some Other Element/));

describe('MarkdownTextArea', () => {
  it('renders without crashing', () => {
    render(<RHFMarkdownTextArea />);
  });

  describe('when markdown should be rendered', () => {
    suppressWarnings();

    it('renders markdown', async () => {
      render(<RHFMarkdownTextArea />);
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

    it('does not render markdown', async () => {
      render(<RHFMarkdownTextArea shouldRenderMarkdown={false} />);
      const input = screen.getByRole('textbox');

      userEvent.click(input);
      userEvent.type(input, '$\\sum_0^\\infty$');
      clickAway();

      await waitFor(() => expect(screen.queryByText(/∑/)).not.toBeInTheDocument());
    });
  });
});
