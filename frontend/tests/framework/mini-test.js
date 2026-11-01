/**
 * ==========================================================================
 * MINI-TEST: Zero-Dependency Modern Test Runner & Assertion Library
 * TecnoFix Colombia - Automated Testing Suite
 * ==========================================================================
 */

(function (window) {
  "use strict";

  class Assertion {
    constructor(actual) {
      this.actual = actual;
    }

    toBe(expected, msg) {
      if (!Object.is(this.actual, expected)) {
        throw new Error(msg || `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(this.actual)}`);
      }
      return true;
    }

    toEqual(expected, msg) {
      const a = JSON.stringify(this.actual);
      const b = JSON.stringify(expected);
      if (a !== b) {
        throw new Error(msg || `Expected ${b} but got ${a}`);
      }
      return true;
    }

    toBeTruthy(msg) {
      if (!this.actual) {
        throw new Error(msg || `Expected truthy value but got ${JSON.stringify(this.actual)}`);
      }
      return true;
    }

    toBeFalsy(msg) {
      if (this.actual) {
        throw new Error(msg || `Expected falsy value but got ${JSON.stringify(this.actual)}`);
      }
      return true;
    }

    toBeNull(msg) {
      if (this.actual !== null) {
        throw new Error(msg || `Expected null but got ${JSON.stringify(this.actual)}`);
      }
      return true;
    }

    toBeDefined(msg) {
      if (typeof this.actual === "undefined") {
        throw new Error(msg || `Expected defined value but got undefined`);
      }
      return true;
    }

    toBeGreaterThan(expected, msg) {
      if (!(this.actual > expected)) {
        throw new Error(msg || `Expected ${this.actual} to be greater than ${expected}`);
      }
      return true;
    }

    toBeLessThan(expected, msg) {
      if (!(this.actual < expected)) {
        throw new Error(msg || `Expected ${this.actual} to be less than ${expected}`);
      }
      return true;
    }

    toBeGreaterThanOrEqual(expected, msg) {
      if (!(this.actual >= expected)) {
        throw new Error(msg || `Expected ${this.actual} to be >= ${expected}`);
      }
      return true;
    }

    toContain(item, msg) {
      if (typeof this.actual === "string") {
        if (!this.actual.includes(item)) {
          throw new Error(msg || `Expected string to contain ${JSON.stringify(item)}`);
        }
      } else if (Array.isArray(this.actual)) {
        if (!this.actual.includes(item)) {
          throw new Error(msg || `Expected array to contain ${JSON.stringify(item)}`);
        }
      } else {
        throw new Error(msg || `Target is neither string nor array`);
      }
      return true;
    }

    toMatch(regex, msg) {
      if (!regex.test(String(this.actual))) {
        throw new Error(msg || `Expected ${JSON.stringify(this.actual)} to match ${regex}`);
      }
      return true;
    }

    toThrow(msg) {
      if (typeof this.actual !== "function") {
        throw new Error("Expected target to be a function to test throwing");
      }
      let threw = false;
      try {
        this.actual();
      } catch (e) {
        threw = true;
      }
      if (!threw) {
        throw new Error(msg || `Expected function to throw an error`);
      }
      return true;
    }
  }

  const suites = [];
  let currentSuite = null;

  function describe(name, fn) {
    const suite = {
      name,
      tests: [],
      beforeEachFns: [],
      afterEachFns: [],
      passed: 0,
      failed: 0,
      duration: 0
    };
    suites.push(suite);
    currentSuite = suite;
    try {
      fn();
    } finally {
      currentSuite = null;
    }
  }

  function it(name, fn) {
    if (!currentSuite) {
      throw new Error("Cannot define an 'it' block outside of a 'describe' suite.");
    }
    currentSuite.tests.push({
      name,
      fn,
      status: "pending",
      error: null,
      duration: 0
    });
  }

  function beforeEach(fn) {
    if (currentSuite) {
      currentSuite.beforeEachFns.push(fn);
    }
  }

  function afterEach(fn) {
    if (currentSuite) {
      currentSuite.afterEachFns.push(fn);
    }
  }

  function expect(actual) {
    return new Assertion(actual);
  }

  async function runAll(onUpdate) {
    const startTime = performance.now();
    let totalPassed = 0;
    let totalFailed = 0;

    for (const suite of suites) {
      suite.passed = 0;
      suite.failed = 0;
      const suiteStart = performance.now();

      for (const test of suite.tests) {
        // Run beforeEach
        for (const bf of suite.beforeEachFns) {
          try {
            await bf();
          } catch (e) {
            console.error("beforeEach failed:", e);
          }
        }

        const testStart = performance.now();
        try {
          await test.fn();
          test.status = "passed";
          test.error = null;
          suite.passed++;
          totalPassed++;
        } catch (err) {
          test.status = "failed";
          test.error = err.message || String(err);
          suite.failed++;
          totalFailed++;
        } finally {
          test.duration = Math.round((performance.now() - testStart) * 100) / 100;
        }

        // Run afterEach
        for (const af of suite.afterEachFns) {
          try {
            await af();
          } catch (e) {
            console.error("afterEach failed:", e);
          }
        }

        if (typeof onUpdate === "function") {
          onUpdate({ suite, test, totalPassed, totalFailed });
        }
      }

      suite.duration = Math.round((performance.now() - suiteStart) * 100) / 100;
    }

    const totalDuration = Math.round((performance.now() - startTime) * 100) / 100;
    return {
      suites,
      totalPassed,
      totalFailed,
      totalTests: totalPassed + totalFailed,
      totalDuration
    };
  }

  window.MiniTest = {
    describe,
    it,
    beforeEach,
    afterEach,
    expect,
    runAll,
    getSuites: () => suites,
    clearSuites: () => { suites.length = 0; }
  };

  // Aliases for standard testing style
  window.describe = describe;
  window.it = it;
  window.beforeEach = beforeEach;
  window.afterEach = afterEach;
  window.expect = expect;

})(typeof window !== "undefined" ? window : globalThis);
