import mongoose, { Model } from "mongoose";
import { GameSchema } from "./game.schema";
import type { IGame } from "@/types/game";

const Game: Model<IGame> =
  mongoose.models.Game || mongoose.model<IGame>("Game", GameSchema);

export default Game;