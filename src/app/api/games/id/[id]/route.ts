import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import apiResponse from "@/lib/api-response";
import { handleApiError, ApiErrors } from "@/lib/error-handler";
import Game from "@/models/game.model";
import type { IGame } from "@/types/game";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * Allowed updatable fields from the IGame schema.
 * Excludes _id, createdAt, updatedAt — those are managed by the database.
 */
const ALLOWED_FIELDS: (keyof IGame)[] = [
  "name",
  "slug",
  "shortDescription",
  "fullDescription",
  "category",
  "platform",
  "publisher",
  "logo",
  "banner",
  "rating",
  "isPopular",
  "isFeatured",
  "isActive",
];

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await request.json();

    // Build an update object using only the keys present in the request body
    const updateData: Partial<IGame> = {};

    for (const field of ALLOWED_FIELDS) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // If the client sent no recognised fields, bail early
    if (Object.keys(updateData).length === 0) {
      // Return the existing game unchanged with a 200 and a hint
      const game = await Game.findById(id).lean();
      if (!game) {
        throw ApiErrors.notFound("Game");
      }
      return apiResponse.success(game, "No fields to update; returning existing game");
    }

    const updatedGame = await Game.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedGame) {
      throw ApiErrors.notFound("Game");
    }

    return apiResponse.success(updatedGame, "Game updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;

    const deletedGame = await Game.findByIdAndDelete(id).lean();

    if (!deletedGame) {
      throw ApiErrors.notFound("Game");
    }

    return apiResponse.success(null, "Game deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}