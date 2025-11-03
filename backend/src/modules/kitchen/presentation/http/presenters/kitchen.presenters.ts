export type HttpOk<T> = { success: true } & T;
export type HttpFail = { success: false; message: string };

export const KitchenPresenters = {
  started: (message: string): HttpOk<{ message: string }> => ({
    success: true,
    message,
  }),
  error: (message: string): HttpFail => ({ success: false, message }),
};
