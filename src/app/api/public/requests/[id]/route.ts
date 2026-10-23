import { type NextRequest, NextResponse } from "next/server";
import { fetchFromBackendWithAuth } from "../route";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const decodedId = decodeURIComponent(id).trim();
  const userToken = request.cookies.get("accessToken")?.value;

  // 1. Try direct UUID fetch
  const directData = await fetchFromBackendWithAuth(
    `/requests/${encodeURIComponent(decodedId)}`,
    userToken,
  );

  if (directData?.data) {
    return NextResponse.json(directData, { status: 200 });
  }

  // 2. If user searched/linked by requestNumber (e.g. CIV-2026-06303370), resolve from list
  const listData = await fetchFromBackendWithAuth("/requests", userToken);
  if (Array.isArray(listData?.data)) {
    const matched = listData.data.find(
      (r: { id?: string; requestNumber?: string }) =>
        r.id?.toLowerCase() === decodedId.toLowerCase() ||
        r.requestNumber?.toLowerCase() === decodedId.toLowerCase(),
    );

    if (matched?.id) {
      const fullDetail = await fetchFromBackendWithAuth(
        `/requests/${encodeURIComponent(matched.id)}`,
        userToken,
      );
      if (fullDetail?.data) {
        return NextResponse.json(fullDetail, { status: 200 });
      }
      return NextResponse.json(
        {
          statusCode: 200,
          success: true,
          message: "Service request retrieved successfully.",
          data: matched,
        },
        { status: 200 },
      );
    }
  }

  return NextResponse.json(
    {
      statusCode: 404,
      success: false,
      message: "Service request not found",
      data: null,
    },
    { status: 404 },
  );
}
