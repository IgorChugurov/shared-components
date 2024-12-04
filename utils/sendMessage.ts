export function sendMessage(message: string, data?: any) {
  const event = new CustomEvent(message, {
    detail: data,
  });
  window.dispatchEvent(event);
}
export function setError(error: string) {
  const event = new CustomEvent("setError", {
    detail: error,
  });
  window.dispatchEvent(event);
}
export function setSuccess(success: string) {
  //console.log(success);
  const event = new CustomEvent("setSuccess", {
    detail: success,
  });
  window.dispatchEvent(event);
}
