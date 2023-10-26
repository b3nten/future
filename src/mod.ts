type Resolve<T> = (result: T) => void;
type Reject<U> = (reason: U) => void;
type Cancel = () => void;

type PromiseCallback<T, U> = (
  resolve: Resolve<T>,
  reject: Reject<U>,
  cancel: Cancel,
) => void;

type FutureStatus = "pending" | "resolved" | "rejected" | "cancelled";

/**
 * A promise that can be resolved or rejected from the outside.
 */

export default class Future<T, U = unknown> {
  constructor(callback: PromiseCallback<T, U>) {
    this.#callback = callback;
    this.#status = "pending";
    this.#value = undefined;
    this.#rejection = undefined;
    this.#promise = new Promise<T>((_resolve, _reject) => {
      this.resolve = (result: T) => {
        this.#value = result;
        this.#status = "resolved";
        _resolve(result);
      };
      this.reject = (reason: U) => {
        this.#rejection = reason;
        this.#status = "rejected";
        _reject(reason);
      };
      this.#callback(this.resolve, this.reject, this.cancel);
    });
    this.then = this.#promise.then.bind(this.#promise);
    this.catch = this.#promise.catch.bind(this.#promise);
    this.finally = this.#promise.finally.bind(this.#promise);
  }

  #callback: PromiseCallback<T, U>;
  #status: FutureStatus;
  #value: T | undefined;
  #rejection: U | undefined;
  #promise: Promise<T>;

  get status(): FutureStatus {
    return this.#status;
  }

  get value(): T | undefined {
    return this.#value;
  }

  get rejection(): U | undefined {
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

  public reject: Reject<U> = () => {
    throw new Error("Uninitialized");
  };

  public resolve: Resolve<T> = () => {
    throw new Error("Uninitialized");
  };

  public cancel(): void {}

  public then: Promise<T>["then"];
  public catch: Promise<T>["catch"];
  public finally: Promise<T>["finally"];
}

const f1 = new Future((resolve, reject) => {
  setTimeout(() => {
    resolve("Hello");
  }, 1000);
});

const f2 = new Future((resolve, reject) => {
  setTimeout(() => {
    resolve("World");
  }, 2000);
});

const f3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("Error");
  }, 3000);
});

await Promise.all([f1, f2, f3]).then(([f1, f2, f3]) => {
  console.log(f1, f2, f3);
});
