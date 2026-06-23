const SEP = "\n\n\n";

const snippets = [
  `export async function createAgent(spec: AgentSpec) {
  const manifest = await loadManifest(spec.path);
  const tools = await mcp.connect(manifest.servers);
  const knowledge = await graph.bind(manifest.knowledge);
  return orchestrator.compose({ ...manifest, tools, knowledge });
}`,
  `agent.on("turn", async (ctx) => {
  const plan = await agent.plan(ctx.input);
  for (const step of plan.steps) {
    const out = await step.tool.invoke(step.args, ctx.scope);
    ctx.trace(step.id, out);
  }
  return agent.respond(ctx);
});`,
  `register(agent, { telemetry: true, policy });
type Action = { id: string; spec: string };
const typed = (a: Action) => bind(a.spec);
const usage = (e: AgentEvent) =>
  metrics.actionable(e).flush();`,
];

// Repeat a snippet into a tall, seamlessly-looping column.
const column = (snippet: string) => {
  const block = Array(6).fill(snippet).join(SEP) + SEP;
  return block + block;
};

const CodeBackground = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 z-0 flex justify-between gap-8 overflow-hidden px-2 sm:px-8"
    style={{
      maskImage:
        "linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)",
      WebkitMaskImage:
        "linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)",
    }}
  >
    {snippets.map((snippet, i) => (
      <pre
        key={i}
        className={`code-scroll-anim m-0 shrink-0 whitespace-pre font-mono text-[12px] leading-5 text-white/[0.08] sm:text-[13px] ${
          i === 1 ? "hidden md:block" : ""
        }`}
        style={{ animationDuration: `${46 + i * 11}s`, animationDelay: `${-i * 9}s` }}
      >
        {column(snippet)}
      </pre>
    ))}
  </div>
);

export default CodeBackground;
