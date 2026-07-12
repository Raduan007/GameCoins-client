import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import apiResponse from "@/lib/api-response";
import { handleApiError, ApiError } from "@/lib/error-handler";
import Game from "@/models/game.model";

const REQUIRED_FIELDS = [
  "name",
  "slug",
  "shortDescription",
  "fullDescription",
  "category",
  "platform",
  "publisher",
  "logo",
  "banner",
] as const;

export async function GET() {
  try {
    await connectDB();

    const games = await Game.find({ isActive: true })
      .sort({ isPopular: -1, createdAt: -1 })
      .lean();

    return apiResponse.success(games, "Games fetched successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const missingFields = REQUIRED_FIELDS.filter((field) => {
      const value = body[field];
      return value === undefined || value === null || (typeof value === "string" && value.trim() === "");
    });

    if (missingFields.length > 0) {
      throw new ApiError(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    // Check for duplicate slug
    const existingGame = await Game.findOne({ slug: body.slug.trim().toLowerCase() });
    if (existingGame) {
      throw new ApiError(
        `A game with the slug "${body.slug.trim().toLowerCase()}" already exists`,
        409
      );
    }

    // Build game data with trimmed strings
    const gameData = {
      name: body.name.trim(),
      slug: body.slug.trim().toLowerCase(),
      shortDescription: body.shortDescription.trim(),
      fullDescription: body.fullDescription.trim(),
      category: body.category.trim(),
      platform: body.platform.trim(),
      publisher: body.publisher.trim(),
      logo: body.logo.trim(),
      banner: body.banner.trim(),
      rating: typeof body.rating === "number" ? body.rating : 0,
      isPopular: Boolean(body.isPopular),
      isFeatured: Boolean(body.isFeatured),
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    };

    const game = await Game.create(gameData);

    return apiResponse.success(game, "Game created successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
