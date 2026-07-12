import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import apiResponse from "@/lib/api-response";
import { handleApiError, ApiErrors } from "@/lib/error-handler";
import Game from "@/models/game.model";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { slug } = await context.params;

    const game = await Game.findOne({ slug, isActive: true }).lean();

    if (!game) {
      throw ApiErrors.notFound("Game");
    }

    return apiResponse.success(game, "Game fetched successfully");
  } catch (error) {
    return handleApiError(error);
  }
}