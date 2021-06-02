import DataLoader from "dataloader";
import { Updoot } from "../entities/updoot";

// we load {postId: 5, userId: 10, value: 1}
// and return the value
export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Updoot | null>(
    async (keys) => {
      const updoots = await Updoot.findByIds(keys as any);
      const updootIdsToUpdoot: Record<string, Updoot> = {};
      updoots.forEach((updoot) => {
        updootIdsToUpdoot[`${updoot.userId}|${updoot.postId}`] = updoot;
      });

      return keys.map((key) => updootIdsToUpdoot[`${key.userId}|${key.postId}`]);
    }
  );
