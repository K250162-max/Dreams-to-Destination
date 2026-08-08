import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  createConsultationRequest: vi.fn(),
  createContactEnquiry: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import { appRouter } from "./routers";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("public lead procedures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("validates and stores a consultation request", async () => {
    dbMocks.createConsultationRequest.mockResolvedValue({ id: 42 });
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.leads.createConsultation({
      name: "Amina Khan",
      email: "amina@example.com",
      phone: "+92 300 1234567",
      visaType: "Student visa",
      preferredDate: "2026-09-18",
      preferredTime: "Afternoon",
      message: "I would like to discuss postgraduate options.",
      website: "",
    });

    expect(result).toMatchObject({ success: true, requestId: 42 });
    expect(dbMocks.createConsultationRequest).toHaveBeenCalledWith(
      expect.objectContaining({ email: "amina@example.com", visaType: "Student visa" }),
    );
  });

  it("rejects malformed consultation contact details", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.leads.createConsultation({
        name: "A",
        email: "not-an-email",
        phone: "abc",
        visaType: "Work visa",
        preferredDate: "tomorrow",
        preferredTime: "10am",
        website: "",
      }),
    ).rejects.toBeDefined();
    expect(dbMocks.createConsultationRequest).not.toHaveBeenCalled();
  });

  it("validates and stores a general enquiry", async () => {
    dbMocks.createContactEnquiry.mockResolvedValue({ id: 7 });
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.leads.createEnquiry({
      name: "Bilal Ahmed",
      email: "bilal@example.com",
      phone: "",
      subject: "Visitor visa review",
      message: "Please help me understand the document requirements.",
      website: "",
    });

    expect(result).toMatchObject({ success: true, enquiryId: 7 });
    expect(dbMocks.createContactEnquiry).toHaveBeenCalledWith(
      expect.objectContaining({ phone: null, subject: "Visitor visa review" }),
    );
  });
});
