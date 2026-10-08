import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

process.env.ADMIN_API_KEY = "test-admin-key";

const mocks = vi.hoisted(() => {
  const mockSave = vi.fn();
  const MockEvent: any = vi.fn(function (this: any, data: any) {
    Object.assign(this, data);
    this.save = mockSave;
  });
  MockEvent.find = vi.fn();
  MockEvent.countDocuments = vi.fn();
  MockEvent.findByIdAndUpdate = vi.fn();
  MockEvent.findByIdAndDelete = vi.fn();
  return { MockEvent, mockSave };
});

vi.mock("../models/events", () => ({ default: mocks.MockEvent }));

import app from "../app";

const ADMIN_KEY = "test-admin-key";
const VALID_ID = "507f1f77bcf86cd799439011";

const validBody = {
  header: "Tech Summit 2026",
  body: "A full day of talks and workshops.",
  date: "2026-12-01T10:00:00.000Z",
  location: "Lagos",
  banner_url: "/uploads/banner.png",
  registration_link: "https://example.com/register",
};

function mockFindChain(data: unknown[]) {
  const limitFn = vi.fn().mockResolvedValue(data);
  const skipFn = vi.fn().mockReturnValue({ limit: limitFn });
  const sortFn = vi.fn().mockReturnValue({ skip: skipFn, limit: limitFn });
  mocks.MockEvent.find.mockReturnValue({ sort: sortFn });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.ADMIN_API_KEY = ADMIN_KEY;
  mocks.mockSave.mockResolvedValue(undefined);
});

describe("admin events gate and validation", () => {
  it("POST without key returns 401 and leaves the model untouched", async () => {
    const res = await request(app).post("/api/v1/events/").send(validBody);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized", data: null });
    expect(mocks.MockEvent).not.toHaveBeenCalled();
    expect(mocks.mockSave).not.toHaveBeenCalled();
  });

  it("POST with wrong key returns 401", async () => {
    const res = await request(app)
      .post("/api/v1/events/")
      .set("x-admin-key", "wrong-key-with-same-len!")
      .send(validBody);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized", data: null });
  });

  it("POST with same-length wrong key returns 401", async () => {
    const res = await request(app)
      .post("/api/v1/events/")
      .set("x-admin-key", "test-admin-keX")
      .send(validBody);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized", data: null });
    expect(mocks.MockEvent).not.toHaveBeenCalled();
  });

  it("POST with unset admin key returns 503", async () => {
    delete process.env.ADMIN_API_KEY;
    const res = await request(app)
      .post("/api/v1/events/")
      .set("x-admin-key", ADMIN_KEY)
      .send(validBody);
    expect(res.status).toBe(503);
    expect(res.body).toEqual({
      message: "Admin access is not configured",
      data: null,
    });
    expect(mocks.MockEvent).not.toHaveBeenCalled();
  });

  it("POST with valid key and valid body returns 201", async () => {
    const res = await request(app)
      .post("/api/v1/events/")
      .set("x-admin-key", ADMIN_KEY)
      .send(validBody);
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Event created successfully");
    expect(mocks.MockEvent).toHaveBeenCalledOnce();
    expect(mocks.mockSave).toHaveBeenCalledOnce();
  });

  it("POST with http registration_link returns 400", async () => {
    const res = await request(app)
      .post("/api/v1/events/")
      .set("x-admin-key", ADMIN_KEY)
      .send({ ...validBody, registration_link: "http://example.com/register" });
    expect(res.status).toBe(400);
    expect(res.body.data).toBeNull();
    expect(typeof res.body.message).toBe("string");
  });

  it("POST with javascript banner_url returns 400", async () => {
    const res = await request(app)
      .post("/api/v1/events/")
      .set("x-admin-key", ADMIN_KEY)
      .send({ ...validBody, banner_url: "javascript:alert(1)" });
    expect(res.status).toBe(400);
    expect(res.body.data).toBeNull();
  });

  it("GET /all with huge limit returns 400", async () => {
    const res = await request(app).get("/api/v1/events/all?limit=1000000");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: expect.any(String), data: null });
  });

  it("GET /all with negative page returns 400", async () => {
    const res = await request(app).get("/api/v1/events/all?page=-2");
    expect(res.status).toBe(400);
    expect(res.body.data).toBeNull();
  });

  it("GET /all with non-numeric page returns 400", async () => {
    const res = await request(app).get("/api/v1/events/all?page=abc");
    expect(res.status).toBe(400);
    expect(res.body.data).toBeNull();
  });

  it("GET /all with valid pagination returns 200 with pagination object", async () => {
    mockFindChain([{ header: "a" }]);
    mocks.MockEvent.countDocuments.mockResolvedValue(25);
    const res = await request(app).get("/api/v1/events/all?page=1&limit=10");
    expect(res.status).toBe(200);
    expect(res.body.pagination).toEqual({ total: 25, page: 1, limit: 10, totalPages: 3 });
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("PUT with malformed id returns 400", async () => {
    const res = await request(app)
      .put("/api/v1/events/bad-id")
      .set("x-admin-key", ADMIN_KEY)
      .send({ header: "New header" });
    expect(res.status).toBe(400);
    expect(res.body.data).toBeNull();
    expect(mocks.MockEvent.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("PUT partial body forwards only provided keys", async () => {
    mocks.MockEvent.findByIdAndUpdate.mockResolvedValue({ _id: VALID_ID, header: "New header" });
    const res = await request(app)
      .put(`/api/v1/events/${VALID_ID}`)
      .set("x-admin-key", ADMIN_KEY)
      .send({ header: "New header", createdAt: "2020-01-01", __v: 99, injected: true });
    expect(res.status).toBe(200);
    expect(mocks.MockEvent.findByIdAndUpdate).toHaveBeenCalledOnce();
    const [, updateArg] = mocks.MockEvent.findByIdAndUpdate.mock.calls[0];
    expect(updateArg).toEqual({ header: "New header" });
  });

  it("POST with protocol-relative banner_url returns 400", async () => {
    const res = await request(app)
      .post("/api/v1/events/")
      .set("x-admin-key", ADMIN_KEY)
      .send({ ...validBody, banner_url: "//evil.com/x.png" });
    expect(res.status).toBe(400);
    expect(res.body.data).toBeNull();
  });

  it("DELETE without key returns 401", async () => {
    const res = await request(app).delete(`/api/v1/events/${VALID_ID}`);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized", data: null });
    expect(mocks.MockEvent.findByIdAndDelete).not.toHaveBeenCalled();
  });
});
