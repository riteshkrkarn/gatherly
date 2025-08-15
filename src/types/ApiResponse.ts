export interface ApiResponse {
  success: boolean;
  message: string;
  statusCode?: number;
}

export function createApiResponse(
  success: boolean,
  message: string,
  statusCode: number = 200
): Response {
  return Response.json({ success, message }, { status: statusCode });
}
