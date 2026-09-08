type ReportTool = {
  detail: string;
};

const EXTERNAL_CALL_PATTERN = /external fetch|network|public socket|egress\s+(?:request|call)/i;
const NO_EXTERNAL_CALL_PATTERN = /no\s+external\s+fetch|no\s+network|egress\s+(?:syscalls|requests|calls):\s*0/i;

function Metric({ label, value, description }: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-widest text-faint">{label}</p>
      </div>
      <p className="mt-2 font-display text-3xl font-medium tabular-nums leading-none">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function WorkbenchReportMetrics({ tools }: { tools: ReportTool[] }) {
  const externalCalls = tools.filter(
    (tool) => EXTERNAL_CALL_PATTERN.test(tool.detail) && !NO_EXTERNAL_CALL_PATTERN.test(tool.detail),
  ).length;
  const allowedCalls = tools.length;

  return (
    <section aria-labelledby="workbench-report-calls">
      <p id="workbench-report-calls" className="font-mono text-xs uppercase tracking-widest text-faint">
        Call policy
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Metric label="External calls" value={externalCalls} description="Outside the local fence" />
        <Metric label="Allowed calls" value={allowedCalls} description="Local tools this run" />
      </div>
    </section>
  );
}
