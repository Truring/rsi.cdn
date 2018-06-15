import { Cdn } from "./index";

describe("operate on /", () => {

  beforeEach(async (done) => {
    done();
  });

  afterEach(async (done) => {
    done();
  });

  it("should run a test", (done) => {
    expect(true).not.toBeFalsy();
    done();
  });

  it("should return an instance", () => {
    const cdn = Cdn.getInstance();
    expect(cdn).toBeDefined();
    expect(typeof(cdn.register) === "function");
    expect(typeof(cdn.requestHandler) === "function");
  });
});
