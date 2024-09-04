import { setError, setSuccess } from "./sendMessage";
//https://stackoverflow.com/questions/71873824/copy-text-to-clipboard-cannot-read-properties-of-undefined-reading-writetext
//https://web.dev/articles/async-clipboard
export const copyToClipBoardUtil = (data: string, text: string) => {
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard
      .writeText(data)
      .then(() => {
        setSuccess(text);
      })
      .catch((err) => {
        setError("Failed to copy text: " + err);
      })
      .finally(() => {
        setTimeout(() => {
          setError("");
          setSuccess("");
        }, 5000);
      });
  } else {
    unsecuredCopyToClipboard(data, text);
  }
  function unsecuredCopyToClipboard(text: string, successText: string) {
    // Create a new text area element
    const textArea = document.createElement("textarea");

    // Set its value to the text that you want copied
    textArea.value = text;

    // Make it not editable and not visible
    textArea.setAttribute("readonly", "");
    textArea.style.position = "absolute";
    textArea.style.left = "-9999px";

    // Append the text area to the document
    document.body.appendChild(textArea);
    // Select the text in the text area
    textArea.select();

    // Copy the text to the clipboard
    try {
      const successful = document.execCommand("copy");
      console.log(successText + " - execCommand");
      if (successful) {
        setSuccess(successText + " - execCommand");
      } else {
        setError("Failed to copy text");
      }
    } catch (err) {
      setError("Failed to copy text: " + err);
      console.log("Oops, unable to copy", err);
    } finally {
      setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
    }

    // Remove the text area from the document
    document.body.removeChild(textArea);
  }
};
