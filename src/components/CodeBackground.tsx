const code = `export async function createAgent(spec: AgentSpec): Promise<Agent> {
  const manifest = await loadManifest(spec.manifestPath);
  const tools = await mcp.connect(manifest.servers);             // Model Context Protocol
  const knowledge = await graph.bind(manifest.knowledge);        // grounded sources

  const agent = orchestrator.compose({
    instructions: manifest.instructions,
    tools,
    knowledge,
    actions: manifest.actions.map(typedAction),
  });

  agent.on("turn", async (ctx) => {
    const plan = await agent.plan(ctx.input);
    for (const step of plan.steps) {
      const result = await step.tool.invoke(step.args, ctx.scope);
      ctx.trace(step.id, result);                                // measurable, governed
    }
    return agent.respond(ctx);
  });

  return register(agent, { telemetry: true, governance: spec.policy });
}

const trackUsage = (e: AgentEvent) => metrics.actionable(e).flush();`;

const CodeBackground = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    style={{
      maskImage:
        "linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent)",
      WebkitMaskImage:
        "linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent)",
    }}
  >
    <pre className="code-scroll-anim absolute left-1/2 top-0 m-0 -translate-x-1/2 whitespace-pre font-mono text-[12px] leading-5 text-white/[0.05] sm:text-[13px]">
      {code}
      {"\n\n"}
      {code}
      {"\n\n"}
    </pre>
  </div>
);

export default CodeBackground;
