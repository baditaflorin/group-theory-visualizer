import { z } from "zod";

const commitSchema = z.object({
  sha: z.string(),
  html_url: z.string(),
  commit: z.object({
    message: z.string(),
    committer: z.object({
      date: z.string()
    })
  })
});

export type LatestCommit = {
  sha: string;
  shortSha: string;
  url: string;
  message: string;
  date: string;
};

export async function fetchLatestCommit(): Promise<LatestCommit> {
  const response = await fetch(
    "https://api.github.com/repos/baditaflorin/group-theory-visualizer/commits/main",
    {
      headers: {
        Accept: "application/vnd.github+json"
      }
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub commit lookup failed: ${response.status}`);
  }

  const parsed = commitSchema.parse(await response.json());
  return {
    sha: parsed.sha,
    shortSha: parsed.sha.slice(0, 7),
    url: parsed.html_url,
    message: parsed.commit.message.split("\n")[0],
    date: parsed.commit.committer.date
  };
}
