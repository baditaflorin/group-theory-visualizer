import { Bot, Send, Server } from "lucide-react";
import { useMemo, useState } from "react";
import { readStoredValue, writeStoredValue } from "@/lib/storage";
import type { FiniteGroup, GroupInvariantSummary } from "@/features/groups/schema";
import { formatElements } from "@/features/groups/algebra";

type LocalAssistantProps = {
  group: FiniteGroup;
  summary: GroupInvariantSummary;
};

const defaultEndpoint =
  import.meta.env.VITE_LOCAL_LLM_ENDPOINT ?? "http://localhost:11434/api/generate";

export function LocalAssistant({ group, summary }: LocalAssistantProps) {
  const [endpoint, setEndpoint] = useState(() =>
    readStoredValue("gtv.llmEndpoint", defaultEndpoint, (value) => JSON.parse(value) as string)
  );
  const [model, setModel] = useState(() =>
    readStoredValue("gtv.llmModel", "llama3.2", (value) => JSON.parse(value) as string)
  );
  const [question, setQuestion] = useState("Explain what the Cayley graph reveals.");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const prompt = useMemo(() => {
    return `You are helping explain a finite group visualizer.

Group: ${group.name} (${group.shortName})
Order: ${group.order}
Presentation: ${group.presentation}
Abelian: ${summary.isAbelian ? "yes" : "no"}
Center: ${formatElements(group, summary.center)}
Exponent: ${summary.exponent}
Conjugacy classes: ${summary.conjugacyClasses.map((item) => `{${formatElements(group, item)}}`).join(", ")}

User question: ${question}

Answer in friendly, precise mathematical language.`;
  }, [group, question, summary]);

  const ask = async () => {
    setLoading(true);
    setError("");
    setAnswer("");
    writeStoredValue("gtv.llmEndpoint", endpoint);
    writeStoredValue("gtv.llmModel", model);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          prompt,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Local LLM returned ${response.status}`);
      }

      const data = (await response.json()) as {
        response?: string;
        text?: string;
        message?: { content?: string };
      };
      setAnswer(
        data.response ??
          data.text ??
          data.message?.content ??
          "The local model returned an empty answer."
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The local LLM request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[520px] flex-1 flex-col bg-white">
      <div className="border-b border-ink/10 px-4 py-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
          <Bot className="h-4 w-4 text-river" />
          Local LLM
        </h2>
        <p className="text-xs text-ink/60">Opt-in endpoint · no API keys · no hosted backend</p>
      </div>

      <div className="grid gap-4 overflow-auto p-4 xl:grid-cols-[420px_1fr]">
        <div className="grid content-start gap-3">
          <label className="grid gap-1 text-sm font-semibold text-ink">
            Endpoint
            <span className="relative">
              <Server className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45" />
              <input
                value={endpoint}
                onChange={(event) => setEndpoint(event.target.value)}
                className="h-10 w-full rounded border border-ink/15 bg-paper pl-9 pr-3 text-sm font-normal outline-none focus:border-river focus:ring-2 focus:ring-river/20"
              />
            </span>
          </label>
          <label className="grid gap-1 text-sm font-semibold text-ink">
            Model
            <input
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="h-10 rounded border border-ink/15 bg-paper px-3 text-sm font-normal outline-none focus:border-river focus:ring-2 focus:ring-river/20"
            />
          </label>
          <label className="grid gap-1 text-sm font-semibold text-ink">
            Question
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={6}
              className="resize-none rounded border border-ink/15 bg-paper p-3 text-sm font-normal outline-none focus:border-river focus:ring-2 focus:ring-river/20"
            />
          </label>
          <button
            onClick={() => void ask()}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded bg-ink px-4 text-sm font-semibold text-paper disabled:cursor-wait disabled:opacity-65"
          >
            <Send className="h-4 w-4" />
            {loading ? "Asking" : "Ask local model"}
          </button>
        </div>

        <div className="rounded border border-ink/10 bg-paper p-4 text-sm leading-6 text-ink">
          {error ? <p className="text-coral">{error}</p> : null}
          {answer ? <p className="whitespace-pre-wrap">{answer}</p> : null}
          {!answer && !error ? (
            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap text-xs text-ink/70">
              {prompt}
            </pre>
          ) : null}
        </div>
      </div>
    </section>
  );
}
