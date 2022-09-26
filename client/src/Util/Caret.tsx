const insertTextAtCursor: Function = (
  textarea: HTMLTextAreaElement,
  str: string
): void => {
  let start: number = textarea.selectionStart;
  let end: number = textarea.selectionEnd;
  let text: string = textarea.value;

  // inserts str in between start and end
  textarea.value = text.slice(0, start) + str + text.slice(end, text.length);

  // sets cursor position to where it should be after adding in str
  textarea.selectionEnd = str.length + start;
};

export default insertTextAtCursor;
