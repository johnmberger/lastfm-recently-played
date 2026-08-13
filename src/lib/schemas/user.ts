import { z } from "zod";

export const userInfoSchema = z.object({
  user: z.object({
    name: z.string(),
    realname: z.string().optional().default(""),
    url: z.string().url().or(z.literal("")),
    playcount: z.string(),
    artist_count: z.string().optional(),
    album_count: z.string().optional(),
    track_count: z.string().optional(),
    registered: z.object({
      unixtime: z.string(),
      "#text": z.union([z.string(), z.number()]).optional(),
    }),
  }),
});

export const userTagSchema = z.object({
  name: z.string(),
  count: z.string(),
  url: z.string().optional().default(""),
});

export const userTopTagsSchema = z.object({
  toptags: z.object({
    tag: z.union([z.array(userTagSchema), userTagSchema]).optional().default([]),
    "@attr": z
      .object({
        user: z.string().optional(),
      })
      .optional(),
  }),
});

export type UserInfo = {
  name: string;
  playcount: number;
  registeredUnix: number;
  url: string;
};

export type UserTag = {
  name: string;
  count: number;
  url: string;
};

export type UserInfoResponse = z.infer<typeof userInfoSchema>;
export type UserTopTagsResponse = z.infer<typeof userTopTagsSchema>;
