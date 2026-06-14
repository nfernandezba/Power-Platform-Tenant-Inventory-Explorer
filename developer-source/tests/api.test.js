import { afterEach, describe, expect, it, vi } from "vitest";
import { createInventoryQuery, executeInventoryQuery, InventoryApiError, isEnvironmentManagementSettingNotFound, queryDirectoryUsers } from "../src/api.js";
import { QUERY_RESOURCE_TYPES } from "../src/constants.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createInventoryQuery", () => {
  it("uses the PowerPlatformResources table and pagination token", () => {
    const query = createInventoryQuery("next-token");
    expect(query.TableName).toBe("PowerPlatformResources");
    expect(query.Options.Top).toBe(1000);
    expect(query.Options.SkipToken).toBe("next-token");
  });

  it("includes all supported resource types", () => {
    const query = createInventoryQuery();
    const where = query.Clauses.find(clause => clause.$type === "where");
    for (const type of QUERY_RESOURCE_TYPES) {
      expect(where.Values).toContain(`'${type}'`);
    }
  });
});

describe("inventory error diagnostics", () => {
  it("preserves the service error, correlation ID, endpoint, query name and request body", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      error: { code: "BadRequest", message: "The query specification is invalid." }
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "x-ms-correlation-request-id": "correlation-123"
      }
    })));

    const query = createInventoryQuery();
    let caught;
    try {
      await executeInventoryQuery("token", query, { queryName: "test-query" });
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(InventoryApiError);
    expect(caught.status).toBe(400);
    expect(caught.details).toContain("invalid");
    expect(caught.correlationId).toBe("correlation-123");
    expect(caught.queryName).toBe("test-query");
    expect(caught.endpoint).toContain("resourcequery/resources/query");
    expect(caught.requestBody).toContain('"TableName": "PowerPlatformResources"');
    expect(caught.requestBody).not.toContain("token");
  });
});


describe("Microsoft Graph identity resolution", () => {
  it("batches user lookups in groups of twenty and returns unresolved identities", async () => {
    const calls = [];
    vi.stubGlobal("fetch", vi.fn(async (_url, options) => {
      const body = JSON.parse(options.body);
      calls.push(body.requests.length);
      return new Response(JSON.stringify({
        responses: body.requests.map((request, index) => index === body.requests.length - 1 && calls.length === 2
          ? { id: request.id, status: 404, body: { error: { message: "User not found" } } }
          : { id: request.id, status: 200, body: { id: request.url.split("/")[2].split("?")[0], displayName: `User ${request.id}`, userPrincipalName: `user${request.id}@example.com` } })
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }));

    const ids = Array.from({ length: 21 }, (_, index) => `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`);
    const result = await queryDirectoryUsers("graph-token", ids);
    expect(calls).toEqual([20, 1]);
    expect(result.users).toHaveLength(20);
    expect(result.unresolved).toHaveLength(1);
  });
});


describe("Environment Management Settings not-configured detection", () => {
  it("treats the documented 404 shape as a valid not-configured outcome", () => {
    const error = new InventoryApiError("Power Platform API returned HTTP 404.", {
      status: 404,
      details: JSON.stringify({ errors: { code: "NotFound", message: "EnvironmentManagementSetting b6730a4c-27d6-eb14-a7ae-78a3940d914d was not found" } })
    });
    expect(isEnvironmentManagementSettingNotFound(error)).toBe(true);
  });

  it("does not hide unrelated 404 responses", () => {
    const error = new InventoryApiError("Power Platform API returned HTTP 404.", {
      status: 404,
      details: JSON.stringify({ error: { code: "NotFound", message: "Environment was not found" } })
    });
    expect(isEnvironmentManagementSettingNotFound(error)).toBe(false);
  });
});
