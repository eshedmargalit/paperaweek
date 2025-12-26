import { useLayoutEffect, useRef, useState } from 'react';
import { Maybe } from '../../types';

interface AutoResizingTextArea {
  handleFocus: () => void;
  handleBlur: () => void;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  willRenderMarkdown: boolean;
}

export function useAutoResizingTextArea(
  value: string,
  shouldRenderMarkdown: boolean,
  onBlurHandler: Maybe<() => void>,
  extraMargin = '1em'
): AutoResizingTextArea {
  const [isFocused, setIsFocused] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    // Call our custom onBlurHandler
    if (onBlurHandler) {
      onBlurHandler();
    }

    // Call our unfocus after, to switch back to the markdown render
    setIsFocused(false);
  };

  const willRenderMarkdown = !isFocused && !!value && shouldRenderMarkdown;

  useLayoutEffect(() => {
    if (!textAreaRef.current) return;

    const currentTextArea = textAreaRef.current;

    // https://stackoverflow.com/a/995374
    // Set the textarea's height manually based on "scrollHeight", which grows with the text content.
    currentTextArea.style.height = 'auto';
    currentTextArea.style.height = `calc(${currentTextArea.scrollHeight}px + ${extraMargin})`;

    // Set the cursor at the end for the user, since we're assuming they want to edit
    const existingLength = currentTextArea.value.length;
    currentTextArea.setSelectionRange(existingLength, existingLength);
  }, [willRenderMarkdown]);

  return { handleFocus, handleBlur, textAreaRef, willRenderMarkdown };
}
