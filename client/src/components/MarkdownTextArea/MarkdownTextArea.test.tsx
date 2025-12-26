import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
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
            onBlurHandler={vi.fn()}
          />
        )}
      />
      <p>Some Other Element</p>
    </div>
  );
};

const clickAway = async () => userEvent.click(screen.getByText(/Some Other Element/));

describe('MarkdownTextArea', () => {
  it('renders without crashing', () => {
    render(<RHFMarkdownTextArea />);
  });

  describe('when markdown should be rendered', () => {
    suppressWarnings();

    it('renders markdown', async () => {
      render(<RHFMarkdownTextArea />);
      const input = screen.getByRole('textbox');

      await userEvent.click(input);
      await userEvent.type(input, '$\\sum_0^\\infty$');
      await clickAway();

      await screen.findAllByText(/∑/);
      expect(screen.getAllByText(/∞/)).toBeDefined();
    });
  });

  describe('when markdown should not be rendered', () => {
    suppressWarnings();

    it('does not render markdown', async () => {
      render(<RHFMarkdownTextArea shouldRenderMarkdown={false} />);
      const input = screen.getByRole('textbox');

      await userEvent.click(input);
      await userEvent.type(input, '$\\sum_0^\\infty$');
      await clickAway();

      await waitFor(() => expect(screen.queryByText(/∑/)).not.toBeInTheDocument());
    });
  });
});
