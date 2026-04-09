
import { GET } from "../routes/dynamic.ts";
import { getDynamicData } from "../util/dynamicDb.ts";

const MOCK_VAL = { id: 1, name: "Park", description: "Park" };
const MOCK_LIST = [MOCK_VAL, { id: 2, name: "Park", description: "Park" }];

jest.mock("../util/dynamicDb.ts", () => ({
  getDynamicData: jest.fn(),
  postDynamicData: jest.fn(),
  delDynamicData: jest.fn(),
}));

describe("Dynamic", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("DE00 - Missing Table", async () => {
    const req = new Request("http://localhost/api/dynamic");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("DE01 - Forbidden Table", async () => {
    (getDynamicData as jest.Mock).mockRejectedValue(new Error());
    const req = new Request("http://localhost/api/dynamic?table=bad");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("DE02 - Get All Park", async () => {
    (getDynamicData as jest.Mock).mockResolvedValue(MOCK_LIST);
    const req = new Request("http://localhost/api/dynamic?table=events");
    const res = await GET(req);
    const body = await res.json();
    expect(body.data[0].name).toBe("Park");
  });

  it("DE03 - Get One Park", async () => {
    (getDynamicData as jest.Mock).mockResolvedValue(MOCK_VAL);
    const req = new Request("http://localhost/api/dynamic?table=events&id=1");
    const res = await GET(req);
    const body = await res.json();
    expect(body.data.name).toBe("Park");
  });
});