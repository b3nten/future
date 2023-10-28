type Resolve<T> = (result: T) => void;
type Reject<U> = (reason: U) => void;

type PromiseCallback<T, U> = (
  resolve: Resolve<T>,
  reject: Reject<U>,
) => void | (() => void);
type FutureStatus = "pending" | "resolved" | "rejected"

function isFn(fn: unknown): fn is Function {
  return typeof fn === "function";
}

/**
 * A promise that can be resolved or rejected from the outside.
 */
export default class Future<T, U = unknown> {
  constructor(callback: PromiseCallback<T, U>, { lazy } = { lazy: true }) {
    this.#callback = callback;
    this.#status = "pending";
    this.#value = undefined;
    this.#rejection = undefined;
    if (!lazy) {
      this.#createPromise();
    }
  }

  #callback: PromiseCallback<T, U>;
  #status: FutureStatus;
  #value: T | undefined;
  #rejection: U | undefined;
  #promise: Promise<T> | undefined;
  #promise_resolve: ((result: T) => void) | undefined;
  #promise_reject: ((reason: U) => void) | undefined;
  #cleanup?: void | (() => void);

  #createPromise() {
    this.#promise = new Promise<T>((resolve, reject) => {
      this.#promise_resolve = resolve;
      this.#promise_reject = reject;
    });
    this.#cleanup = this.#callback(this.resolve, this.reject);
  }

  #resolve(result: any) {
    if (this.#status !== "pending") return;
    this.#status = "resolved";
    if (this.#promise_resolve) this.#promise_resolve(result);
    else this.#promise = Promise.resolve(result);
    isFn(this.#cleanup) && this.#cleanup();
  }

  #reject(reason: U) {
    if (this.#status !== "pending") return;
    this.#rejection = reason;
    this.#status = "rejected";
    if (this.#promise_reject) this.#promise_reject(reason);
    else this.#promise = Promise.reject(reason);
    isFn(this.#cleanup) && this.#cleanup();
  }

  get status(): FutureStatus {
    return this.#status;
  }
  get value(): T | undefined {
    return this.#value;
  }
  get rejection(): U | "Cancelled" | undefined {
    return this.#rejection;
  }
  get pending(): boolean {
    return this.#status === "pending";
  }
  get rejected(): boolean {
    return this.#status === "rejected";
  }
  get resolved(): boolean {
    return this.#status === "resolved";
  }
  public resolve: Resolve<T> = (value: T) => {
    this.#resolve(value);
  };
  public reject: Reject<U> = (reason: U) => {
    this.#reject(reason);
  };
  public realize = () => {
    if (!this.#promise) {
      this.#createPromise();
    }
    return this;
  };

  public then = (
    onfulfilled?: (value: T) => T | Promise<T>,
    onrejected?: (reason: U) => any,
  ) => {
    if (!this.#promise) {
      this.#createPromise();
    }
    const newFuture = new Future<unknown>((resolve, reject) => {
      this.#promise?.then((result) => {
        if (isFn(onfulfilled)) {
          try {
            resolve(onfulfilled(result));
          } catch (err) {
            reject(err);
          }
        } else {
          resolve(result);
        }
      }, (rejection) => {
        if (isFn(onrejected)) {
          try {
            resolve(onrejected(rejection));
          } catch (err) {
            reject(err);
          }
        } else {
          reject(rejection);
        }
      });
    }, { lazy: false });
    return newFuture;
  };
}
